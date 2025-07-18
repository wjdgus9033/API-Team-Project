import { useState, useCallback, useMemo } from 'react';

export default function useShelterData() {
  const [shelterData, setShelterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState({ 
    current: 0, 
    total: 0, 
    message: '데이터 로드 시작...' 
  });
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // 지역 매핑을 상수로 분리하여 성능 향상
  const REGION_MAPPING = useMemo(() => [
    { keys: ['경기도', '경기'], value: 'gyeonggi' },
    { keys: ['서울특별시', '서울'], value: 'seoul' },
    { keys: ['인천광역시', '인천'], value: 'incheon' },
    { keys: ['부산광역시', '부산'], value: 'busan' },
    { keys: ['대구광역시', '대구'], value: 'daegu' },
    { keys: ['대전광역시', '대전'], value: 'daejeon' },
    { keys: ['광주광역시', '광주'], value: 'gwangju' },
    { keys: ['울산광역시', '울산'], value: 'ulsan' },
    { keys: ['세종특별자치시', '세종'], value: 'sejong' },
    { keys: ['강원도', '강원특별자치도'], value: 'gangwon' },
    { keys: ['충청북도', '충북'], value: 'chungbuk' },
    { keys: ['충청남도', '충남'], value: 'chungnam' },
    { keys: ['전라북도', '전북', '전북특별자치도'], value: 'jeonbuk' },
    { keys: ['전라남도', '전남'], value: 'jeonnam' },
    { keys: ['경상북도', '경북'], value: 'gyeongbuk' },
    { keys: ['경상남도', '경남'], value: 'gyeongnam' },
    { keys: ['제주특별자치도', '제주'], value: 'jeju' }
  ], []);

  // 최적화된 지역 분류 함수
  const getRegionFromAddress = useCallback((address) => {
    if (!address) return 'other';
    
    for (const region of REGION_MAPPING) {
      if (region.keys.some(key => address.startsWith(key))) {
        return region.value;
      }
    }
    return 'other';
  }, [REGION_MAPPING]);

  // 최적화된 시간 포맷팅 함수
  const formatTime = useCallback((timeStr) => {
    if (!timeStr || timeStr === "-" || timeStr.trim() === "") {
      return "-";
    }
    
    // 정규표현식으로 4자리 숫자 검증
    if (!/^\d{4}$/.test(timeStr)) {
      return timeStr;
    }
    
    const hour = parseInt(timeStr.slice(0, 2), 10);
    const minute = timeStr.slice(2, 4);
    
    // 조건문 최적화
    if (hour === 0) return `오전 12:${minute}`;
    if (hour < 12) return `오전 ${hour}:${minute}`;
    if (hour === 12) return `오후 12:${minute}`;
    return `오후 ${hour - 12}:${minute}`;
  }, []);

  // 운영시간 형식 변환 함수
  const formatOperatingHours = useCallback((beginTime, endTime) => {
    if (!beginTime || !endTime || beginTime === "-" || endTime === "-") {
      return "-";
    }
    return `${formatTime(beginTime)} ~ ${formatTime(endTime)}`;
  }, [formatTime]);

  // 최적화된 API 호출 함수 (병렬 처리 + 캐싱)
  const fetchShelterData = useCallback(async (forceRefresh = false) => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시
    const now = Date.now();
    
    // 캐시 유효성 검사
    if (!forceRefresh && 
        lastFetchTime && 
        shelterData.length > 0 && 
        (now - lastFetchTime) < CACHE_DURATION) {
      // ...existing code...
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      const MAX_PAGES = 3;
      const ITEMS_PER_PAGE = 300;
      
      setLoadingProgress({ 
        current: 0, 
        total: MAX_PAGES, 
        message: '데이터 요청 준비 중...' 
      });

      // AbortController로 요청 취소 기능 추가
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60초 타임아웃

      // 개별 페이지 요청 함수
      const fetchPage = async (pageNo, retryCount = 0) => {
        try {
          setLoadingProgress(prev => ({ 
            ...prev,
            current: pageNo, 
            message: `페이지 ${pageNo} 데이터 요청 중... (300개)` 
          }));

          // 환경에 따라 API URL 분기
          let apiUrl = '';
          const envType = import.meta.env.VITE_ENV_TYPE;
          if (envType === 'dev') {
            apiUrl = `/shelter1?serviceKey=${key}&pageNo=${pageNo}&numOfRows=${ITEMS_PER_PAGE}&returnType=JSON`;
          } else if (envType === 'prod') {
            apiUrl = `./api/shelter-data.php?pageNo=${pageNo}&numOfRows=${ITEMS_PER_PAGE}`;
          } else {
            throw new Error('환경변수 VITE_ENV_TYPE이 dev 또는 prod로 설정되어야 합니다.');
          }

          const response = await fetch(
            apiUrl,
            {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          const items = data.body || [];
          
          if (!Array.isArray(items)) {
            throw new Error('API 응답 형식이 올바르지 않습니다.');
          }

          // ...existing code...
          return items;

        } catch (error) {
          if (error.name === 'AbortError') {
            throw new Error('요청이 시간 초과되었습니다.');
          }
          
          if (retryCount < 2) {
            // ...existing code...
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return fetchPage(pageNo, retryCount + 1);
          }
          throw error;
        }
      };

      try {
        // 첫 번째 페이지로 데이터 존재 여부 확인
        const firstPageData = await fetchPage(1);
        if (firstPageData.length === 0) {
          throw new Error('API에서 데이터를 받아오지 못했습니다.');
        }

        // 나머지 페이지들을 병렬로 처리
        const remainingPagePromises = [];
        for (let page = 2; page <= MAX_PAGES; page++) {
          remainingPagePromises.push(
            fetchPage(page).catch(err => {
              // ...existing code...
              return []; // 실패한 페이지는 빈 배열 반환
            })
          );
        }

        const remainingPagesData = await Promise.all(remainingPagePromises);
        const allPagesData = [firstPageData, ...remainingPagesData];

        clearTimeout(timeoutId);

        // 데이터 변환 최적화
        const allData = allPagesData.flat().map(item => {
          const roadAddress = item.RN_DTL_ADRES || '';
          const detailAddress = item.DTL_ADRES || '';
          const address = roadAddress || detailAddress;
          
          return {
            name: item.RSTR_NM,
            address,
            region: getRegionFromAddress(address),
            weekday: formatOperatingHours(item.WKDAY_OPER_BEGIN_TIME, item.WKDAY_OPER_END_TIME),
            weekend: item.CHCK_MATTER_WKEND_HDAY_OPN_AT === "N" ||
              !item.WKEND_HDAY_OPER_BEGIN_TIME ||
              !item.WKEND_HDAY_OPER_END_TIME
              ? "주말 휴일"
              : formatOperatingHours(item.WKEND_HDAY_OPER_BEGIN_TIME, item.WKEND_HDAY_OPER_END_TIME),
            lat: item.LA ?? 0,
            lon: item.LO ?? 0,
            tel: item.TELNO || item.TEL || '정보 없음',
            roadAddress: item.RN_DTL_ADRES || '정보 없음',
            detailAddress: item.DTL_ADRES || '정보 없음',
            weekendHolidayOpen: item.CHCK_MATTER_WKEND_HDAY_OPN_AT === "Y" ? "운영" : "휴무"
          };
        });

        // ...existing code...
        setShelterData(allData);
        setLastFetchTime(now);
        setError(null);
        
        setLoadingProgress({ 
          current: MAX_PAGES, 
          total: MAX_PAGES, 
          message: `완료: ${allData.length}개 데이터 로드됨` 
        });

      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }

    } catch (err) {
      // ...existing code...
      setError(`무더위쉼터 데이터 로드 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [getRegionFromAddress, formatOperatingHours, lastFetchTime, shelterData.length]);

  return {
    shelterData,
    loading,
    error,
    loadingProgress,
    fetchShelterData,
    setShelterData,
    setError,
    clearCache: () => {
      setLastFetchTime(null);
      setShelterData([]);
      setError(null);
    },
    isCacheValid: () => {
      if (!lastFetchTime || shelterData.length === 0) return false;
      const CACHE_DURATION = 5 * 60 * 1000; // 5분
      return (Date.now() - lastFetchTime) < CACHE_DURATION;
    }
  };
}
