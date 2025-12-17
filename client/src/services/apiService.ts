import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

/**
 * Service pour interagir avec l'API Finance Tracker
 */
class ApiService {
  /**
   * Vérifie l'état de l'API
   */
  async checkHealth() {
    const response = await axios.get('/api/health');
    return response.data;
  }

  /**
   * Crée une URL de connexion Bridge
   * @param {string} email - Email optionnel
   */
  async createConnectUrl(email = '') {
    const response = await axios.post('/api/bridge/connect-url', { email });
    return response.data.connect_url;
  }

  /**
   * Récupère les comptes bancaires
   */
  async getAccounts() {
    const response = await axios.get('/api/accounts');
    return response.data;
  }

  /**
   * Récupère les transactions
   * @param {Object} params - Paramètres de filtrage
   */
  async getTransactions(params = {}) {
    const response = await axios.get('/api/transactions', { params });
    return response.data;
  }

  /**
   * Récupère l'analyse par catégories
   * @param {Object} params - Paramètres de filtrage (since, until)
   */
  async getCategoriesAnalytics(params = {}) {
    const response = await axios.get('/api/analytics/categories', { params });
    return response.data;
  }
}

export default new ApiService();
