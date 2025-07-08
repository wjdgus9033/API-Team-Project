import { useEffect, useState } from "react";

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const key = import.meta.env.VITE_SHELTER_API_KEY;
        const res = await fetch(`/shelter?serviceKey=${key}&pageNo=1&numOfRows=100&returnType=JSON`);
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
        }));

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
          <strong>{s.name}</strong><br />
          {s.address}<br />
          평일 운영: {s.weekday}<br />
          주말 운영: {s.weekend}<br />
          좌표: {s.lat}, {s.lon}
        </div>
      ))}
    </div>
  );
}
