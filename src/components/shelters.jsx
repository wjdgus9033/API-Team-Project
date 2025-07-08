import { useEffect, useState, useRef } from "react";

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState(null);
  
  // 카카오맵 관련 상태
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [keyword, setKeyword] = useState('무더위쉼터');
  const [pagination, setPagination] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  // 카카오맵 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3
        };

        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(kakaoMap);

        const info = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        setInfowindow(info);

        const ps = new window.kakao.maps.services.Places();
        setPlacesService(ps);
      });
    };

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 무더위쉼터 데이터를 지도에 표시
  useEffect(() => {
    if (map && shelters.length > 0) {
      displaySheltersOnMap();
    }
  }, [map, shelters]);

  const fetchShelters = async () => {
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      const res = await fetch(`/shelter?serviceKey=${key}&pageNo=1&numOfRows=100&returnType=JSON`);
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
      }));

      setShelters(parsed);
    } catch (err) {
      console.error("에러 발생:", err);
      setError("무더위쉼터 정보를 불러오지 못했습니다.");
    }
  };

  // 카카오맵 관련 함수들
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
    searchPlaces(placesService, infowindow, map, keyword);
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

  const displaySheltersOnMap = () => {
    removeMarkers();
    const bounds = new window.kakao.maps.LatLngBounds();
    
    shelters.forEach((shelter, idx) => {
      if (shelter.lat && shelter.lon) {
        const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lon);
        const marker = addShelterMarker(position, shelter.name);
        bounds.extend(position);
      }
    });
    
    if (shelters.length > 0) {
      map.setBounds(bounds);
    }
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

  const addShelterMarker = (position, title) => {
    const marker = new window.kakao.maps.Marker({
      position: position
    });
    
    marker.setMap(map);
    setMarkers(prev => [...prev, marker]);
    
    window.kakao.maps.event.addListener(marker, 'click', () => {
      displayInfowindow(marker, title);
    });
    
    return marker;
  };

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
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

  useEffect(() => {
    fetchShelters();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* 지도 영역 */}
      <div style={{ flex: 1 }}>
        <div 
          ref={mapContainer} 
          style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
        ></div>
        
        {/* 검색 폼 */}
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
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

      {/* 무더위쉼터 목록 영역 */}
      <div style={{ flex: 1, maxHeight: '600px', overflowY: 'auto' }}>
        <h2>무더위쉼터 목록</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {shelters.map((s, idx) => (
          <div key={idx} style={{ marginBottom: "1rem", padding: "10px", border: "1px solid #eee" }}>
            <strong>{s.name}</strong><br />
            {s.address}<br />
            평일 운영: {s.weekday}<br />
            주말 운영: {s.weekend}<br />
            좌표: {s.lat}, {s.lon}
          </div>
        ))}
      </div>
    </div>
  );
}
