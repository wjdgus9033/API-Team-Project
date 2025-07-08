import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import "./root.css";

export default function Root() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="container">
      <nav className="sidebar">
        <Link to="/">홈</Link>
        <Link to="/state">피해 통계</Link>
        <Link to="/shelters">쉼터 찾기</Link>

        <button className="info-button" onClick={() => setInfoOpen(!infoOpen)}>
          정보 안내
        </button>
        {infoOpen && (
          <div className="info-submenu">
            <Link to="/about/what-is-heatwave">폭염이란?</Link>
            <Link to="/about/prevention">예방 수칙 안내</Link>
            <Link to="/about/symptoms">증상별 대처법</Link>
          </div>
        )}
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
