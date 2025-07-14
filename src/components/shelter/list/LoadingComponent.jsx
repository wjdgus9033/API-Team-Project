import React from 'react';

export default function LoadingComponent({ loadingProgress }) {
  const progressPercentage = loadingProgress.total > 0 
    ? Math.round((loadingProgress.current / loadingProgress.total) * 100) 
    : 0;
    
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      
      <p className="loading-text">
        전국 무더위쉼터 데이터를 불러오는 중...
      </p>
      
      {loadingProgress.total > 0 && (
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-message">
            {loadingProgress.message}
          </p>
          <p className="progress-percentage">
            진행률: {progressPercentage}% ({loadingProgress.current}/{loadingProgress.total} 페이지)
          </p>
        </div>
      )}
    </div>
  );
}
