import { useState, useEffect } from "react";

export default function useApiData() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const useProxy = import.meta.env.VITE_USE_PROXY === 'false';

  useEffect(() => {
    const fetchData = async () => {
      const proxyUrl = useProxy
        ? `/state1?serviceKey=${import.meta.env.VITE_STATE_API_KEY}&pageNo=1&numOfRows=100&type=xml`
        : `https://stack1.dothome.co.kr/api/state-data.php`;

      try {
        const res = await fetch(proxyUrl);
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
