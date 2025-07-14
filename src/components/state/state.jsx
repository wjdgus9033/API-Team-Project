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
      <section className="cardall">
        <h1 style={{ textAlign: "center", marginBottom: 15 }}>
          연도별 폭염으로 인한 피해자 수 (차트)
        </h1>

        <div className="chart-container">
          <Total data={rows} />
          <InOutChart data={rows} />
        </div>
      </section>
      <section className="cardall">
        <VictimTable rows={rows} />
        <div className="source">
          ※ 출처: 행정안전부 통계연보 - 연도별 폭염 인명피해
        </div>
      </section>
    </div >
  );
}