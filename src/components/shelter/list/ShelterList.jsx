import ShelterCard from './ShelterCard';

export default function ShelterList({ shelters, maxItems = 20, currentLocation, onShelterClick }) {
  const displayedShelters = shelters.slice(0, maxItems);
  
  return (
    <div className="shelter-list-section">
      <h2 className="shelter-list-title">
        🏠 무더위쉼터 목록 ({shelters.length}곳)
        {currentLocation && (
          <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#666', marginTop: '4px' }}>
            📍 현재 위치 기준 거리순 정렬 (상위 {maxItems}개 표시)
          </div>
        )}
      </h2>
      
      <div className="shelter-list-container">
        {shelters.length === 0 ? (
          <div className="no-results">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="shelter-list">
            {displayedShelters.map((shelter, index) => (
              <ShelterCard 
                key={index} 
                shelter={shelter} 
                rank={index + 1} // 순위 추가
                onCardClick={onShelterClick} // 클릭 이벤트 전달
              />
            ))}
            {shelters.length > maxItems && (
              <div style={{ 
                padding: '10px', 
                textAlign: 'center', 
                color: '#666', 
                fontSize: '12px',
                borderTop: '1px solid #eee',
                marginTop: '10px'
              }}>
                {currentLocation 
                  ? `가장 가까운 ${maxItems}개만 표시됩니다 (전체 ${shelters.length}개)`
                  : `상위 ${maxItems}개만 표시됩니다 (전체 ${shelters.length}개)`
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
