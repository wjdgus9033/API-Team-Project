import "./loading.css";

export default function Loading() {
  return (
    <div className="loading-backdrop">
      <div className="loading-modal">
        <div className="loading-spinner"></div>
        <h3 style={{ marginTop: 20 }}>데이터 준비중.</h3>
        <p>잠시 기다려 주세요.</p>
      </div>
    </div>
  );
}
