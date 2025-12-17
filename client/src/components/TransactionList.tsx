import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
  return (
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
  );
}
