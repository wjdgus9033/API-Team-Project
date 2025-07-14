import React, { useState, useEffect, useRef } from 'react';
import './test.css';

export default function Test() {
  const [shelterData, setShelterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0, message: '데이터 로드 시작...' });
  const maxItems = 50;
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');

  // 무더위쉼터 데이터 가져오기
  const fetchShelterData = async () => {
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      let allData = [];
      let currentPage = 1;
      let hasMoreData = true;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (hasMoreData) {
        try {
          setLoadingProgress({ 
            current: currentPage, 
            total: Math.min(5, Math.ceil(500/100)), 
            message: `페이지 ${currentPage} 데이터 요청 중... (전국 무더위쉼터 검색)` 
          });
          
          console.log(`페이지 ${currentPage} 데이터 요청 중...`);
          const res = await fetch(`/shelter1?serviceKey=${key}&pageNo=${currentPage}&numOfRows=100&returnType=JSON`, {
            timeout: 30000,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          
          const items = data.body || [];
          if (!Array.isArray(items) || items.length === 0) {
            hasMoreData = false;
            break;
          }

          // 지역별 분류 함수
          const getRegionFromAddress = (address) => {
            if (address.startsWith('경기도') || address.startsWith('경기')) return 'gyeonggi';
            if (address.startsWith('서울특별시') || address.startsWith('서울')) return 'seoul';
            if (address.startsWith('인천광역시') || address.startsWith('인천')) return 'incheon';
            if (address.startsWith('부산광역시') || address.startsWith('부산')) return 'busan';
            if (address.startsWith('대구광역시') || address.startsWith('대구')) return 'daegu';
            if (address.startsWith('대전광역시') || address.startsWith('대전')) return 'daejeon';
            if (address.startsWith('광주광역시') || address.startsWith('광주')) return 'gwangju';
            if (address.startsWith('울산광역시') || address.startsWith('울산')) return 'ulsan';
            if (address.startsWith('세종특별자치시') || address.startsWith('세종')) return 'sejong';
            if (address.startsWith('강원도') || address.startsWith('강원특별자치도')) return 'gangwon';
            if (address.startsWith('충청북도') || address.startsWith('충북')) return 'chungbuk';
            if (address.startsWith('충청남도') || address.startsWith('충남')) return 'chungnam';
            if (address.startsWith('전라북도') || address.startsWith('전북') || address.startsWith('전북특별자치도')) return 'jeonbuk';
            if (address.startsWith('전라남도') || address.startsWith('전남')) return 'jeonnam';
            if (address.startsWith('경상북도') || address.startsWith('경북')) return 'gyeongbuk';
            if (address.startsWith('경상남도') || address.startsWith('경남')) return 'gyeongnam';
            if (address.startsWith('제주특별자치도') || address.startsWith('제주')) return 'jeju';
            return 'other';
          };

          const parsed = items.map(item => {
            const roadAddress = item.RN_DTL_ADRES || '';
            const detailAddress = item.DTL_ADRES || '';
            const address = roadAddress || detailAddress;
            const region = getRegionFromAddress(address);
            
            return {
              name: item.RSTR_NM,
              address: address,
              region: region,
              weekday: `${item.WKDAY_OPER_BEGIN_TIME || "-"} ~ ${item.WKDAY_OPER_END_TIME || "-"}`,
              weekend: item.CHCK_MATTER_WKEND_HDAY_OPN_AT === "N" ||
                !item.WKEND_HDAY_OPER_BEGIN_TIME ||
                !item.WKEND_HDAY_OPER_END_TIME
                ? "주말 휴일"
                : `${item.WKEND_HDAY_OPER_BEGIN_TIME} ~ ${item.WKEND_HDAY_OPER_END_TIME}`,
              lat: item.LA ?? 0,
              lon: item.LO ?? 0,
              tel: item.TELNO || item.TEL || '정보 없음',
              roadAddress: item.RN_DTL_ADRES || '정보 없음',
              detailAddress: item.DTL_ADRES || '정보 없음',
              weekendHolidayOpen: item.CHCK_MATTER_WKEND_HDAY_OPN_AT === "Y" ? "운영" : "휴무"
            };
          });

          allData = [...allData, ...parsed];
          console.log(`페이지 ${currentPage} 완료: ${parsed.length}개 항목 추가됨 (누적: ${allData.length}개)`);
          
          setLoadingProgress({ 
            current: currentPage, 
            total: Math.min(5, Math.ceil(500/100)), 
            message: `페이지 ${currentPage} 완료: 전국 ${allData.length}개 무더위쉼터 로드됨` 
          });
          
          // 페이지당 100개씩, 100개 미만이면 마지막 페이지
          if (items.length < 100) {
            hasMoreData = false;
          } else {
            currentPage++;
          }
          
          // 최대 500개까지만 로드 (5페이지)
          if (allData.length >= 500 || currentPage > 5) {
            hasMoreData = false;
          }
          
          // 요청 간 잠시 대기 (서버 부하 감소)
          if (hasMoreData) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          retryCount = 0; // 성공 시 재시도 카운터 리셋
          
        } catch (pageError) {
          console.error(`페이지 ${currentPage} 요청 실패:`, pageError);
          
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`페이지 ${currentPage} 재시도 중... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // 지수 백오프
            continue; // 같은 페이지 재시도
          } else {
            console.error(`페이지 ${currentPage} 최대 재시도 횟수 초과, 다음 페이지로 이동`);
            hasMoreData = false; // 최대 재시도 후에도 실패하면 중단
          }
        }
      }

      console.log(`총 ${allData.length}개의 전국 무더위쉼터 데이터를 로드했습니다.`);
      setShelterData(allData);
      setFilteredData(allData);
    } catch (err) {
      console.error("무더위쉼터 데이터 에러:", err);
      setError(`무더위쉼터 데이터 로드 실패: ${err.message}`);
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setCurrentLocation({ lat, lng });
          console.log('현재 위치 가져오기 성공:', { lat, lng });
          
          // 지도 중심을 현재 위치로 이동
          if (map) {
            const currentPos = new window.kakao.maps.LatLng(lat, lng);
            map.setCenter(currentPos);
            map.setLevel(5); // 줌 레벨을 5로 설정하여 더 자세히 보기
          }
          
          // 좌표를 주소로 변환
          if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            const coord = new window.kakao.maps.LatLng(lat, lng);
            
            geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;
                setCurrentAddress(address);
                console.log('현재 주소:', address);
              }
            });
          }
        },
        (error) => {
          console.error('위치 가져오기 실패:', error);
          setError('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        }
      );
    } else {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  // 카카오지도 초기화
  const initializeMap = () => {
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
        setError(null); // 지도 초기화 성공 시 에러 상태 제거
        console.log('카카오지도 초기화 성공');
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        setError('지도 초기화에 실패했습니다.');
      }
    } else {
      console.error('카카오지도 API가 로드되지 않았습니다.');
      // 지도 API가 로드되지 않은 경우에만 에러 메시지 설정
      if (!window.kakao || !window.kakao.maps) {
        setError('카카오지도 API 로딩 중입니다. 잠시만 기다려주세요.');
      }
    }
  };

  // 지도에 마커 표시
  const displayMarkersOnMap = (shelters) => {
    if (!map || !window.kakao || !window.kakao.maps) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

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

    setMarkers(newMarkers);

    // 마커들이 있으면 지도 범위 조정
    if (newMarkers.length > 0) {
      map.setBounds(bounds);
    }
  };

  // 두 지점 간의 거리 계산 (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 지역 및 검색 필터링
  const filterData = () => {
    let filtered = [...shelterData];

    // 지역 필터링
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }

    // 검색어 필터링
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword) ||
        item.roadAddress.toLowerCase().includes(keyword) ||
        item.detailAddress.toLowerCase().includes(keyword)
      );
    }

    // 현재 위치가 있으면 거리 계산 및 정렬
    if (currentLocation) {
      filtered = filtered.map(shelter => ({
        ...shelter,
        distance: shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0
          ? calculateDistance(currentLocation.lat, currentLocation.lng, shelter.lat, shelter.lon)
          : null
      })).sort((a, b) => {
        // 거리 정보가 있는 쉼터를 우선적으로, 그 다음은 거리 순으로 정렬
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    // 최대 50개로 제한
    const limitedData = filtered.slice(0, maxItems);
    setFilteredData(limitedData);
    
    // 지도에 마커 표시
    displayMarkersOnMap(limitedData);
  };

  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오지도 API가 이미 로드되어 있음');
      setError(null); // 에러 상태 초기화
      initializeMap();
      return;
    }

    // 기존 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      console.log('카카오지도 스크립트가 이미 존재함, 로딩 대기 중...');
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakao);
          setError(null); // 에러 상태 초기화
          initializeMap();
        }
      }, 100);
      
      // 10초 후에도 로드되지 않으면 타임아웃
      setTimeout(() => {
        if (!window.kakao || !window.kakao.maps) {
          clearInterval(checkKakao);
          setError('카카오지도 API 로딩 시간이 초과되었습니다. 새로고침 해주세요.');
        }
      }, 10000);
      
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    // 환경변수에서 카카오지도 API 키 가져오기 (.env 파일의 VITE_KAKAO_MAP_KEY 사용)
    const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_KEY || '2da517b8cc684f51f7446f494f6cbdff';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('카카오지도 스크립트 로딩 성공');
      window.kakao.maps.load(() => {
        console.log('카카오지도 API 로딩 완료');
        setError(null); // 에러 상태 초기화
        initializeMap();
        getCurrentLocation(); // 현재 위치 가져오기
      });
    };

    script.onerror = () => {
      console.error('카카오지도 스크립트 로딩 실패');
      setError('지도 로딩에 실패했습니다. API 키를 확인해주세요.');
    };

    return () => {
      // cleanup 시 스크립트 제거하지 않음 (다른 컴포넌트에서 사용할 수 있음)
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      await fetchShelterData();
      
      setLoading(false);
    };

    loadData();
  }, []);

  // 지역이나 검색어, 현재 위치 변경 시 필터링
  useEffect(() => {
    if (shelterData.length > 0) {
      filterData();
    }
  }, [searchKeyword, selectedRegion, shelterData, currentLocation]);

  // 지도 초기화 완료 후 마커 표시
  useEffect(() => {
    console.log('지도 상태 변경:', { 
      mapExists: !!map, 
      filteredDataLength: filteredData.length 
    });
    
    if (map && filteredData.length > 0) {
      console.log('마커 표시 시작');
      displayMarkersOnMap(filteredData);
    } else if (map && currentLocation) {
      // 필터된 데이터가 없어도 현재 위치 마커는 표시
      displayMarkersOnMap([]);
    }
  }, [map, filteredData, currentLocation]);

  const totalPages = Math.ceil(filteredData.length / maxItems);

  if (loading) {
    const progressPercentage = loadingProgress.total > 0 
      ? Math.round((loadingProgress.current / loadingProgress.total) * 100) 
      : 0;
      
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        
        <p className="loading-text">
          전국 무더위쉼터 데이터를 불러오는 중...
        </p>
        
        {loadingProgress.total > 0 && (
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="progress-message">
              {loadingProgress.message}
            </p>
            <p className="progress-percentage">
              진행률: {progressPercentage}% ({loadingProgress.current}/{loadingProgress.total} 페이지)
            </p>
          </div>
        )}
      </div>
    );
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

          {/* 검색 및 지역 선택 섹션 */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-header">
                <h3 className="search-title">
                  🔍 검색 및 지역 선택
                </h3>
                
                <button
                  onClick={getCurrentLocation}
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
              <div className="region-section">
                <div className="region-row">
                  {[
                    { key: 'all', label: '🏠 전체' },
                    { key: 'seoul', label: '🏛️ 서울' },
                    { key: 'gyeonggi', label: '🌆 경기' },
                    { key: 'incheon', label: '🌊 인천' },
                    { key: 'busan', label: '🌊 부산' },
                    { key: 'daegu', label: '🌸 대구' },
                    { key: 'daejeon', label: '🏢 대전' },
                    { key: 'gwangju', label: '🌿 광주' },
                    { key: 'ulsan', label: '🏭 울산' }
                  ].map(region => (
                    <button
                      key={region.key}
                      onClick={() => setSelectedRegion(region.key)}
                      className={`region-button ${selectedRegion === region.key ? 'selected' : 'unselected'}`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
                <div className="region-row">
                  {[
                    { key: 'sejong', label: '🏛️ 세종' },
                    { key: 'gangwon', label: '⛰️ 강원' },
                    { key: 'chungbuk', label: '🏔️ 충북' },
                    { key: 'chungnam', label: '🌾 충남' },
                    { key: 'jeonbuk', label: '🌾 전북' },
                    { key: 'jeonnam', label: '🌊 전남' },
                    { key: 'gyeongbuk', label: '🏔️ 경북' },
                    { key: 'gyeongnam', label: '🌊 경남' },
                    { key: 'jeju', label: '🏝️ 제주' }
                  ].map(region => (
                    <button
                      key={region.key}
                      onClick={() => setSelectedRegion(region.key)}
                      className={`region-button ${selectedRegion === region.key ? 'selected' : 'unselected'}`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 검색 결과 정보 */}
          <div className="search-result-info">
            📊 전체 {shelterData.length}개 중 {filteredData.length}개 검색됨 (최대 {maxItems}개 표시)
            {currentLocation && (
              <div className="search-result-subtext">
                📍 현재 위치 기준 거리순 정렬
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 영역: 목록 */}
        <div className="right-section">
          {/* 무더위쉼터 목록 */}
          <div className="shelter-list-section">
            <h2 className="shelter-list-title">
              🏠 무더위쉼터 목록 ({filteredData.length}개소)
            </h2>
            
            {/* 목록 컨테이너 */}
            <div className="shelter-list-container">
              {filteredData.length === 0 ? (
                <div className="no-results">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="shelter-list">
                  {filteredData.map((shelter, index) => (
                    <div 
                      key={index} 
                      className="shelter-item"
                    >
                      <h4 className="shelter-name">
                        <span className="shelter-name-text">
                          📍 {shelter.name}
                        </span>
                        {shelter.distance && (
                          <span className="shelter-distance">
                            {shelter.distance.toFixed(1)}km
                          </span>
                        )}
                      </h4>
                      <p className="shelter-info address">
                        <strong>주소:</strong> {shelter.roadAddress}
                      </p>
                      <p className="shelter-info">
                        <strong>운영시간:</strong> {shelter.weekday}
                      </p>
                      <p className="shelter-info last">
                        <strong>전화:</strong> {shelter.tel}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
