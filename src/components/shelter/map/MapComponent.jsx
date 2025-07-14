import React, { useRef, useEffect } from 'react';
import { useKakaoMap } from '../hooks';

export default function MapComponent({ 
  filteredData, 
  currentLocation, 
  currentAddress, 
  error, 
  onMapReady 
}) {
  const mapRef = useRef(null);
  const { map, initializeMap, displayMarkersOnMap, moveToCurrentLocation } = useKakaoMap();

  // 카카오지도 스크립트 로드 및 초기화
  useEffect(() => {
    // 이미 지도가 초기화되어 있으면 리턴
    if (map) return;

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오지도 API가 이미 로드되어 있음');
      try {
        const mapInstance = initializeMap(mapRef);
        if (onMapReady) onMapReady(mapInstance);
      } catch (error) {
        console.error('지도 초기화 실패:', error);
      }
      return;
    }

    // 기존 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      console.log('카카오지도 스크립트가 이미 존재함, 로딩 대기 중...');
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakao);
          try {
            const mapInstance = initializeMap(mapRef);
            if (onMapReady) onMapReady(mapInstance);
          } catch (error) {
            console.error('지도 초기화 실패:', error);
          }
        }
      }, 100);
      
      // 10초 후에도 로드되지 않으면 타임아웃
      setTimeout(() => {
        if (!window.kakao || !window.kakao.maps) {
          clearInterval(checkKakao);
          console.error('카카오지도 API 로딩 시간 초과');
        }
      }, 10000);
      
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    // 환경변수에서 카카오지도 API 키 가져오기
    const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_KEY || '2da517b8cc684f51f7446f494f6cbdff';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('카카오지도 스크립트 로딩 성공');
      window.kakao.maps.load(() => {
        console.log('카카오지도 API 로딩 완료');
        try {
          const mapInstance = initializeMap(mapRef);
          if (onMapReady) onMapReady(mapInstance);
        } catch (error) {
          console.error('지도 초기화 실패:', error);
        }
      });
    };

    script.onerror = () => {
      console.error('카카오지도 스크립트 로딩 실패');
    };
  }, [map]); // map 상태만 의존성으로 사용

  // 현재 위치 변경 시 지도 중심 이동
  useEffect(() => {
    if (currentLocation && map) {
      moveToCurrentLocation(currentLocation);
    }
  }, [currentLocation, map]); // map과 currentLocation만 의존성으로 사용

  // 필터된 데이터 변경 시 마커 업데이트
  useEffect(() => {
    if (map && filteredData) {
      displayMarkersOnMap(filteredData, currentLocation, currentAddress);
    }
  }, [map, filteredData, currentLocation, currentAddress]); // 함수 제외하고 데이터만 의존성으로 사용

  return (
    <div className="map-section">
      <h2 className="map-title">
        🗺️ 무더위쉼터 위치
      </h2>
      
      <div className="map-container">
        <div 
          ref={mapRef}
          id="kakao-map" 
          className="map-area"
        >
          {!map && !error && (
            <div className="map-loading">
              <div className="map-loading-spinner"></div>
              <p className="map-loading-text">🗺️ 지도 로딩 중...</p>
              <p className="map-loading-subtext">
                카카오지도 API를 불러오고 있습니다
              </p>
            </div>
          )}
          {!map && error && (
            <div className="map-error">
              <p className="map-error-text">⚠️ 지도 로딩 실패</p>
              <p className="map-error-subtext">
                API 키를 확인하거나 새로고침 해주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
