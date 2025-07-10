import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./root.css";

export default function Root() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="container">
      <aside className="side-bar">
        <section className="side-bar__icon-box">
          <section className="side-bar__icon-1">
            <div></div><div></div><div></div>
          </section>
        </section>
        <ul>
          <li>
            <Link to="/">
              <i className="fa-solid fa-house"></i> 홈
            </Link>
          </li>
          <li>
            <Link to="/state">
              <i className="fa-solid fa-chart-line"></i> 피해 통계
            </Link>
          </li>
          <li>
            <Link to="/shelters">
              <i className="fa-solid fa-building-shield"></i> 쉼
              터 찾기
            </Link>
          </li>
          <li>
            <button className="info-button" onClick={() => setInfoOpen(!infoOpen)}>
              <i className="fa-solid fa-circle-info"></i> 정보 안내
            </button>
            {infoOpen && (
              <ul className="info-submenu">
                <li><Link to="/about/heat wave">폭염이란?</Link></li>
                <li><Link to="/about/symptoms">증상별 대처법</Link></li>
                <li><Link to="/about/precautions">예방 수칙 안내</Link></li>
                <li><Link to="/about/relatedsite">관련 사이트 안내</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/news">
              <i className="fa-solid fa-building-shield"></i>📰 폭염 뉴스
            </Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
