import { useState, useCallback } from 'react';

export default function useShelterData() {
  const [shelterData, setShelterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState({ 
    current: 0, 
    total: 0, 
    message: '데이터 로드 시작...' 
  });
  
  // 지역별 데이터 캐시 (API 호출 최적화)
  const [regionCache, setRegionCache] = useState({});
  const [currentRegion, setCurrentRegion] = useState('all');

  // 지역 코드 매핑 (API 파라미터용)
  const regionMapping = {
    'seoul': '서울특별시',
    'busan': '부산광역시', 
    'daegu': '대구광역시',
    'incheon': '인천광역시',
    'gwangju': '광주광역시',
    'daejeon': '대전광역시',
    'ulsan': '울산광역시',
    'sejong': '세종특별자치시',
    'gyeonggi': '경기도',
    'gangwon': '강원특별자치도',
    'chungbuk': '충청북도',
    'chungnam': '충청남도',
    'jeonbuk': '전북특별자치도',
    'jeonnam': '전라남도',
    'gyeongbuk': '경상북도',
    'gyeongnam': '경상남도',
    'jeju': '제주특별자치도'
  };

  // 중복 제거 함수
  const removeDuplicates = useCallback((items) => {
    const uniqueItems = items.filter((item, index, self) => 
      index === self.findIndex(t => 
        t.name === item.name && 
        t.lat === item.lat && 
        t.lon === item.lon &&
        t.address === item.address
      )
    );
    return uniqueItems;
  }, []);

  // 지역별 분류 함수
  const getRegionFromAddress = useCallback((address) => {
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
  }, []);

  // 지역별 무더위쉼터 데이터 가져오기 (캐싱 포함)
  const fetchShelterDataByRegion = useCallback(async (regionCode = 'all') => {
    // 캐시에서 먼저 확인
    if (regionCache[regionCode]) {
      console.log(`${regionCode} 지역 데이터를 캐시에서 로드합니다.`);
      setShelterData(regionCache[regionCode]);
      setCurrentRegion(regionCode);
      return;
    }

    setLoading(true);
    setCurrentRegion(regionCode);
    
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      let allData = [];
      
      if (regionCode === 'all') {
        // 전국 데이터 - 배치 로딩으로 지도 성능 최적화
        const regions = Object.keys(regionMapping);
        setLoadingProgress({ 
          current: 0, 
          total: regions.length, 
          message: '전국 무더위쉼터 데이터 로딩 중...' 
        });
        
        // 3개씩 배치로 나누어 처리 (지도 성능 최적화)
        const batchSize = 3;
        for (let batchStart = 0; batchStart < regions.length; batchStart += batchSize) {
          const batch = regions.slice(batchStart, batchStart + batchSize);
          
          // 배치 내에서는 병렬 처리
          const batchPromises = batch.map(async (region, index) => {
            const regionName = regionMapping[region];
            const globalIndex = batchStart + index;
            
            setLoadingProgress({ 
              current: globalIndex + 1, 
              total: regions.length, 
              message: `${regionName} 무더위쉼터 데이터 로딩 중...` 
            });
            
            try {
              const regionData = await fetchRegionData(regionName, key);
              const uniqueRegionData = removeDuplicates(regionData);
              
              // 지역별로도 캐시에 저장
              setRegionCache(prev => ({
                ...prev,
                [region]: uniqueRegionData
              }));
              
              return uniqueRegionData;
            } catch (error) {
              console.error(`❌ ${regionName} 배치 로딩 실패:`, error);
              return [];
            }
          });
          
          // 배치 완료 대기
          const batchResults = await Promise.all(batchPromises);
          allData = [...allData, ...batchResults.flat()];
          
          // 배치 간 대기 (지도 렌더링 시간 확보)
          if (batchStart + batchSize < regions.length) {
            console.log(`📊 배치 ${Math.floor(batchStart/batchSize) + 1} 완료, 1.2초 대기 중...`);
            await new Promise(resolve => setTimeout(resolve, 1200));
          }
        }
        
        // 전국 데이터도 캐시에 저장 (중복 제거 후)
        const finalUniqueData = removeDuplicates(allData);
        setRegionCache(prev => ({
          ...prev,
          'all': finalUniqueData
        }));
        allData = finalUniqueData;
        
      } else {
        // 특정 지역 데이터
        const regionName = regionMapping[regionCode];
        if (!regionName) {
          throw new Error(`지원하지 않는 지역 코드: ${regionCode}`);
        }
        
        setLoadingProgress({ 
          current: 1, 
          total: 1, 
          message: `${regionName} 무더위쉼터 데이터 로딩 중...` 
        });
        
        allData = await fetchRegionData(regionName, key);
        const uniqueAllData = removeDuplicates(allData);
        
        // 지역 데이터 캐시에 저장
        setRegionCache(prev => ({
          ...prev,
          [regionCode]: uniqueAllData
        }));
        
        allData = uniqueAllData;
      }

      console.log(`${regionCode === 'all' ? '전국' : regionMapping[regionCode]} ${allData.length}개의 무더위쉼터 데이터를 로드했습니다.`);
      setShelterData(allData);
      setError(null);
      
      setLoadingProgress({ 
        current: 1, 
        total: 1, 
        message: `${allData.length}개 무더위쉼터 로드 완료` 
      });
      
    } catch (err) {
      console.error("무더위쉼터 데이터 에러:", err);
      setError(`무더위쉼터 데이터 로드 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [regionCache, regionMapping, removeDuplicates]);

  // 개별 지역 데이터 fetch 함수
  const fetchRegionData = async (regionName, apiKey) => {
    console.log(`🌍 ${regionName} 데이터 요청 시작...`);
    
    try {
      // API URL 로깅
      const apiUrl = `/shelter1?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&returnType=JSON&siDo=${encodeURIComponent(regionName)}`;
      console.log(`📡 API URL: ${apiUrl}`);
      
      const res = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log(`📊 ${regionName} 응답 상태: ${res.status}`);
      
      if (!res.ok) {
        // 상세한 에러 정보 로깅
        const errorText = await res.text();
        console.error(`❌ ${regionName} API 에러:`, {
          status: res.status,
          statusText: res.statusText,
          responseText: errorText
        });
        throw new Error(`${regionName} API 호출 실패 (${res.status}): ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log(`📦 ${regionName} 응답 데이터:`, data);
      
      // API 응답 구조 확인
      if (data.header && data.header.resultCode !== "00") {
        console.error(`❌ ${regionName} API 결과 코드 에러:`, data.header);
        throw new Error(`${regionName} API 결과 에러: ${data.header.resultMsg || 'Unknown error'}`);
      }
      
      const items = data.body || [];
      console.log(`✅ ${regionName} 데이터 ${Array.isArray(items) ? items.length : 0}개 로드됨`);
      
      if (!Array.isArray(items)) {
        console.warn(`⚠️ ${regionName}: body가 배열이 아님`, typeof items);
        return [];
      }

      // 정상적으로 데이터를 받은 경우 처리
      return items.map(item => {
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
      
    } catch (fetchError) {
      console.error(`💥 ${regionName} fetch 실패:`, fetchError);
      
      // 500 에러인 경우 잠시 후 재시도
      if (fetchError.message.includes('500')) {
        console.log(`🔄 ${regionName} 500 에러 - 3초 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 재시도 (한 번만)
        try {
          console.log(`🔄 ${regionName} 재시도 중...`);
          const retryRes = await fetch(`/shelter1?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&returnType=JSON&siDo=${encodeURIComponent(regionName)}`, {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            const retryItems = retryData.body || [];
            console.log(`✅ ${regionName} 재시도 성공: ${Array.isArray(retryItems) ? retryItems.length : 0}개`);
            
            if (!Array.isArray(retryItems)) {
              return [];
            }
            
            return retryItems.map(item => {
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
          }
        } catch (retryError) {
          console.error(`💥 ${regionName} 재시도도 실패:`, retryError);
        }
      }
      
      // 에러 발생 시 빈 배열 반환 (전체 로딩 중단 방지)
      console.warn(`⚠️ ${regionName} 데이터를 건너뜁니다.`);
      return [];
    }
  };

  return {
    shelterData,
    loading,
    error,
    loadingProgress,
    currentRegion,
    regionCache,
    fetchShelterDataByRegion,
    setShelterData,
    setError,
    // 하위 호환성을 위한 기존 함수명 유지
    fetchShelterData: () => fetchShelterDataByRegion('all')
  };
}
