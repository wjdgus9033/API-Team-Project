export default function ShelterCard({ shelter, rank, onCardClick }) {
  const handleClick = () => {
    if (onCardClick && shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0) {
      onCardClick(shelter);
    }
  };

  return (
    <div 
      className="shelter-item" 
      onClick={handleClick}
      style={{ 
        cursor: shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0 ? 'pointer' : 'default',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
      }}
      onMouseEnter={(e) => {
        if (shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0) {
          e.target.style.backgroundColor = '#f8f9fa';
          e.target.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '';
        e.target.style.transform = '';
      }}
    >
      <h4 className="shelter-name">
        <span className="shelter-name-text">
          {rank && (
            <span style={{ 
              color: '#0066CC', 
              fontWeight: 'bold', 
              marginRight: '4px',
              fontSize: '12px'
            }}>
              {rank}.
            </span>
          )}
          📍 {shelter.name}
          {shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0 && (
            <span style={{ 
              marginLeft: '8px',
              fontSize: '10px',
              color: '#0066CC',
              fontWeight: 'normal'
            }}>
              🗺️ 지도에서 보기
            </span>
          )}
        </span>
        {shelter.distance && (
          <span className="shelter-distance">
            {shelter.distance.toFixed(1)}km
          </span>
        )}
      </h4>
      <p className="shelter-info address">
        <strong>주소:</strong> {shelter.roadAddress}
      </p>
      <p className="shelter-info">
        <strong>운영시간:</strong> {shelter.weekday}
      </p>
      <p className="shelter-info last">
        <strong>전화:</strong> {shelter.tel}
      </p>
    </div>
  );
}
