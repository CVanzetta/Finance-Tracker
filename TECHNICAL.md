# 💰 Finance Tracker - Technical Documentation

Application d'analyse financière sécurisée avec intégration Bridge API (Crédit Agricole compatible).

## 📋 Table des matières

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Sécurité](#sécurité)
- [Tests](#tests)
- [Déploiement](#déploiement)

## 🏗️ Architecture

```
┌─────────────┐      HTTP/REST      ┌──────────────┐      Bridge API v3     ┌─────────────┐
│   React     │ ◄─────────────────► │   Express    │ ◄───────────────────►  │   Bridge    │
│  Frontend   │                     │   Backend    │                        │   API       │
└─────────────┘                     └──────────────┘                        └─────────────┘
```

### Composants principaux

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **API externe**: Bridge API v3 (PSD2/DSP2)
- **Sécurité**: dotenv, CORS, express-session

## 🛠️ Technologies

### Frontend
- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.5
- Axios 1.7.9

### Backend
- Node.js (v16+)
- Express 4.21.2
- Axios 1.7.9
- dotenv 17.2.3
- express-session 1.18.1

## 📦 Installation

### Prérequis
- Node.js v16+ et npm
- Compte Bridge API (https://dashboard.bridgeapi.io/)

### Étapes

1. **Cloner le projet**
```bash
git clone <repository-url>
cd Finance-Tracker
```

2. **Installer les dépendances**
```bash
# Backend
cd server
npm install

# Frontend  
cd ../client
npm install
```

3. **Configuration environnement**
```bash
cd server
cp .env.example .env
# Éditer .env avec vos clés Bridge
```

## ⚙️ Configuration

### Variables d'environnement (server/.env)

```env
# Bridge API
BRIDGE_CLIENT_ID=your_client_id
BRIDGE_CLIENT_SECRET=your_client_secret
BRIDGE_ENVIRONMENT=sandbox

# Server
PORT=8000
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret_here
NODE_ENV=development
```

### Obtenir les clés Bridge API

1. Créer un compte sur https://dashboard.bridgeapi.io/
2. Créer une nouvelle application
3. Récupérer Client ID et Client Secret
4. Mode sandbox gratuit pour tests

## 📁 Structure du projet

```
Finance-Tracker/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   │   ├── CategoryList.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── Summary.tsx
│   │   ├── services/      # Services API
│   │   │   └── apiService.ts
│   │   ├── types/         # Types TypeScript
│   │   │   └── index.ts
│   │   ├── App.tsx        # Composant principal
│   │   └── main.tsx       # Point d'entrée
│   └── package.json
│
└── server/                # Backend Node.js
    ├── routes/            # Routes API
    │   └── api.js
    ├── services/          # Logique métier
    │   ├── bridgeService.js
    │   └── analyticsService.js
    ├── index.js           # Point d'entrée
    ├── .env              # Variables d'environnement (non versionné)
    ├── .env.example      # Template de configuration
    └── package.json
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
Response: { status: "OK", message: "...", environment: "sandbox" }
```

### Connexion banque
```
POST /api/bridge/connect-url
Body: { email?: string }
Response: { connect_url: string, user_uuid: string }
```

### Comptes bancaires
```
GET /api/accounts
Response: { resources: Account[] }
```

### Transactions
```
GET /api/transactions?limit=100&since=2024-01-01
Query params: limit, account_id, since, until
Response: { resources: Transaction[] }
```

### Analytics
```
GET /api/analytics/categories
Query params: since, until
Response: { 
  categories: Category[], 
  summary: { totalExpenses, totalIncome, balance, transactionCount }
}
```

## 🔒 Sécurité

### Mesures implémentées

1. **Variables d'environnement**
   - Clés API non versionnées
   - `.env` dans `.gitignore`

2. **CORS**
   - Origin restreint au frontend
   - Credentials autorisés

3. **Sessions**
   - httpOnly cookies
   - Secure en production
   - Expiration 24h

4. **Conformité PSD2**
   - Bridge API certifié DSP2
   - SCA (Strong Customer Authentication)

### Recommandations production

- [ ] Utiliser HTTPS
- [ ] Changer SESSION_SECRET
- [ ] Activer helmet.js
- [ ] Rate limiting
- [ ] Logs sécurisés
- [ ] Monitoring (Sentry, DataDog)

## 🧪 Tests

### Lancer les tests
```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

### Mode sandbox
Utiliser les identifiants de test Bridge :
- **Login**: `user_good`
- **Password**: `password`

## 🚀 Déploiement

### Développement
```bash
# Terminal 1 - Backend
cd server
npm run server

# Terminal 2 - Frontend
cd client
npm run dev
```

### Production

1. **Build frontend**
```bash
cd client
npm run build
```

2. **Configurer variables production**
```env
NODE_ENV=production
BRIDGE_ENVIRONMENT=production
```

3. **Démarrer serveur**
```bash
cd server
node index.js
```

### Plateformes recommandées
- **Backend**: Heroku, Railway, Render
- **Frontend**: Vercel, Netlify
- **Full-stack**: Railway, Render

## 📊 Monitoring

### Logs
```javascript
// Backend console logs
console.log('🚀 Serveur démarré...')
console.error('Erreur API Bridge:', error)
```

### Métriques à surveiller
- Temps de réponse API
- Erreurs Bridge API
- Sessions actives
- Taux d'erreur transactions

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'feat: Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

MIT

## 🆘 Support

- Documentation Bridge: https://docs.bridgeapi.io/
- Issues GitHub: [lien vers issues]

<!-- Update: 2025-04-02 16:23:00 -->

<!-- Update: 2025-03-28 18:21:00 -->

<!-- Update: 2025-04-02 15:00:00 -->
