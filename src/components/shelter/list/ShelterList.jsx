import React from 'react';
import ShelterCard from './ShelterCard';

export default function ShelterList({ shelters, maxItems = 50 }) {
  return (
    <div className="shelter-list-section">
      <h2 className="shelter-list-title">
        🏠 무더위쉼터 목록 ({shelters.length}곳)
      </h2>
      
      <div className="shelter-list-container">
        {shelters.length === 0 ? (
          <div className="no-results">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="shelter-list">
            {shelters.slice(0, maxItems).map((shelter, index) => (
              <ShelterCard 
                key={index} 
                shelter={shelter} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
