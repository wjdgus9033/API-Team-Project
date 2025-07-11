export default function SearchResults({ places, pagination, onPagination }) {
  if (places.length === 0) return null;

  return (
    <div style={{ marginTop: '10px' }}>
      <h4>검색 결과</h4>
      <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {places.map((place, i) => (
          <li key={i} style={{ marginBottom: '5px', fontSize: '14px' }}>
            <strong>{place.place_name}</strong><br />
            {place.road_address_name || place.address_name}
          </li>
        ))}
      </ul>
      
      {pagination && (
        <div style={{ marginTop: '10px' }}>
          {[...Array(pagination.last)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPagination(i + 1)}
              style={{
                marginRight: '5px',
                backgroundColor: pagination.current === (i + 1) ? '#007bff' : '#f8f9fa',
                color: pagination.current === (i + 1) ? 'white' : 'black',
                border: '1px solid #ccc',
                padding: '5px 10px'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
