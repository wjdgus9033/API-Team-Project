import React, { useRef, useEffect, useState } from 'react';

export default function MapComponent({ 
  filteredData, 
  currentLocation, 
  currentAddress, 
  error, 
  map,
  onMapReady,
  selectedShelter // 선택된 쉼터 추가
}) {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const markersRef = useRef([]); // 마커들을 관리하기 위한 ref

  // 카카오지도 스크립트 로드 및 초기화
  useEffect(() => {
    // 이미 지도가 초기화되어 있으면 리턴
    if (map) return;

    const initMap = () => {
      if (window.kakao && window.kakao.maps && mapRef.current) {
        try {
          console.log('지도 초기화 시작...');
          setIsLoading(false); // 로딩 완료
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780),
            level: 8
          };
          const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
          
          // useKakaoMap 훅의 setMap 함수 대신 직접 설정
          if (onMapReady) onMapReady(kakaoMap);
          console.log('지도 초기화 완료');
        } catch (error) {
          console.error('지도 초기화 실패:', error);
          setIsLoading(false); // 에러 시에도 로딩 완료
        }
      }
    };

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오지도 API가 이미 로드되어 있음');
      initMap();
      return;
    }

    // 기존 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      console.log('카카오지도 스크립트가 이미 존재함, 로딩 대기 중...');
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakao);
          initMap();
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

    // 새 스크립트 태그 생성
    const script = document.createElement('script');
    script.async = true;
    // 환경변수에서 카카오지도 API 키 가져오기
    const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_KEY || '2da517b8cc684f51f7446f494f6cbdff';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
    
    script.onload = () => {
      console.log('카카오지도 스크립트 로딩 성공');
      window.kakao.maps.load(() => {
        console.log('카카오지도 API 로딩 완료');
        initMap();
      });
    };

    script.onerror = () => {
      console.error('카카오지도 스크립트 로딩 실패');
    };

    document.head.appendChild(script);
  }, [map, onMapReady]);

  // 현재 위치 변경 시 지도 중심 이동
  useEffect(() => {
    if (currentLocation && map) {
      const moveMap = () => {
        const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        map.setCenter(currentPos);
        map.setLevel(5);
        // 지도 크기 재조정
        setTimeout(() => {
          map.relayout();
        }, 100);
      };
      moveMap();
    }
  }, [currentLocation, map]);

  // 지도 크기 변경 감지 및 relayout 호출
  useEffect(() => {
    if (map) {
      const handleResize = () => {
        map.relayout();
      };
      
      window.addEventListener('resize', handleResize);
      
      // 컴포넌트 마운트 후 지도 크기 재조정
      setTimeout(() => {
        map.relayout();
      }, 100);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [map]);

  // 선택된 쉼터로 지도 이동
  useEffect(() => {
    if (selectedShelter && map && selectedShelter.lat && selectedShelter.lon && selectedShelter.lat !== 0 && selectedShelter.lon !== 0) {
      console.log('선택된 쉼터로 지도 이동:', selectedShelter.name);
      const selectedPos = new window.kakao.maps.LatLng(selectedShelter.lat, selectedShelter.lon);
      map.setCenter(selectedPos);
      map.setLevel(3); // 더 자세한 레벨로 줌인
      
      // 해당 마커에 대한 인포윈도우를 자동으로 열기
      setTimeout(() => {
        // 모든 마커 중에서 선택된 쉼터의 마커 찾기
        const targetMarker = markersRef.current.find(marker => {
          const markerPos = marker.getPosition();
          return Math.abs(markerPos.getLat() - selectedShelter.lat) < 0.0001 && 
                 Math.abs(markerPos.getLng() - selectedShelter.lon) < 0.0001;
        });
        
        if (targetMarker) {
          // 마커의 인포윈도우 열기 (mouseover 이벤트 트리거)
          window.kakao.maps.event.trigger(targetMarker, 'mouseover');
        }
      }, 100);
    }
  }, [selectedShelter, map]);

  // 필터된 데이터 변경 시 마커 업데이트
  useEffect(() => {
    if (map && window.kakao && window.kakao.maps) {
      console.log('마커 업데이트 시작:', filteredData?.length || 0);
      
      // 기존 마커들 제거
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // 현재 위치 마커 추가
      if (currentLocation) {
        const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        
        const currentMarker = new window.kakao.maps.Marker({
          position: currentPos,
          image: new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            new window.kakao.maps.Size(24, 35)
          ),
          map: map
        });

        markersRef.current.push(currentMarker);

        // 현재 위치 마커 클릭 이벤트
        const currentInfoContent = `
          <div style="padding:8px; width:180px; max-width:180px; color:red; font-weight:bold; box-sizing:border-box; overflow:hidden;">
            <div style="margin-bottom:3px; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">📍 현재 위치</div>
            ${currentAddress ? `<div style="font-size:11px; font-weight:normal; color:#666; word-wrap:break-word; line-height:1.3;">${currentAddress}</div>` : ''}
          </div>
        `;

        const currentInfoWindow = new window.kakao.maps.InfoWindow({
          content: currentInfoContent,
          removable: false
        });

        // 마우스 호버 이벤트로 변경
        window.kakao.maps.event.addListener(currentMarker, 'mouseover', () => {
          currentInfoWindow.open(map, currentMarker);
        });

        window.kakao.maps.event.addListener(currentMarker, 'mouseout', () => {
          currentInfoWindow.close();
        });

        console.log('현재 위치 마커 추가 완료:', currentLocation);
      }
      
      // 쉼터 마커 추가
      if (filteredData && filteredData.length > 0) {
        filteredData.forEach((shelter, index) => {
          if (shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0) {
            const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lon);
            
            const marker = new window.kakao.maps.Marker({
              position: position,
              map: map
            });

            markersRef.current.push(marker);

            // 인포윈도우 내용
            const infoContent = `
              <div style="padding:8px; width:250px; max-width:250px; box-sizing:border-box; overflow:hidden;">
                <h4 style="margin:0 0 5px 0; color:#FF6B57; font-size:13px; display:flex; justify-content:space-between; align-items:flex-start; line-height:1.2;">
                  <span style="flex:1; margin-right:5px; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; max-width:180px;" title="${shelter.name}">${shelter.name}</span>
                  ${shelter.distance ? `<span style="font-size:10px; color:#0066CC; font-weight:normal; background-color:#E8F4FF; padding:2px 4px; border-radius:6px; white-space:nowrap; flex-shrink:0;">${shelter.distance.toFixed(1)}km</span>` : ''}
                </h4>
                <p style="margin:0 0 3px 0; font-size:11px; word-wrap:break-word; line-height:1.3;"><strong>주소:</strong> ${shelter.roadAddress}</p>
                <p style="margin:0 0 3px 0; font-size:11px; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;"><strong>운영시간:</strong> ${shelter.weekday}</p>
                <p style="margin:0; font-size:11px; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;"><strong>전화:</strong> ${shelter.tel}</p>
              </div>
            `;

            const infoWindow = new window.kakao.maps.InfoWindow({
              content: infoContent,
              removable: false
            });

            // 마우스 호버 이벤트로 변경
            window.kakao.maps.event.addListener(marker, 'mouseover', () => {
              infoWindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(marker, 'mouseout', () => {
              infoWindow.close();
            });
          }
        });
      }

      console.log('마커 업데이트 완료 - 현재위치:', !!currentLocation, '쉼터:', filteredData?.length || 0, '총 마커:', markersRef.current.length);
    }
  }, [map, filteredData, currentLocation, currentAddress]);

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
          {(isLoading || !map) && !error && (
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
