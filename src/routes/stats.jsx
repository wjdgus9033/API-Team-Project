import { useEffect, useState } from "react";

export default function SimpleFetch() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const key = import.meta.env.VITE_API_KEY;
      const url = `https://apis.data.go.kr/1741000/CasualtiesFromHeatwaveByYear/getCasualtiesFromHeatwaveByYear?ServiceKey=${key}&pageNo=1&numOfRows=14&type=xml`;

      try {
        const res = await fetch(url);
        const xmlText = await res.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const rowElements = xml.getElementsByTagName("row");

        const parsed = [];

        for (let i = 0; i < rowElements.length; i++) {
          const row = rowElements[i];
          const get = (tag) => row.getElementsByTagName(tag)[0]?.textContent || "0";

          parsed.push({
            year: get("wrttimeid"),
            total: get("tot"),
            outdoor: get("otdoor_subtot"),
            indoor: get("indoor_subtot"),
          });
        }

        setRows(parsed);
      } catch (err) {
        console.error("에러 발생:", err);
        setError("데이터를 불러오지 못했습니다.");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 폭염 피해 요약</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>연도</th>
            <th>총 피해자</th>
            <th>외부 피해자</th>
            <th>내부 피해자</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.year}</td>
              <td>{r.total}</td>
              <td>{r.outdoor}</td>
              <td>{r.indoor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}