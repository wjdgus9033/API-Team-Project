import { useState, useEffect } from "react";

export default function useApiData() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // VITE_USE_PROXY 값이 'dev'면 개발, 'prod'면 배포
  const envType = import.meta.env.VITE_USE_PROXY;

  useEffect(() => {
    const fetchData = async () => {
      let apiUrl = '';
      if (envType === 'dev') {
        apiUrl = `/state1?serviceKey=${import.meta.env.VITE_STATE_API_KEY}&pageNo=1&numOfRows=20&type=json`;
      } else if (envType === 'prod') {
        apiUrl = `./api/state-data.php`;
      } else {
        setError('환경변수 VITE_USE_PROXY가 dev 또는 prod로 설정되어야 합니다.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        const items = data.CasualtiesFromHeatwaveByYear?.[1]?.row || [];
        const parsed = items.map(row => ({
          year: row.wrttimeid || row.year || "0",
          total: row.tot || row.total || "0",
          outdoor: row.otdoor_subtot || row.outdoor || "0",
          indoor: row.indoor_subtot || row.indoor || "0",
        }));
        setRows(parsed);
      } catch (err) {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { rows, loading, error };
}
