import { useState, useEffect } from 'react';

export const useSheltersData = () => {
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState(null);

  const fetchShelters = async () => {
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      console.log(key);
      const res = await fetch(`/shelter1?serviceKey=${key}&pageNo=1&numOfRows=1000&returnType=JSON`);
      console.log(res)
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

  useEffect(() => {
    fetchShelters();
  }, []);

  return { shelters, error };
};
