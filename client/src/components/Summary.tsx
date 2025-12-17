import { Summary as SummaryType } from '../types';

interface Props {
  summary: SummaryType;
}

export default function Summary({ summary }: Props) {
  const balance = parseFloat(summary.balance);

  return (
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
          color: balance >= 0 ? '#28a745' : '#dc3545',
          fontWeight: 'bold' 
        }}>
          {balance.toFixed(2)}€
        </div>
      </div>

      <div style={{ background: '#e2e3e5', padding: '20px', borderRadius: '8px', border: '1px solid #6c757d' }}>
        <div style={{ fontSize: '12px', color: '#383d41', fontWeight: 'bold' }}>TRANSACTIONS</div>
        <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
          {summary.transactionCount}
        </div>
      </div>
    </div>
  );
}
