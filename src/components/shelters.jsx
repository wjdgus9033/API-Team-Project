import { useEffect, useState, useRef } from "react";
// import loading from "./loading";

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [nearbyShelters, setNearbyShelters] = useState([]);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('위치 정보를 가져오는 중...');
  
  // 카카오맵 관련 상태
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [keyword, setKeyword] = useState('무더위쉼터');
  const [searchCategory, setSearchCategory] = useState('shelter'); // 검색 카테고리
  const [pagination, setPagination] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  // 카테고리별 키워드 정의
  const searchKeywords = {
    shelter: '무더위쉼터',
    senior: '경로당',
    community: '주민센터',
    welfare: '복지관 복지센터',
    library: '도서관',
    mall: '쇼핑몰',
    cafe: '카페',
    all: '무더위쉼터 경로당 주민센터 복지관 복지센터'
  };

  const categoryNames = {
    shelter: '🏠 무더위쉼터',
    senior: '👴 경로당',
    community: '🏢 주민센터', 
    welfare: '🏥 복지관',
    library: '📚 도서관',
    mall: '🛍️ 쇼핑몰',
    cafe: '☕ 카페',
    all: '🔍 모든 시설'
  };
  const defaultLocation = {
    lat: 37.3007,
    lng: 127.0107
  };

  // 두 지점 간의 거리 계산 (Haversine 공식)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // 거리 (km)
    return distance;
  };

  // 가장 가까운 쉼터 5개 필터링
  const filterNearbyShelters = (shelterList, userLocation) => {
    return shelterList.filter(shelter => {
      if (!shelter.lat || !shelter.lon) return false;
      return true; // 모든 쉼터를 대상으로 함
    }).map(shelter => ({
      ...shelter,
      distance: calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        parseFloat(shelter.lat), 
        parseFloat(shelter.lon)
      )
    })).sort((a, b) => a.distance - b.distance) // 거리순 정렬
    .slice(0, 5); // 가장 가까운 5개만 선택
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          
          // 현재 위치의 주소 가져오기
          getAddressFromCoords(location.lat, location.lng);
          
          // 지도 중심을 현재 위치로 이동
          if (map) {
            const center = new window.kakao.maps.LatLng(location.lat, location.lng);
            map.setCenter(center);
          }
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          // 기본 위치(수원시 장안구 영화동) 사용
          setCurrentLocation(defaultLocation);
        }
      );
    } else {
      // 기본 위치 사용
      setCurrentLocation(defaultLocation);
    }
  };

  // 좌표를 주소로 변환하는 함수
  const getAddressFromCoords = (lat, lng) => {
    if (!geocoder) return;
    
    const coord = new window.kakao.maps.LatLng(lat, lng);
    
    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0];
        if (address.road_address) {
          // 도로명 주소가 있으면 도로명 주소 사용
          setCurrentAddress(address.road_address.address_name);
        } else if (address.address) {
          // 지번 주소 사용
          setCurrentAddress(address.address.address_name);
        }
      } else {
        setCurrentAddress('주소를 찾을 수 없습니다');
      }
    });
  };

  // 카카오맵 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(defaultLocation.lat, defaultLocation.lng),
          level: 5 // 1km 반경을 보기 좋게 조정
        };

        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(kakaoMap);

        const info = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        setInfowindow(info);

        const ps = new window.kakao.maps.services.Places();
        setPlacesService(ps);
        
        const geo = new window.kakao.maps.services.Geocoder();
        setGeocoder(geo);
      });
    };

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 현재 위치 및 근처 쉼터를 지도에 표시
  useEffect(() => {
    if (map && currentLocation && nearbyShelters.length > 0) {
      displayLocationAndShelters();
    }
  }, [map, currentLocation, nearbyShelters]);

  // 무더위쉼터 및 현재 위치 처리
  useEffect(() => {
    if (shelters.length > 0 && currentLocation) {
      const nearby = filterNearbyShelters(shelters, currentLocation);
      setNearbyShelters(nearby);
    }
  }, [shelters, currentLocation]);

  const fetchShelters = async () => {
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      const res = await fetch(`/shelter1?serviceKey=${key}&pageNo=1&numOfRows=1000&returnType=JSON`);
      const data = await res.json();

      const items = data.body || [];
      if (!Array.isArray(items)) throw new Error("목록이 없습니다.");

      const parsed = items.map(item => ({
        name: item.RSTR_NM,
        address: item.RN_DTL_ADRES || item.DTL_ADRES,
        weekday: `${item.WKDAY_OPER_BEGIN_TIME || "-"} ~ ${item.WKDAY_OPER_END_TIME || "-"}`,
        weekend:
          item.CHCK_MATTER_WKEND_HDAY_OPN_AT === "N" ||
            !item.WKEND_HDAY_OPER_BEGIN_TIME ||
            !item.WKEND_HDAY_OPER_END_TIME
            ? "주말 휴일"
            : `${item.WKEND_HDAY_OPER_BEGIN_TIME} ~ ${item.WKEND_HDAY_OPER_END_TIME}`,
        lat: item.LA ?? 0,
        lon: item.LO ?? 0,
        tel: item.TELNO || item.TEL || '',
      }));

      setShelters(parsed);
    } catch (err) {
      console.error("에러 발생:", err);
      setError("무더위쉼터 정보를 불러오지 못했습니다.");
    }
  };

  const displayLocationAndShelters = () => {
    removeMarkers();
    
    // 현재 위치 마커 추가
    if (currentLocation) {
      const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      
      // 현재 위치 마커 (빨간색)
      const currentMarker = new window.kakao.maps.Marker({
        position: currentPos,
        image: new window.kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new window.kakao.maps.Size(24, 35)
        )
      });
      currentMarker.setMap(map);
      setMarkers(prev => [...prev, currentMarker]);
      
      // 현재 위치 정보창
      window.kakao.maps.event.addListener(currentMarker, 'click', () => {
        const content = '<div style="padding:5px;z-index:1;color:red;font-weight:bold;">현재 위치</div>';
        infowindow.setContent(content);
        infowindow.open(map, currentMarker);
      });

      // 1km 반경 원 그리기
      const circle = new window.kakao.maps.Circle({
        center: currentPos,
        radius: 1000, // 1km
        strokeWeight: 2,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        fillColor: '#FF0000',
        fillOpacity: 0.1
      });
      circle.setMap(map);
    }
    
    // 근처 쉼터 마커들 추가
    const bounds = new window.kakao.maps.LatLngBounds();
    if (currentLocation) {
      bounds.extend(new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng));
    }
    
    nearbyShelters.forEach((shelter, idx) => {
      if (shelter.lat && shelter.lon) {
        const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lon);
        const marker = addShelterMarker(position, shelter);
        bounds.extend(position);
      }
    });
    
    if (nearbyShelters.length > 0 || currentLocation) {
      map.setBounds(bounds);
    }
  };

  const addShelterMarker = (position, shelter) => {
    // 쉼터 마커 (파란색)
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
        new window.kakao.maps.Size(36, 37),
        {
          spriteSize: new window.kakao.maps.Size(36, 691),
          spriteOrigin: new window.kakao.maps.Point(0, 10),
          offset: new window.kakao.maps.Point(13, 37)
        }
      )
    });
    
    marker.setMap(map);
    setMarkers(prev => [...prev, marker]);
    
    window.kakao.maps.event.addListener(marker, 'click', () => {
      const content = `
        <div style="padding:10px;z-index:1;min-width:200px;">
          <strong>${shelter.name}</strong><br/>
          <small>${shelter.address}</small><br/>
          <span style="color:blue;">거리: ${shelter.distance?.toFixed(2)}km</span>
        </div>
      `;
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });
    
    return marker;
  };

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  // 컴포넌트 초기화
  useEffect(() => {
    fetchShelters();
    getCurrentLocation();
  }, []);

  // 카카오맵 관련 함수들 (기존 검색 기능 유지)
  const searchPlaces = (ps, infowindow, map, keyword) => {
    if (!ps) return;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!');
      return;
    }

    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        setPagination(pagination);
        displayPlaces(data, map, infowindow);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchKeyword = searchKeywords[searchCategory] || keyword;
    searchPlaces(placesService, infowindow, map, searchKeyword);
  };

  // 카테고리 변경 처리
  const handleCategoryChange = (category) => {
    setSearchCategory(category);
    const searchKeyword = searchKeywords[category];
    if (searchKeyword) {
      setKeyword(searchKeyword);
      // 자동으로 검색 실행
      if (placesService && map && infowindow) {
        searchPlaces(placesService, infowindow, map, searchKeyword);
      }
      
      // 오른쪽 목록도 해당 카테고리로 업데이트
      if (currentLocation) {
        updateNearbyPlacesByCategory(category, searchKeyword);
      }
    }
  };

  // 카테고리별 근처 장소 업데이트
  const updateNearbyPlacesByCategory = (category, searchKeyword) => {
    if (!placesService || !currentLocation) return;
    
    if (category === 'shelter') {
      // 무더위쉼터는 기존 API 데이터 사용
      if (shelters.length > 0) {
        const nearby = filterNearbyShelters(shelters, currentLocation);
        setNearbyShelters(nearby);
      }
    } else {
      // 다른 카테고리는 카카오맵 검색 결과 사용
      placesService.keywordSearch(searchKeyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          const placesWithDistance = data.map(place => ({
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            weekday: "운영시간 확인 필요",
            weekend: "운영시간 확인 필요", 
            lat: parseFloat(place.y),
            lon: parseFloat(place.x),
            distance: calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              parseFloat(place.y),
              parseFloat(place.x)
            )
          }));
          
          // 거리순 정렬 후 5개만 선택
          const nearbyPlaces = placesWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
          
          setNearbyShelters(nearbyPlaces);
        } else {
          setNearbyShelters([]);
        }
      });
    }
  };

  const displayPlaces = (places, map, infowindow) => {
    removeMarkers();
    const bounds = new window.kakao.maps.LatLngBounds();
    
    places.forEach((place, idx) => {
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, idx, place.place_name);
      bounds.extend(placePosition);
    });
    
    map.setBounds(bounds);
  };

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
    
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      displayInfowindow(marker, title);
    });
    
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindow.close();
    });
    
    return marker;
  };

  const displayInfowindow = (marker, title) => {
    const content = `<div style="padding:5px;z-index:1;">${title}</div>`;
    infowindow.setContent(content);
    infowindow.open(map, marker);
  };

  const handlePagination = (page) => {
    if (pagination) {
      pagination.gotoPage(page);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* 지도 영역 */}
      <div style={{ flex: 1 }}>
        <div 
          ref={mapContainer} 
          style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
        ></div>
        
        {/* 현재 위치 정보 및 컨트롤 */}
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>📍 현재 위치:</strong> 
            {currentAddress}
            <button 
              onClick={getCurrentLocation}
              style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
            >
              📍 현재 위치 새로고침
            </button>
          </div>
          <div>
            <strong>🏠 가장 가까운 {categoryNames[searchCategory]?.replace(/🏠|👴|🏢|🏥|📚|🛍️|☕|🔍/, '').trim() || '시설'}:</strong> {nearbyShelters.length}개 발견
          </div>
        </div>

        {/* 검색 폼 (기존 기능 유지) */}
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>🔍 더위 피할 곳 찾기</h4>
            
            {/* 카테고리 버튼들 */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(categoryNames).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderRadius: '20px',
                      border: '1px solid #ddd',
                      backgroundColor: searchCategory === key ? '#007bff' : '#fff',
                      color: searchCategory === key ? 'white' : '#333',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <label>
              키워드 검색: 
              <input 
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ marginLeft: '10px', marginRight: '10px', padding: '5px' }}
              />
            </label>
            <button type="submit">검색하기</button>
          </form>
          
          {/* 검색 결과 목록 */}
          {places.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h4>검색 결과</h4>
              <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {places.map((place, i) => (
                  <li key={i} style={{ marginBottom: '5px', fontSize: '14px' }}>
                    <strong>{place.place_name}</strong><br />
                    {place.road_address_name || place.address_name}
                  </li>
                ))}
              </ul>
              
              {/* 페이지네이션 */}
              {pagination && (
                <div style={{ marginTop: '10px' }}>
                  {[...Array(pagination.last)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePagination(i + 1)}
                      style={{
                        marginRight: '5px',
                        backgroundColor: pagination.current === (i + 1) ? '#007bff' : '#f8f9fa',
                        color: pagination.current === (i + 1) ? 'white' : 'black',
                        border: '1px solid #ccc',
                        padding: '5px 10px'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 가장 가까운 쉼터 목록 영역 */}
      <div style={{ flex: 1, maxHeight: '600px', overflowY: 'auto' }}>
        <h2>🏠 가장 가까운 {categoryNames[searchCategory] || '쉼터'} 목록 ({nearbyShelters.length}개)</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          * 현재 위치에서 가장 가까운 {categoryNames[searchCategory] || '무더위쉼터'} 5개를 거리순으로 표시합니다
        </p>
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {nearbyShelters.length === 0 && !error && (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            근처에 이용 가능한 {categoryNames[searchCategory]?.replace(/🏠|👴|🏢|🏥|📚|🛍️|☕|🔍/, '').trim() || '시설'}이 없습니다.
          </p>
        )}
        
        {nearbyShelters.map((s, idx) => (
          <div 
            key={idx} 
            style={{ 
              marginBottom: "1rem", 
              padding: "15px", 
              border: "2px solid #e3f2fd",
              borderRadius: "8px",
              backgroundColor: "#f8f9ff"
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <strong style={{ color: '#1976d2', fontSize: '16px' }}>{s.name}</strong>
              <span style={{ 
                backgroundColor: '#4caf50', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {s.distance?.toFixed(2)}km
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: '1.4' }}>
              📍 {s.address}<br />
              🕒 평일: {s.weekday}<br />
              🕒 주말: {s.weekend}<br />
              📞 전화번호: {s.tel || '정보 없음'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}