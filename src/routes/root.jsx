import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <header style={{ padding: 20, background: "#eee" }}>
        <nav>
          <Link to="/">홈</Link> |{" "}
          <Link to="/stats">피해 통계</Link> |{" "}
          <Link to="/shelters">쉼터 찾기</Link> |{" "}
          <Link to="/about">정보 안내</Link>
        </nav>
      </header>
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
