import { useState, useCallback, useRef } from 'react';

export default function useKakaoMap() {
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);
  const initTimeoutRef = useRef(null);

  // 카카오지도 초기화
  const initializeMap = useCallback((mapRef) => {
    // 상태 체크용 (디버깅용 객체, 필요시 주석 해제)
    // const debugStatus = {
    //   kakaoExists: !!window.kakao,
    //   mapsExists: !!(window.kakao && window.kakao.maps),
    //   containerExists: !!mapRef.current
    // };
    
    // 이전 타임아웃 클리어
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // 5초 후 타임아웃 처리
    initTimeoutRef.current = setTimeout(() => {
      // ...existing code...
      throw new Error('지도 초기화에 시간이 너무 오래 걸립니다.');
    }, 5000);
    
    if (window.kakao && window.kakao.maps && mapRef.current) {
      try {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 8
        };
        const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
        
        // 타임아웃 클리어
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
        }
        
        setMap(kakaoMap);
        // ...existing code...
        return kakaoMap;
      } catch (error) {
        // 타임아웃 클리어
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
        }
        
        // ...existing code...
        throw new Error('지도 초기화에 실패했습니다.');
      }
    } else {
      // 타임아웃 클리어
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      // ...existing code...
      throw new Error('카카오지도 API 로딩 중입니다. 잠시만 기다려주세요.');
    }
  }, []);

  // 지도에 마커 표시
  const displayMarkersOnMap = useCallback((shelters, currentLocation, currentAddress) => {
    if (!map || !window.kakao || !window.kakao.maps) {
      // ...existing code...
      return;
    }

    try {
      // 기존 마커 제거
      markersRef.current.forEach(marker => {
        if (marker && typeof marker.setMap === 'function') {
          marker.setMap(null);
        }
      });
      markersRef.current = [];

      const newMarkers = [];
      const bounds = new window.kakao.maps.LatLngBounds();

      // 현재 위치 마커 추가
      if (currentLocation) {
        try {
          const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
          
          const currentMarker = new window.kakao.maps.Marker({
            position: currentPos,
            image: new window.kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
              new window.kakao.maps.Size(24, 35)
            )
          });
          
          currentMarker.setMap(map);
          newMarkers.push(currentMarker);
          bounds.extend(currentPos);

          // 현재 위치 마커 클릭 이벤트
          const currentInfoContent = `
            <div style="padding:8px; min-width:200px; color:red; font-weight:bold;">
              <div style="margin-bottom:3px;">📍 현재 위치</div>
              ${currentAddress ? `<div style="font-size:11px; font-weight:normal; color:#666;">${currentAddress}</div>` : ''}
            </div>
          `;

          const currentInfoWindow = new window.kakao.maps.InfoWindow({
            content: currentInfoContent
          });

          window.kakao.maps.event.addListener(currentMarker, 'click', () => {
            currentInfoWindow.open(map, currentMarker);
          });
        } catch (error) {
          // ...existing code...
        }
      }

      // 쉼터 마커들 추가
      if (shelters && Array.isArray(shelters)) {
        shelters.forEach((shelter) => {
          if (shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0) {
            try {
              const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lon);
              
              const marker = new window.kakao.maps.Marker({
                position: position,
                map: map
              });

              // 인포윈도우 내용
              const infoContent = `
                <div style="padding:10px; min-width:200px; max-width:300px;">
                  <h4 style="margin:0 0 5px 0; color:#FF6B57; font-size:14px;">
                    ${shelter.name}
                    ${shelter.distance ? `<span style="font-size:11px; color:#0066CC; margin-left:8px;">${shelter.distance.toFixed(1)}km</span>` : ''}
                  </h4>
                  <p style="margin:0 0 3px 0; font-size:12px;"><strong>주소:</strong> ${shelter.roadAddress}</p>
                  <p style="margin:0 0 3px 0; font-size:12px;"><strong>운영시간:</strong> ${shelter.weekday}</p>
                  <p style="margin:0; font-size:12px;"><strong>전화:</strong> ${shelter.tel}</p>
                </div>
              `;

              const infoWindow = new window.kakao.maps.InfoWindow({
                content: infoContent
              });

              // 마커 클릭 이벤트
              window.kakao.maps.event.addListener(marker, 'click', () => {
                infoWindow.open(map, marker);
              });

              newMarkers.push(marker);
              bounds.extend(position);
            } catch (error) {
              // ...existing code...
            }
          }
        });
      }

      markersRef.current = newMarkers;

      // 마커들이 있으면 지도 범위 조정
      if (newMarkers.length > 0) {
        try {
          map.setBounds(bounds);
        } catch (error) {
          // ...existing code...
        }
      }
      
      // ...existing code...
    } catch (error) {
      // ...existing code...
    }
  }, [map]);

  // 지도 중심을 현재 위치로 이동
  const moveToCurrentLocation = useCallback((currentLocation) => {
    if (map && currentLocation) {
      try {
        const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        map.setCenter(currentPos);
        map.setLevel(5);
      } catch (error) {
        // ...existing code...
      }
    }
  }, [map]);

  return {
    map,
    markers: markersRef.current,
    initializeMap,
    displayMarkersOnMap,
    moveToCurrentLocation,
    setMap
  };
}