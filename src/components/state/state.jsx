import Loading from "./loading"; // 로딩 관련
import "./state.css"
import InOutChart from "./inoutChart"; // 외부 내부 차트
import VictimTable from "./victimTable"; // 피해자 표
import Total from "./statetotal"; // 총 피해자 수
import useApiData from "./useApiData";


export default function State() {
  const { rows, error, loading } = useApiData();

  if (loading) return <Loading />;

  return (
    <div style={{ padding: 20 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h1 style={{ textAlign: "center", marginBottom: 15 }}>
        연도별 폭염으로 인한 피해자 수 (차트)
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", padding: 20, gap: 20 }}>
        <Total data={rows} style={{ width: "30%"}} />
        <InOutChart data={rows} />
      </div>

      <VictimTable rows={rows} />
      <div style={{ textAlign: "right", marginTop: 40, marginRight: 20, fontSize: "0.9rem", color: "#666" }}>
        ※ 출처: 행정안전부 통계연보 - 연도별 폭염 인명피해
      </div>
    </div>
  );
}