// 홈
import "./home.css";
import Total from "../state/statetotal";
import useApiData from "../state/useApiData";
import HomeNewsSection from "../news/HomeNewsSection/HomeNewsSection";
import { Link } from "react-router-dom";

export default function Home() {
  const { rows, loading, error } = useApiData();
  return (
    <div className="dashboard" style={{ textAlign: "center" }}>
      {/* 1. 상단 소개 카드 (가로 전체) */}
      <section className="card full">
        <h1>폭염 대응 정보 포털</h1>
        <p>폭염 피해를 줄이기 위한 정보 제공 및 무더위쉼터 검색 서비스입니다.</p>
        <ul>
          <li>“무더위, 미리 대비합시다!”</li>
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
      <section>
        <HomeNewsSection />
      </section>

      {/* 4. 온열질환 / 피해자 차트 */}
      <section className="card-grid">
        <div className="card" style={{ fontSize: "20px", fontWeight: "bold" }}>온열질환 종류 요약<br /><br />
          <div className="table-wrapper">
            <table className="heat-table">
              <thead>
                <tr>
                  <th>질환명</th>
                  <th>주요 증상</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>열사병 (Heat Stroke)</td>
                  <td>의식 저하, 혼수, 체온 40℃ 이상, 발한 없음</td>
                </tr>
                <tr>
                  <td>열탈진 (Heat Exhaustion)</td>
                  <td>어지러움, 식은땀, 구토, 전신 무기력</td>
                </tr>
                <tr>
                  <td>열경련 (Heat Cramps)</td>
                  <td>근육 경련 (종아리, 복부 등)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table-footer" style={{ paddingTop: "10px"}}>
            <Link to="/about/symptoms" className="more-link">더보기</Link>
          </div>
        </div>
        <div className="card">
          {loading && <p>로딩 중...</p>}
          {error && <p style={{ color: "red" }}>{error} </p>}
          {!loading && !error && (
            <>
              <Total data={rows} />
              <Link to="/state" className="more-link">더보기</Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
