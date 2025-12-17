require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const session = require("express-session");

const app = express();

// Configuration
const PORT = process.env.PORT || 8000;
const BRIDGE_API_URL = "https://api.bridgeapi.io/v3";
const BRIDGE_VERSION = "2025-01-15";

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true en HTTPS
}));

// Helper: Headers Bridge API v3
function getBridgeHeaders() {
  return {
    "Bridge-Version": BRIDGE_VERSION,
    "Client-Id": process.env.BRIDGE_CLIENT_ID,
    "Client-Secret": process.env.BRIDGE_CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
}

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK",
    message: "Finance Tracker API fonctionnelle",
    environment: process.env.BRIDGE_ENVIRONMENT
  });
});

// 1. Créer une session Bridge pour connecter une banque
app.post("/api/bridge/connect-url", async (req, res) => {
  try {
    // Étape 1: Créer un utilisateur Bridge
    const userResponse = await axios.post(
      `${BRIDGE_API_URL}/aggregation/users`,
      {},
      { headers: getBridgeHeaders() }
    );
    
    const userUuid = userResponse.data.uuid;
    
    // Étape 2: Obtenir un token d'authentification
    const authResponse = await axios.post(
      `${BRIDGE_API_URL}/aggregation/authorization/token`,
      { user_uuid: userUuid },
      { headers: getBridgeHeaders() }
    );
    
    const accessToken = authResponse.data.access_token;
    
    // Étape 3: Créer une session de connexion
    const connectResponse = await axios.post(
      `${BRIDGE_API_URL}/aggregation/connect-sessions`,
      { user_email: req.body.email || "user@example.com" },
      {
        headers: {
          ...getBridgeHeaders(),
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      connect_url: connectResponse.data.url,
      user_uuid: userUuid
    });
  } catch (error) {
    console.error("Erreur création URL de connexion:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Impossible de créer l'URL de connexion",
      details: error.response?.data || error.message 
    })
  }
});

// 2. Récupérer les comptes bancaires
app.get("/api/accounts", async (req, res) => {
  try {
    const response = await axios.get(`${BRIDGE_API_URL}/accounts`, {
      headers: getBridgeHeaders()
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erreur récupération comptes:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Impossible de récupérer les comptes",
      details: error.response?.data || error.message 
    });
  }
});

// 3. Récupérer les transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const { account_id, since, until, limit = 100 } = req.query;
    
    const params = {
      limit,
      ...(account_id && { account_id }),
      ...(since && { since }),
      ...(until && { until })
    };

    const response = await axios.get(`${BRIDGE_API_URL}/transactions`, {
      headers: getBridgeHeaders(),
      params
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erreur récupération transactions:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Impossible de récupérer les transactions",
      details: error.response?.data || error.message 
    });
  }
});

// 4. Analyser les dépenses par catégorie
app.get("/api/analytics/categories", async (req, res) => {
  try {
    const { since, until } = req.query;
    
    // Récupérer toutes les transactions
    const response = await axios.get(`${BRIDGE_API_URL}/transactions`, {
      headers: getBridgeHeaders(),
      params: {
        limit: 500,
        ...(since && { since }),
        ...(until && { until })
      }
    });

    const transactions = response.data.resources || [];
    
    // Grouper par catégorie
    const categoryMap = {};
    let totalExpenses = 0;
    let totalIncome = 0;

    transactions.forEach(transaction => {
      const amount = transaction.amount;
      const category = transaction.category_name || "Non catégorisé";
      
      if (amount < 0) {
        // Dépense
        totalExpenses += Math.abs(amount);
        if (!categoryMap[category]) {
          categoryMap[category] = { total: 0, count: 0, transactions: [] };
        }
        categoryMap[category].total += Math.abs(amount);
        categoryMap[category].count += 1;
        categoryMap[category].transactions.push(transaction);
      } else {
        // Revenu
        totalIncome += amount;
      }
    });

    // Convertir en tableau trié
    const categories = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      total: data.total,
      count: data.count,
      percentage: (data.total / totalExpenses * 100).toFixed(1)
    })).sort((a, b) => b.total - a.total);

    res.json({
      categories,
      summary: {
        totalExpenses: totalExpenses.toFixed(2),
        totalIncome: totalIncome.toFixed(2),
        balance: (totalIncome - totalExpenses).toFixed(2),
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    console.error("Erreur analyse catégories:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Impossible d'analyser les catégories",
      details: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 Environnement: ${process.env.BRIDGE_ENVIRONMENT}`);
});
