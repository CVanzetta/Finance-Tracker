const axios = require('axios');

/**
 * Service pour interagir avec l'API Bridge
 * Documentation: https://docs.bridgeapi.io/
 */
class BridgeService {
  constructor() {
    this.apiUrl = 'https://api.bridgeapi.io/v3';
    this.version = '2025-01-15';
  }

  /**
   * Génère les headers requis pour les appels API Bridge
   * @returns {Object} Headers Bridge API
   */
  getHeaders() {
    return {
      'Bridge-Version': this.version,
      'Client-Id': process.env.BRIDGE_CLIENT_ID,
      'Client-Secret': process.env.BRIDGE_CLIENT_SECRET,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Crée un nouvel utilisateur Bridge
   * @returns {Promise<string>} UUID de l'utilisateur créé
   */
  async createUser() {
    const response = await axios.post(
      `${this.apiUrl}/aggregation/users`,
      {},
      { headers: this.getHeaders() }
    );
    return response.data.uuid;
  }

  /**
   * Authentifie un utilisateur et retourne un token d'accès
   * @param {string} userUuid - UUID de l'utilisateur
   * @returns {Promise<string>} Token d'accès
   */
  async authenticateUser(userUuid) {
    const response = await axios.post(
      `${this.apiUrl}/aggregation/authorization/token`,
      { user_uuid: userUuid },
      { headers: this.getHeaders() }
    );
    return response.data.access_token;
  }

  /**
   * Crée une session de connexion pour lier une banque
   * @param {string} accessToken - Token d'authentification
   * @param {string} email - Email de l'utilisateur (optionnel)
   * @returns {Promise<string>} URL de connexion Bridge
   */
  async createConnectSession(accessToken, email = 'user@example.com') {
    const response = await axios.post(
      `${this.apiUrl}/aggregation/connect-sessions`,
      { user_email: email },
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data.url;
  }

  /**
   * Récupère les transactions
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise<Object>} Données des transactions
   */
  async getTransactions(params = {}) {
    const response = await axios.get(
      `${this.apiUrl}/transactions`,
      {
        headers: this.getHeaders(),
        params: {
          limit: params.limit || 100,
          ...(params.account_id && { account_id: params.account_id }),
          ...(params.since && { since: params.since }),
          ...(params.until && { until: params.until })
        }
      }
    );
    return response.data;
  }

  /**
   * Récupère les comptes bancaires
   * @returns {Promise<Object>} Données des comptes
   */
  async getAccounts() {
    const response = await axios.get(
      `${this.apiUrl}/accounts`,
      { headers: this.getHeaders() }
    );
    return response.data;
  }
}

module.exports = new BridgeService();
