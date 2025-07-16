import { useState, useEffect } from "react";
import "./shelterloading.css";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }
        return prevProgress + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-backdrop">
      <div className="loading-modal">
        <div className="loading-spinner"></div>
        <h3 style={{ marginTop: 20 }}>연도별 폭염으로 인한 데이터 준비중.</h3>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(Math.min(progress, 100))}%</span>
        </div>
        <p>잠시 기다려 주세요.</p>
      </div>
    </div>
  );
}
