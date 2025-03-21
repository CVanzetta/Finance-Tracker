# 💰 Finance Tracker - Analyseur de Dépenses

Application web sécurisée pour analyser vos dépenses bancaires via **Bridge API** (compatible Crédit Agricole).

## 🚀 Fonctionnalités

✅ Connexion sécurisée à votre banque (Crédit Agricole et autres)  
✅ Récupération automatique des transactions  
✅ Analyse des dépenses par catégorie  
✅ Visualisation des revenus et dépenses  
✅ Interface moderne et responsive  

## 🛠️ Stack Technique

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **API Bancaire**: Bridge API (DSP2/PSD2)
- **Sécurité**: Variables d'environnement, sessions, CORS

## 📋 Prérequis

1. **Node.js** (v16 ou supérieur)
2. **Compte Bridge API** (gratuit) - https://dashboard.bridgeapi.io/

## ⚙️ Installation

### 1. Cloner le projet
\`\`\`bash
cd Finance-Tracker
\`\`\`

### 2. Installer les dépendances

**Backend:**
\`\`\`bash
cd server
npm install
\`\`\`

**Frontend:**
\`\`\`bash
cd client
npm install
\`\`\`

### 3. Configuration Bridge API

1. Créez un compte sur https://dashboard.bridgeapi.io/
2. Créez une nouvelle application
3. Récupérez vos clés `CLIENT_ID` et `CLIENT_SECRET`
4. Dans le dossier `server/`, copiez `.env.example` vers `.env`
5. Remplissez vos clés dans `server/.env`:

\`\`\`env
BRIDGE_CLIENT_ID=votre_client_id
BRIDGE_CLIENT_SECRET=votre_client_secret
BRIDGE_ENVIRONMENT=sandbox
\`\`\`

## 🚀 Démarrage

### 1. Démarrer le backend
\`\`\`bash
cd server
npm run server
\`\`\`
Le serveur démarre sur http://localhost:8000

### 2. Démarrer le frontend
\`\`\`bash
cd client
npm run dev
\`\`\`
L'application démarre sur http://localhost:5173

## 📊 Utilisation

1. Ouvrez http://localhost:5173
2. Cliquez sur "🏦 Connecter ma banque"
3. Suivez le processus de connexion Bridge
4. Autorisez l'accès à votre compte Crédit Agricole
5. Visualisez vos dépenses par catégorie !

## 🔒 Sécurité

- ✅ Variables d'environnement pour les clés API
- ✅ Fichier `.env` dans `.gitignore`
- ✅ CORS configuré
- ✅ Sessions sécurisées
- ✅ Conformité PSD2 via Bridge API
- ⚠️ En production: utilisez HTTPS et des secrets forts

## 📡 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/health` | GET | Vérifier le statut de l'API |
| `/api/bridge/connect-url` | POST | Obtenir l'URL de connexion banque |
| `/api/accounts` | GET | Récupérer les comptes bancaires |
| `/api/transactions` | GET | Récupérer les transactions |
| `/api/analytics/categories` | GET | Analyse par catégorie |

## 🌍 Environnements Bridge

- **Sandbox**: Tests avec données fictives
- **Production**: Données bancaires réelles (après validation Bridge)

## 💡 Prochaines étapes

- [ ] Ajout de graphiques (Chart.js)
- [ ] Export des données (CSV/PDF)
- [ ] Budgets personnalisés
- [ ] Notifications de dépenses
- [ ] Mode multi-comptes

## 🐛 Résolution de problèmes

**Erreur "CLIENT_ID is not defined"**  
→ Vérifiez que le fichier `server/.env` existe et contient vos clés Bridge

**Pas de transactions affichées**  
→ Vérifiez que vous avez bien connecté votre banque via Bridge

**CORS Error**  
→ Vérifiez que `CLIENT_URL` dans `.env` correspond à votre URL frontend

## 📝 License

MIT - Projet personnel

---

**⚠️ Important**: Ne commitez JAMAIS votre fichier `.env` ! Vos clés API doivent rester secrètes.

<!-- Update: 2025-03-27 12:39:00 -->

<!-- Update: 2025-03-24 11:31:00 -->

<!-- Update: 2025-03-20 09:59:00 -->

<!-- Update: 2025-04-01 12:30:00 -->

<!-- Update: 2025-03-18 12:22:00 -->

<!-- Update: 2025-03-27 16:48:00 -->

<!-- Update: 2025-03-27 11:09:00 -->

<!-- Update: 2025-03-20 18:46:00 -->

<!-- Update: 2025-03-26 16:36:00 -->

<!-- Update: 2025-03-19 10:10:00 -->

<!-- Update: 2025-03-31 11:24:00 -->

<!-- Update: 2025-03-25 11:01:00 -->

<!-- Update: 2025-03-27 13:45:00 -->
<!-- Update: 2025-03-21 10:14:00 -->