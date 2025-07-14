import React, { useState, useEffect, useRef } from 'react';

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
        console.log('카카오지도 초기화 성공');
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        setError('지도 초기화에 실패했습니다.');
      }
    } else {
      console.error('카카오지도 API가 로드되지 않았습니다.');
      setError('카카오지도 API 로딩 중 오류가 발생했습니다.');
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
            <h4 style="margin:0 0 5px 0; color:#FF6B57; font-size:14px;">${shelter.name}</h4>
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
          initializeMap();
        }
      }, 100);
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
        initializeMap();
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

  // 지역이나 검색어 변경 시 필터링
  useEffect(() => {
    if (shelterData.length > 0) {
      filterData();
    }
  }, [searchKeyword, selectedRegion, shelterData]);

  // 지도 초기화 완료 후 마커 표시
  useEffect(() => {
    console.log('지도 상태 변경:', { 
      mapExists: !!map, 
      filteredDataLength: filteredData.length 
    });
    
    if (map && filteredData.length > 0) {
      console.log('마커 표시 시작');
      displayMarkersOnMap(filteredData);
    }
  }, [map, filteredData]);

  const totalPages = Math.ceil(filteredData.length / maxItems);

  if (loading) {
    const progressPercentage = loadingProgress.total > 0 
      ? Math.round((loadingProgress.current / loadingProgress.total) * 100) 
      : 0;
      
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #FF6B57',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        
        <p style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>
          전국 무더위쉼터 데이터를 불러오는 중...
        </p>
        
        {loadingProgress.total > 0 && (
          <div style={{ marginTop: '20px', maxWidth: '400px', margin: '20px auto' }}>
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #ddd'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                backgroundColor: '#FF6B57',
                transition: 'width 0.3s ease',
                borderRadius: '9px'
              }}></div>
            </div>
            <p style={{ 
              marginTop: '10px', 
              fontSize: '14px', 
              color: '#555',
              fontWeight: 'bold'
            }}>
              {loadingProgress.message}
            </p>
            <p style={{ 
              marginTop: '5px', 
              fontSize: '12px', 
              color: '#888'
            }}>
              진행률: {progressPercentage}% ({loadingProgress.current}/{loadingProgress.total} 페이지)
            </p>
          </div>
        )}
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto', height: 'calc(100vh - 40px)' }}>
      {/* 왼쪽 영역: 지도와 검색 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#FF6B57', 
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          🏠 전국 무더위쉼터 정보
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* 카카오지도 섹션 */}
        <div style={{ marginBottom: '20px', flex: 1 }}>
          <h2 style={{ 
            color: '#FF6B57', 
            marginBottom: '15px', 
            fontSize: '18px',
            borderLeft: '4px solid #FF6B57',
            paddingLeft: '10px'
          }}>
            🗺️ 무더위쉼터 위치
          </h2>
          
          <div style={{ 
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            height: '100%'
          }}>
            <div 
              ref={mapRef}
              id="kakao-map" 
              style={{ 
                width: '100%', 
                height: '100%',
                minHeight: '400px',
                position: 'relative'
              }}
            >
              {!map && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#666',
                  zIndex: 1000
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🗺️ 지도를 로딩하는 중...</p>
                  <p style={{ margin: '0', fontSize: '12px' }}>
                    카카오지도 API를 불러오고 있습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 검색 결과 정보 */}
        <div style={{
          padding: '10px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          📊 전체 {shelterData.length}개 중 {filteredData.length}개 검색됨 (최대 {maxItems}개 표시)
        </div>
      </div>

      {/* 오른쪽 영역: 검색 및 목록 */}
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
        {/* 검색 및 지역 선택 섹션 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              color: '#FF6B57',
              marginBottom: '15px',
              fontSize: '16px'
            }}>
              🔍 검색 및 지역 선택
            </h3>
            
            {/* 검색어 입력 */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="시설명, 주소로 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            {/* 지역 선택 버튼 */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {[
                  { key: 'all', label: '🏠 전체' },
                  { key: 'seoul', label: '🏛️ 서울' },
                  { key: 'gyeonggi', label: '🌆 경기' },
                  { key: 'incheon', label: '🌊 인천' },
                  { key: 'busan', label: '🌊 부산' }
                ].map(region => (
                  <button
                    key={region.key}
                    onClick={() => setSelectedRegion(region.key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      border: '1px solid #ddd',
                      backgroundColor: selectedRegion === region.key ? '#FF6B57' : '#fff',
                      color: selectedRegion === region.key ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {[
                  { key: 'daegu', label: '🌸 대구' },
                  { key: 'daejeon', label: '🏢 대전' },
                  { key: 'gwangju', label: '🌿 광주' },
                  { key: 'ulsan', label: '🏭 울산' },
                  { key: 'sejong', label: '🏛️ 세종' }
                ].map(region => (
                  <button
                    key={region.key}
                    onClick={() => setSelectedRegion(region.key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      border: '1px solid #ddd',
                      backgroundColor: selectedRegion === region.key ? '#FF6B57' : '#fff',
                      color: selectedRegion === region.key ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
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
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      border: '1px solid #ddd',
                      backgroundColor: selectedRegion === region.key ? '#FF6B57' : '#fff',
                      color: selectedRegion === region.key ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 무더위쉼터 목록 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <h2 style={{ 
            color: '#FF6B57', 
            marginBottom: '15px', 
            fontSize: '18px',
            borderLeft: '4px solid #FF6B57',
            paddingLeft: '10px'
          }}>
            🏠 무더위쉼터 목록 ({filteredData.length}개소)
          </h2>
          
          {/* 목록 컨테이너 */}
          <div style={{ 
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            height: '100%',
            overflow: 'auto'
          }}>
            {filteredData.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#666'
              }}>
                검색 결과가 없습니다.
              </div>
            ) : (
              <div style={{ padding: '10px' }}>
                {filteredData.map((shelter, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #eee',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                  >
                    <h4 style={{ 
                      margin: '0 0 8px 0', 
                      color: '#FF6B57',
                      fontSize: '14px'
                    }}>
                      📍 {shelter.name}
                    </h4>
                    <p style={{ 
                      margin: '0 0 4px 0', 
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <strong>주소:</strong> {shelter.roadAddress}
                    </p>
                    <p style={{ 
                      margin: '0 0 4px 0', 
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <strong>운영시간:</strong> {shelter.weekday}
                    </p>
                    <p style={{ 
                      margin: '0', 
                      fontSize: '12px',
                      color: '#666'
                    }}>
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
  );
}
