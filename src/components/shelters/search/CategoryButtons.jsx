export default function CategoryButtons({ 
  searchCategory, 
  onCategoryChange, 
  categoryNames 
}) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {Object.entries(categoryNames).map(([key, name]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              backgroundColor: searchCategory === key ? '#007bff' : '#fff',
              color: searchCategory === key ? 'white' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
