import { useState, useEffect } from "react";

// 차트, 표 API따로 빼서 커스텀 훅으로 만들어서 전역으로 사용
export default function useApiData() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const key = import.meta.env.VITE_STATE_API_KEY;
      const res = await fetch(`/state1?serviceKey=${key}&pageNo=1&numOfRows=14&type=xml`);
      console.log(res);
      try {
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const rowElements = xml.getElementsByTagName("row");

        const parsed = Array.from(rowElements).map(row => {
          const get = (tag) => row.getElementsByTagName(tag)[0]?.textContent || "0";
          return {
            year: get("wrttimeid"),
            total: get("tot"),
            outdoor: get("otdoor_subtot"),
            indoor: get("indoor_subtot"),
          };
        });

        setRows(parsed);
      } catch (err) {
        console.error("에러 발생:", err);
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { rows, loading, error };
}
