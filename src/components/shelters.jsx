import { useEffect, useState } from "react";

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const key = encodeURIComponent(import.meta.env.VITE_SHELTER_API_KEY);
        const res = await fetch(`/shelter?serviceKey=${key}&pageNo=1&numOfRows=10`);
        const xmlText = await res.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const rows = xml.getElementsByTagName("row");

        const parsed = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const get = tag => row.getElementsByTagName(tag)[0]?.textContent || "";

          parsed.push({
            name: get("RSTR_NM"),
            address: get("DTL_ADRES"),
            phone: get("USE_PSB_NMPR") ? `${get("USE_PSB_NMPR")}명 수용 가능` : "정보 없음",
            weekday: `${get("WKDAY_OPER_BEGIN_TIME")} ~ ${get("WKDAY_OPER_END_TIME")}`,
            weekend: `${get("WKEND_HDAY_OPER_BEGIN_TIME")} ~ ${get("WKEND_HDAY_OPER_END_TIME")}`,
            lat: parseFloat(get("YCORD")) || 0,
            lon: parseFloat(get("XCORD")) || 0,
          });
        }

        setShelters(parsed);
      } catch (err) {
        console.error("에러 발생:", err);
        setError("무더위쉼터 정보를 불러오지 못했습니다.");
      }
    };

    fetchShelters();
  }, []);

  return (
    <div>
      <h2>무더위쉼터 목록</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {shelters.map((s, idx) => (
        <div key={idx} style={{ marginBottom: "1rem" }}>
          <strong>{s.name}</strong> ({s.phone})<br />
          {s.address}<br />
          평일 운영: {s.weekday}<br />
          주말 운영: {s.weekend}<br />
          좌표: {s.lat}, {s.lon}
        </div>
      ))}
    </div>
  );
}
