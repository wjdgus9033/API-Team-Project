import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Loading from "./loading"; // 로딩 관련
import "./state.css"
import InOutChart from "./inoutChart"; // 외부 내부 차트
import VictimTable from "./victimTable"; // 피해자 표

export default function SimpleFetch() {
  const [rows, setRows] = useState([]); // row 불러오기
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const key = import.meta.env.VITE_STATE_API_KEY;
      const url = await fetch(`/state?serviceKey=${key}&pageNo=1&numOfRows=14&type=xml`);

      try {
        const xmlText = await url.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const rowElements = xml.getElementsByTagName("row");

        const parsed = [];

        for (let i = 0; i < rowElements.length; i++) {
          const row = rowElements[i];
          const get = (tag) => row.getElementsByTagName(tag)[0]?.textContent || "0"; // 태그별로 row 불러오기

          parsed.push({
            year: get("wrttimeid"),
            total: get("tot"),
            outdoor: get("otdoor_subtot"),
            indoor: get("indoor_subtot"),
          });
        }

        setRows(parsed);
        setLoading(false);

      } catch (err) {
        console.error("에러 발생:", err);
        setError("데이터를 불러오지 못했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div style={{ padding: 20 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h1 style={{ textAlign: "center", marginBottom: 15 }}>
        연도별 폭염으로 인한 피해자 수 (차트)
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", padding: 20, gap: 20 }}>

        <div style={{ width: "30%", minWidth: 300, textAlign: "center" }}>
          <h3>총 피해자 수</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" padding={{ left: 20, right: 20 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="red" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <InOutChart data={rows} />
      </div>

      <VictimTable rows={rows} />
      <div style={{ textAlign: "right", marginTop: 40, marginRight: 20, fontSize: "0.9rem", color: "#666" }}>
        ※ 출처: 행정안전부 통계연보 - 연도별 폭염 인명피해
      </div>
    </div>
  );
}