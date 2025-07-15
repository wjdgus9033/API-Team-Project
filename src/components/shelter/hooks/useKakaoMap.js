import { useState, useCallback, useRef } from 'react';

export default function useKakaoMap() {
  const [map, setMap] = useState(null);
  const markersRef = useRef([]); // markers를 ref로 변경하여 리렌더링 방지

  // 카카오지도 초기화
  const initializeMap = useCallback((mapRef) => {
    console.log('지도 초기화 시도...', { 
      kakaoExists: !!window.kakao, 
      mapsExists: !!window.kakao?.maps, 
      containerExists: !!mapRef.current 
    });
    
    if (window.kakao && window.kakao.maps && mapRef.current) {
      try {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표
          level: 8
        };
        const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
        setMap(kakaoMap);
        console.log('카카오지도 초기화 성공');
        return kakaoMap;
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        throw new Error('지도 초기화에 실패했습니다.');
      }
    } else {
      console.error('카카오지도 API가 로드되지 않았습니다.');
      throw new Error('카카오지도 API 로딩 중입니다. 잠시만 기다려주세요.');
    }
  }, []);

  // 지도에 마커 표시
  const displayMarkersOnMap = useCallback((shelters, currentLocation, currentAddress) => {
    if (!map || !window.kakao || !window.kakao.maps) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = [];
    const bounds = new window.kakao.maps.LatLngBounds();

    // 현재 위치 마커 추가
    if (currentLocation) {
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
    }

    // 쉼터 마커들 추가
    shelters.forEach((shelter, index) => {
      if (shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0) {
        const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lon);
        
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map
        });

        // 인포윈도우 내용
        const infoContent = `
          <div style="padding:10px; min-width:200px; max-width:300px;">
            <h4 style="margin:0 0 5px 0; color:#FF6B57; font-size:14px; display:flex; justify-content:space-between; align-items:center;">
              <span>${shelter.name}</span>
              ${shelter.distance ? `<span style="font-size:11px; color:#0066CC; font-weight:normal; background-color:#E8F4FF; padding:2px 6px; border-radius:8px;">${shelter.distance.toFixed(1)}km</span>` : ''}
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
      }
    });

    markersRef.current = newMarkers;

    // 마커들이 있으면 지도 범위 조정
    if (newMarkers.length > 0) {
      map.setBounds(bounds);
    }
  }, [map]); // markers 의존성 제거

  // 지도 중심을 현재 위치로 이동
  const moveToCurrentLocation = useCallback((currentLocation) => {
    if (map && currentLocation) {
      const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      map.setCenter(currentPos);
      map.setLevel(5); // 줌 레벨을 5로 설정하여 더 자세히 보기
    }
  }, [map]);

  return {
    map,
    markers: markersRef.current, // ref 값 반환
    initializeMap,
    displayMarkersOnMap,
    moveToCurrentLocation,
    setMap
  };
}
