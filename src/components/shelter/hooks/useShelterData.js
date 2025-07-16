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

  // 무더위쉼터 데이터 가져오기
  const fetchShelterData = useCallback(async () => {
    setLoading(true);
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      
      setLoadingProgress({ 
        current: 1, 
        total: 1, 
        message: '전국 무더위쉼터 데이터 요청 중... (500개 일괄 조회)' 
      });
      
      console.log('전국 무더위쉼터 500개 데이터 요청 중...');
      const res = await fetch(`/shelter1?serviceKey=${key}&pageNo=1&numOfRows=500&returnType=JSON`, {
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

      setLoadingProgress({ 
        current: 1, 
        total: 1, 
        message: `완료: 전국 ${parsed.length}개 무더위쉼터 로드됨` 
      });

      console.log(`총 ${parsed.length}개의 전국 무더위쉼터 데이터를 로드했습니다.`);
      setShelterData(parsed);
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
