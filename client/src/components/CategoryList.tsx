import { Category } from '../types';

interface Props {
  categories: Category[];
}

export default function CategoryList({ categories }: Props) {
  return (
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
  );
}
