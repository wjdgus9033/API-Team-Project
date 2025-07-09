import React, { useEffect, useRef, useState } from 'react';
import './css/map.css';

const Kakaomap = () => {
  // 상태 관리
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [keyword, setKeyword] = useState('이태원 맛집');
  const [pagination, setPagination] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  
  // 컴포넌트가 마운트될 때 지도 초기화
  useEffect(() => {
    // Kakao maps API가 로드되었는지 확인
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        // 지도를 생성할 때 필요한 기본 옵션
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청
          level: 3 // 지도의 확대 레벨
        };

        // 지도 생성 및 객체 리턴
        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(kakaoMap);

        // 인포윈도우 생성
        const info = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        setInfowindow(info);

        // 장소 검색 객체 생성
        const ps = new window.kakao.maps.services.Places();
        setPlacesService(ps);

        // 초기 검색 수행
        searchPlaces(ps, info, kakaoMap, keyword);
      });
    };

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 키워드 검색 함수
  const searchPlaces = (ps, infowindow, map, keyword) => {
    if (!ps) return;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!');
      return;
    }

    // 장소 검색 요청
    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색 결과와 페이지네이션 정보 저장
        setPlaces(data);
        setPagination(pagination);
        
        // 검색 결과 표시
        displayPlaces(data, map, infowindow);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  };

  // 검색 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    searchPlaces(placesService, infowindow, map, keyword);
  };

  // 마커와 검색 결과 표시 함수
  const displayPlaces = (places, map, infowindow) => {
    // 기존 마커 제거
    removeMarkers();
    
    const bounds = new window.kakao.maps.LatLngBounds();
    
    // 검색 결과마다 마커와 목록 항목 생성
    places.forEach((place, idx) => {
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, idx, place.place_name);
      
      // 검색 영역 확장
      bounds.extend(placePosition);
    });
    
    // 검색 영역으로 지도 범위 조정
    map.setBounds(bounds);
  };

  // 마커 생성 함수
  const addMarker = (position, idx, title) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10),
      offset: new window.kakao.maps.Point(13, 37)
    };
    
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage
    });
    
    marker.setMap(map);
    setMarkers(prev => [...prev, marker]);
    
    // 마커에 이벤트 등록
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      displayInfowindow(marker, title);
    });
    
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindow.close();
    });
    
    return marker;
  };

  // 모든 마커 제거 함수
  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  // 인포윈도우 표시 함수
  const displayInfowindow = (marker, title) => {
    const content = `<div style="padding:5px;z-index:1;">${title}</div>`;
    infowindow.setContent(content);
    infowindow.open(map, marker);
  };

  // 페이지네이션 핸들러
  const handlePagination = (page) => {
    if (pagination) {
      pagination.gotoPage(page);
    }
  };

  // 목록 항목 마우스오버 핸들러
  const handleItemMouseOver = (marker, title) => {
    return () => {
      displayInfowindow(marker, title);
    };
  };

  // 목록 항목 마우스아웃 핸들러
  const handleItemMouseOut = () => {
    return () => {
      infowindow && infowindow.close();
    };
  };

  return (
    <div className="map_wrap">
      <div 
        id="map" 
        ref={mapContainer} 
        style={{ width: '50%', height: '500px' }}
      ></div>
      
      <div id="menu_wrap" className="bg_white">
        <div className="option">
          <div>
            <form onSubmit={handleSubmit}>
              키워드 : <input 
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                size="15"
              />
              <button type="submit">검색하기</button>
            </form>
          </div>
        </div>
        <hr />
        <ul id="placesList">
          {places.map((place, i) => (
            <li 
              key={i} 
              className="item"
              onMouseOver={markers[i] ? handleItemMouseOver(markers[i], place.place_name) : null}
              onMouseOut={handleItemMouseOut()}
            >
              <span className={`markerbg marker_${i+1}`}></span>
              <div className="info">
                <h5>{place.place_name}</h5>
                {place.road_address_name ? (
                  <>
                    <span>{place.road_address_name}</span>
                    <span className="jibun gray">{place.address_name}</span>
                  </>
                ) : (
                  <span>{place.address_name}</span>
                )}
                <span className="tel">{place.phone}</span>
              </div>
            </li>
          ))}
        </ul>
        <div id="pagination">
          {pagination && [...Array(pagination.last)].map((_, i) => (
            <a
              key={i}
              href="#"
              onClick={(e) => { 
                e.preventDefault();
                handlePagination(i + 1);
              }}
              className={pagination.current === (i + 1) ? 'on' : ''}
            >
              {i + 1}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kakaomap;