const express = require('express');
const bridgeService = require('../services/bridgeService');
const analyticsService = require('../services/analyticsService');

const router = express.Router();

/**
 * Sanitize error responses to prevent exposing sensitive information.
 * Never returns raw error.response?.data as it may contain sensitive info like API keys or tokens.
 * @param {Error} error - The error object from axios or other sources
 * @returns {string} Safe, user-friendly error message
 */
function getSafeErrorMessage(error) {
  // Return generic user-friendly messages based on HTTP status codes
  const status = error.response?.status;
  
  if (status === 401 || status === 403) {
    return 'Erreur d\'authentification. Veuillez vérifier vos identifiants.';
  }
  if (status === 404) {
    return 'Ressource non trouvée.';
  }
  if (status === 429) {
    return 'Trop de requêtes. Veuillez réessayer plus tard.';
  }
  if (status >= 500) {
    return 'Erreur du service externe. Veuillez réessayer plus tard.';
  }
  
  // Generic fallback message
  return 'Une erreur s\'est produite. Veuillez réessayer.';
}

/**
 * @route GET /api/health
 * @desc Vérification de l'état de l'API
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Finance Tracker API fonctionnelle',
    environment: process.env.BRIDGE_ENVIRONMENT || 'sandbox'
  });
});

/**
 * @route POST /api/bridge/connect-url
 * @desc Créer une URL de connexion Bridge pour lier une banque
 * @access Public
 * @body {string} email - Email de l'utilisateur (optionnel)
 */
router.post('/bridge/connect-url', async (req, res) => {
  try {
    // Créer un utilisateur Bridge
    const userUuid = await bridgeService.createUser();

    // Authentifier l'utilisateur
    const accessToken = await bridgeService.authenticateUser(userUuid);

    // Créer une session de connexion
    const connectUrl = await bridgeService.createConnectSession(
      accessToken,
      req.body.email
    );

    res.json({
      connect_url: connectUrl,
      user_uuid: userUuid
    });
  } catch (error) {
    console.error('Erreur création URL de connexion:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible de créer l\'URL de connexion',
      message: getSafeErrorMessage(error)
    });
  }
});

/**
 * @route GET /api/accounts
 * @desc Récupérer tous les comptes bancaires
 * @access Public
 */
router.get('/accounts', async (req, res) => {
  try {
    const accounts = await bridgeService.getAccounts();
    res.json(accounts);
  } catch (error) {
    console.error('Erreur récupération comptes:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible de récupérer les comptes',
      message: getSafeErrorMessage(error)
    });
  }
});

/**
 * @route GET /api/transactions
 * @desc Récupérer les transactions avec filtres optionnels
 * @access Public
 * @query {number} limit - Nombre max de transactions (défaut: 100)
 * @query {string} account_id - Filtrer par compte
 * @query {string} since - Date de début
 * @query {string} until - Date de fin
 */
router.get('/transactions', async (req, res) => {
  try {
    const { account_id, since, until, limit } = req.query;

    const transactions = await bridgeService.getTransactions({
      limit: parseInt(limit) || 100,
      account_id,
      since,
      until
    });

    res.json(transactions);
  } catch (error) {
    console.error('Erreur récupération transactions:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible de récupérer les transactions',
      message: getSafeErrorMessage(error)
    });
  }
});

/**
 * @route GET /api/analytics/categories
 * @desc Analyser les dépenses par catégorie
 * @access Public
 * @query {string} since - Date de début
 * @query {string} until - Date de fin
 */
router.get('/analytics/categories', async (req, res) => {
  try {
    const { since, until } = req.query;

    // Récupérer les transactions
    const response = await bridgeService.getTransactions({
      limit: 500,
      since,
      until
    });

    const transactions = response.resources || [];

    // Analyser par catégorie
    const analysis = analyticsService.analyzeByCategory(transactions);

    res.json(analysis);
  } catch (error) {
    console.error('Erreur analyse catégories:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible d\'analyser les catégories',
      message: getSafeErrorMessage(error)
    });
  }
});

module.exports = router;
