import React from 'react';
import RegionButtons from './RegionButtons';

export default function SearchComponent({ 
  searchKeyword, 
  setSearchKeyword, 
  selectedRegion, 
  setSelectedRegion, 
  currentLocation, 
  currentAddress, 
  onLocationRequest 
}) {
  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-header">
          <h3 className="search-title">
            🔍 검색 및 지역 선택
          </h3>
          
          <button
            onClick={onLocationRequest}
            className={`location-button ${currentLocation ? 'active' : 'inactive'}`}
            title="현재 위치 기준으로 새로고침"
          >
            📍 현재 위치
          </button>
        </div>
        
        {/* 검색어 입력 */}
        <div className="search-input-section">
          <input
            type="text"
            placeholder="시설명, 주소로 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          {currentAddress && (
            <div className="current-address">
              📍 현재 위치: {currentAddress}
            </div>
          )}
        </div>
        
        {/* 지역 선택 버튼 */}
        <RegionButtons 
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
      </div>
    </div>
  );
}
