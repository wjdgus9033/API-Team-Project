export default function ShelterCard({ shelter, rank, onCardClick }) {
  // 시간 포맷팅 함수
  const formatOperatingHours = (timeString) => {
    if (!timeString) return '운영시간 정보 없음';
    
    // 숫자만 추출하여 시간 범위 찾기 (예: "0900 ~ 1600" -> ["0900", "1600"])
    const timeMatches = timeString.match(/\d{4}/g);
    if (!timeMatches || timeMatches.length < 2) return timeString;
    
    const formatTime = (time) => {
      const hour = parseInt(time.substring(0, 2));
      const minute = time.substring(2, 4);
      
      if (hour === 0) return `오전 12시${minute !== '00' ? ` ${minute}분` : ''}`;
      if (hour < 12) return `오전 ${hour}시${minute !== '00' ? ` ${minute}분` : ''}`;
      if (hour === 12) return `오후 12시${minute !== '00' ? ` ${minute}분` : ''}`;
      return `오후 ${hour - 12}시${minute !== '00' ? ` ${minute}분` : ''}`;
    };
    
    const startTime = formatTime(timeMatches[0]);
    const endTime = formatTime(timeMatches[1]);
    
    return `${startTime} ~ ${endTime}`;
  };

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
        <strong>운영시간:</strong> {formatOperatingHours(shelter.weekday)}
      </p>
      <p className="shelter-info last">
        <strong>전화:</strong> {shelter.tel}
      </p>
    </div>
  );
}
