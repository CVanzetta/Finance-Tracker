import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

axios.defaults.baseURL = "http://localhost:8000"

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  category_name: string
}

interface Category {
  name: string
  total: number
  count: number
  percentage: string
}

interface Summary {
  totalExpenses: string
  totalIncome: string
  balance: string
  transactionCount: number
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'transactions' | 'categories'>('categories')

  // Charger les données au démarrage
  useEffect(() => {
    checkHealth()
    loadAnalytics()
  }, [])

  const checkHealth = async () => {
    try {
      const response = await axios.get("/api/health")
      console.log("API Status:", response.data)
    } catch (error) {
      console.error("Erreur connexion API:", error)
    }
  }

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/analytics/categories")
      setCategories(response.data.categories)
      setSummary(response.data.summary)
    } catch (error) {
      console.error("Erreur chargement analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/transactions", {
        params: { limit: 50 }
      })
      setTransactions(response.data.resources || [])
    } catch (error) {
      console.error("Erreur chargement transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const connectBank = async () => {
    try {
      const response = await axios.post("/api/bridge/connect-url")
      if (response.data.connect_url) {
        window.open(response.data.connect_url, '_blank')
      }
    } catch (error) {
      console.error("Erreur connexion banque:", error)
      alert("Erreur: Vérifiez vos clés Bridge API dans le fichier .env")
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>💰 Finance Tracker</h1>
        <p style={{ color: '#666', margin: '5px 0 15px 0' }}>
          Analysez vos dépenses Crédit Agricole
        </p>
        <button 
          onClick={connectBank}
          style={{
            background: '#0066cc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🏦 Connecter ma banque
        </button>
      </header>

      {summary && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffc107' }}>
            <div style={{ fontSize: '12px', color: '#856404', fontWeight: 'bold' }}>REVENUS</div>
            <div style={{ fontSize: '24px', color: '#28a745', fontWeight: 'bold' }}>
              +{parseFloat(summary.totalIncome).toFixed(2)}€
            </div>
          </div>
          <div style={{ background: '#f8d7da', padding: '20px', borderRadius: '8px', border: '1px solid #dc3545' }}>
            <div style={{ fontSize: '12px', color: '#721c24', fontWeight: 'bold' }}>DÉPENSES</div>
            <div style={{ fontSize: '24px', color: '#dc3545', fontWeight: 'bold' }}>
              -{parseFloat(summary.totalExpenses).toFixed(2)}€
            </div>
          </div>
          <div style={{ background: '#d1ecf1', padding: '20px', borderRadius: '8px', border: '1px solid #17a2b8' }}>
            <div style={{ fontSize: '12px', color: '#0c5460', fontWeight: 'bold' }}>SOLDE</div>
            <div style={{ 
              fontSize: '24px', 
              color: parseFloat(summary.balance) >= 0 ? '#28a745' : '#dc3545',
              fontWeight: 'bold' 
            }}>
              {parseFloat(summary.balance).toFixed(2)}€
            </div>
          </div>
          <div style={{ background: '#e2e3e5', padding: '20px', borderRadius: '8px', border: '1px solid #6c757d' }}>
            <div style={{ fontSize: '12px', color: '#383d41', fontWeight: 'bold' }}>TRANSACTIONS</div>
            <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
              {summary.transactionCount}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => { setView('categories'); loadAnalytics(); }}
          style={{
            background: view === 'categories' ? '#333' : '#fff',
            color: view === 'categories' ? '#fff' : '#333',
            border: '1px solid #333',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px 0 0 5px'
          }}
        >
          📊 Par Catégories
        </button>
        <button
          onClick={() => { setView('transactions'); loadTransactions(); }}
          style={{
            background: view === 'transactions' ? '#333' : '#fff',
            color: view === 'transactions' ? '#fff' : '#333',
            border: '1px solid #333',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '0 5px 5px 0',
            borderLeft: 'none'
          }}
        >
          📋 Transactions
        </button>
      </div>

      {loading && <p>Chargement...</p>}

      {view === 'categories' && categories.length > 0 && (
        <div>
          <h2 style={{ color: '#333' }}>Dépenses par catégorie</h2>
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
            {categories.map((cat, index) => (
              <div 
                key={index}
                style={{
                  padding: '15px 20px',
                  borderBottom: index < categories.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {cat.count} transaction{cat.count > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>
                    {cat.total.toFixed(2)}€
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {cat.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'transactions' && transactions.length > 0 && (
        <div>
          <h2 style={{ color: '#333' }}>Dernières transactions</h2>
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
            {transactions.map((transaction, index) => (
              <div 
                key={transaction.id}
                style={{
                  padding: '15px 20px',
                  borderBottom: index < transactions.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {transaction.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {transaction.category_name} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: transaction.amount >= 0 ? '#28a745' : '#dc3545'
                }}>
                  {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}€
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && categories.length === 0 && transactions.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#666' }}>🏦 Aucune banque connectée</h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>
            Cliquez sur "Connecter ma banque" pour démarrer
          </p>
          <div style={{ 
            background: '#fff3cd', 
            padding: '15px', 
            borderRadius: '5px',
            border: '1px solid #ffc107',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
              💡 <strong>Mode Test (Sandbox)</strong><br/>
              Utilisez n'importe quelle banque avec :<br/>
              Login: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>user_good</code><br/>
              Password: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>password</code>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
