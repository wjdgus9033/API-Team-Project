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

  // 24시간 형식을 12시간 형식으로 변환하는 함수
  const formatTime = useCallback((timeStr) => {
    if (!timeStr || timeStr === "-" || timeStr.trim() === "") {
      return "-";
    }
    
    // 4자리 숫자 형식 (예: "0900", "1700")인지 확인
    const timeMatch = timeStr.match(/^(\d{4})$/);
    if (!timeMatch) {
      return timeStr; // 형식이 맞지 않으면 원본 반환
    }
    
    const hour = parseInt(timeStr.substring(0, 2));
    const minute = timeStr.substring(2, 4);
    
    if (hour === 0) {
      return `오전 12:${minute}`;
    } else if (hour < 12) {
      return `오전 ${hour}:${minute}`;
    } else if (hour === 12) {
      return `오후 12:${minute}`;
    } else {
      return `오후 ${hour - 12}:${minute}`;
    }
  }, []);

  // 운영시간 형식 변환 함수
  const formatOperatingHours = useCallback((beginTime, endTime) => {
    if (!beginTime || !endTime || beginTime === "-" || endTime === "-") {
      return "-";
    }
    return `${formatTime(beginTime)} ~ ${formatTime(endTime)}`;
  }, [formatTime]);

  // 무더위쉼터 데이터 가져오기 (페이지별 조회)
  const fetchShelterData = useCallback(async () => {
    setLoading(true);
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
            total: 3, 
            message: `페이지 ${currentPage} 데이터 요청 중... (300개씩 요청)` 
          });
          
          console.log(`페이지 ${currentPage} 데이터 요청 중... (300개)`);
          const res = await fetch(`/shelter1?serviceKey=${key}&pageNo=${currentPage}&numOfRows=300&returnType=JSON`, {
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
          
          if (!Array.isArray(items)) {
            throw new Error('API 응답 형식이 올바르지 않습니다.');
          }
          
          if (items.length === 0 && currentPage === 1) {
            throw new Error('API에서 데이터를 받아오지 못했습니다.');
          }

          const parsed = items.map(item => {
            const roadAddress = item.RN_DTL_ADRES || '';
            const detailAddress = item.DTL_ADRES || '';
            const address = roadAddress || detailAddress;
            const region = getRegionFromAddress(address);
            
            return {
              name: item.RSTR_NM,
              address: address,
              region: region,
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
          
          allData.push(...parsed);
          
          console.log(`페이지 ${currentPage} 완료: ${parsed.length}개 항목 추가됨 (누적: ${allData.length}개)`);
          
          setLoadingProgress({ 
            current: currentPage, 
            total: 3, 
            message: `페이지 ${currentPage} 완료: 전국 ${allData.length}개 무더위쉼터 로드됨` 
          });
          
          // 페이지당 300개씩, 300개 미만이면 마지막 페이지
          if (items.length < 300) {
            hasMoreData = false;
          } else {
            currentPage++;
          }
          
          // 최대 900개까지만 로드 (3페이지)
          if (allData.length >= 900 || currentPage > 3) {
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
            currentPage++;
            retryCount = 0;
            
            // 첫 페이지에서 실패하면 전체 실패 처리
            if (currentPage === 2 && allData.length === 0) {
              throw pageError;
            }
            
            // 3페이지 이상 연속 실패하면 중단
            if (currentPage > 6) {
              hasMoreData = false; // 최대 재시도 후에도 실패하면 중단
            }
          }
        }
      }

      console.log(`총 ${allData.length}개의 전국 무더위쉼터 데이터를 로드했습니다.`);
      setShelterData(allData);
      setError(null);
    } catch (err) {
      console.error("무더위쉼터 데이터 에러:", err);
      setError(`무더위쉼터 데이터 로드 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [getRegionFromAddress, formatOperatingHours]);

  return {
    shelterData,
    loading,
    error,
    loadingProgress,
    fetchShelterData,
    setShelterData,
    setError
  };
}
