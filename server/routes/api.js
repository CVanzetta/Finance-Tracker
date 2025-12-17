const express = require('express');
const bridgeService = require('../services/bridgeService');
const analyticsService = require('../services/analyticsService');

const router = express.Router();

/**
 * Valide le format d'un email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide, false sinon
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitise les erreurs pour ne pas exposer d'informations sensibles
 * @param {Error} error - Erreur à sanitiser
 * @returns {string} Message d'erreur sécurisé
 */
function sanitizeError(error) {
  // Ne jamais renvoyer les détails complets de l'API
  // Seulement un message générique
  if (error.response?.status === 401) {
    return 'Erreur d\'authentification';
  }
  if (error.response?.status === 403) {
    return 'Accès refusé';
  }
  if (error.response?.status === 404) {
    return 'Ressource non trouvée';
  }
  if (error.response?.status >= 500) {
    return 'Erreur du service externe';
  }
  return 'Une erreur est survenue';
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
    // Valider l'email si fourni
    if (req.body.email && !isValidEmail(req.body.email)) {
      return res.status(400).json({
        error: 'Format d\'email invalide'
      });
    }

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
    console.error('Erreur création URL de connexion:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible de créer l\'URL de connexion',
      details: sanitizeError(error)
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
    console.error('Erreur récupération comptes:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible de récupérer les comptes',
      details: sanitizeError(error)
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
    console.error('Erreur récupération transactions:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible de récupérer les transactions',
      details: sanitizeError(error)
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
    console.error('Erreur analyse catégories:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Impossible d\'analyser les catégories',
      details: sanitizeError(error)
    });
  }
});

module.exports = router;
