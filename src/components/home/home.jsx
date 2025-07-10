// 홈
import "./home.css";
import Total from "../state/statetotal";
import useApiData from "../state/useApiData";

export default function Home() {
  const { rows, loading, error } = useApiData();
  return (
    <div className="dashboard" style={{ textAlign: "center" }}>
      {/* 1. 상단 소개 카드 (가로 전체) */}
      <section className="card full">
        <h1>폭염 대응 정보 포털</h1>
        <p>폭염 피해를 줄이기 위한 정보 제공 및 무더위쉼터 검색 서비스입니다.</p>
        <ul>
          <li>인트로 슬로건: “무더위, 미리 대비합시다!”</li>
        </ul>
      </section>

      {/* 2. 폭염주의보 / 오늘의 날씨 */}
      <section className="card-grid">
        <div className="card">오늘의 폭염주의보</div>
        <div className="card">오늘의 날씨</div>
      </section>

      <section className="card full">
        <div>오늘의 날씨 온도</div>
      </section>

      {/* 3. 간단한 뉴스 2개 */}
      <section className="card-grid">
        <div className="card">간단한 뉴스 1</div>
        <div className="card">간단한 뉴스 2</div>
      </section>

      {/* 4. 온열질환 / 피해자 차트 */}
      <section className="card-grid">
        <div className="card">온열질환 종류 요약</div>
        <div className="card">
          {!loading && !error && <Total data={rows} style={{ width: "100%" }}/>}
          {loading && <p>로딩 중...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </section>
    </div>
  );
}
