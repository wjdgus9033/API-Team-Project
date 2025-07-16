import React, { useState, useEffect, useCallback } from 'react';
import './test.css';

// Hooks
import { useShelterData, useCurrentLocation } from './hooks';
import { useFilteredData } from './common';

// Components
import { MapComponent } from './map';
import { SearchComponent } from './search';
import { ShelterList, LoadingComponent } from './list';

export default function Test() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null); // 지도 상태를 직접 관리
  const [selectedShelter, setSelectedShelter] = useState(null); // 선택된 쉼터 상태 추가

  // Custom hooks
  const { 
    shelterData, 
    loading, 
    error: dataError, 
    loadingProgress, 
    fetchShelterData 
  } = useShelterData();

  const { 
    currentLocation, 
    currentAddress, 
    getCurrentLocation 
  } = useCurrentLocation();

  const filteredData = useFilteredData(
    shelterData, 
    selectedRegion, 
    searchKeyword, 
    currentLocation
  );

  // 모든 카테고리에서 전체 데이터를 표시 (지역별 제한 제거)
  const maxItems = filteredData.length;

  // 에러 상태 통합 관리
  useEffect(() => {
    setError(dataError);
  }, [dataError]);

  // 카테고리나 검색어 변경 시 선택된 쉼터 초기화
  useEffect(() => {
    if (selectedShelter) {
      console.log('카테고리/검색어 변경으로 선택된 쉼터 초기화');
      setSelectedShelter(null);
    }
  }, [selectedRegion, searchKeyword]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchShelterData();
  }, []); // 빈 배열로 변경하여 컴포넌트 마운트 시에만 실행

  // 현재 위치 요청 핸들러
  const handleLocationRequest = useCallback(async () => {
    try {
      console.log('현재 위치 요청 시작...');
      setError(null);
      await getCurrentLocation();
      console.log('현재 위치 요청 완료');
    } catch (error) {
      console.error('현재 위치 요청 실패:', error);
      setError(error.message);
    }
  }, [getCurrentLocation]);

  // 지도 준비 완료 핸들러
  const handleMapReady = useCallback((mapInstance) => {
    console.log('지도 준비 완료:', mapInstance);
    setMap(mapInstance); // 지도 상태 설정
    setError(null); // 지도 초기화 성공 시 에러 상태 제거
    // 지도가 준비되면 현재 위치 가져오기
    handleLocationRequest();
  }, [handleLocationRequest]);

  // 쉼터 카드 클릭 핸들러
  const handleShelterClick = useCallback((shelter) => {
    console.log('쉼터 카드 클릭:', shelter.name);
    setSelectedShelter(shelter);
  }, []);

  // 로딩 중일 때
  if (loading) {
    return <LoadingComponent loadingProgress={loadingProgress} />;
  }

  return (
    <div className="all-container">
      <div className="shelter-container">
        {/* 왼쪽 영역: 지도와 검색 */}
        <div className="left-section">
          <h1 className="main-title">
            전국 무더위쉼터 정보
          </h1>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* 카카오지도 섹션 */}
          <MapComponent 
            filteredData={filteredData}
            currentLocation={currentLocation}
            currentAddress={currentAddress}
            error={error}
            map={map}
            onMapReady={handleMapReady}
            selectedShelter={selectedShelter} // 선택된 쉼터 전달
          />

          {/* 검색 및 지역 선택 섹션 */}
          <SearchComponent 
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            currentLocation={currentLocation}
            currentAddress={currentAddress}
            onLocationRequest={handleLocationRequest}
          />

          {/* 검색 결과 정보 */}
          <div className="search-result-info">
            📊 전체 {shelterData.length}개 중 {filteredData.length}개 검색됨 (전체 표시)
            {currentLocation && (
              <div className="search-result-subtext">
                📍 현재 위치 기준 거리순 정렬
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 영역: 목록 */}
        <div className="right-section">
          <ShelterList 
            shelters={filteredData}
            maxItems={maxItems}
            currentLocation={currentLocation}
            onShelterClick={handleShelterClick} // 클릭 핸들러 전달
          />
        </div>
      </div>
    </div>
  );
}
