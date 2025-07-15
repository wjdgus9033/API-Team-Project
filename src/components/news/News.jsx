import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { fetchHeatwaveNews, fetchHealthNews, testNaverAPI } from './newsApi';
import './News.css';

export default function News() {
  const [heatwaveArticles, setHeatwaveArticles] = useState([]);
  const [healthArticles, setHealthArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('heatwave'); // 'heatwave' or 'health'
  const [showAll, setShowAll] = useState(false);

  const currentArticles = activeTab === 'heatwave' ? heatwaveArticles : healthArticles;
  const displayedArticles = showAll ? currentArticles : currentArticles.slice(0, 4);

  useEffect(() => {
    // API 테스트 먼저 실행
    testNaverAPI().then(() => {
      loadNews();
    });
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 두 카테고리 뉴스를 동시에 로드
      const [heatwaveData, healthData] = await Promise.all([
        fetchHeatwaveNews(),
        fetchHealthNews()
      ]);
      
      setHeatwaveArticles(heatwaveData);
      setHealthArticles(healthData);
    } catch (err) {
      setError('뉴스를 불러오는데 실패했습니다.');
      console.error('뉴스 로드 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="news-loading">
        <div>
          <div className="news-loading-icon">
            🔄
          </div>
          <div className="news-loading-text">
            폭염 관련 뉴스를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-error">
        <div>
          <div className="news-error-message">
            ⚠️ {error}
          </div>
          <button 
            onClick={loadNews}
            className="news-retry-button"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-container">
      {/* 헤더 */}
      <div className="news-header">
        <h1 className="news-title">
          🌡️ 폭염 정보
        </h1>
        
        {/* 탭 메뉴 */}
        <div className="news-tabs">
          <button 
            className={`news-tab ${activeTab === 'heatwave' ? 'active' : ''}`}
            onClick={() => {setActiveTab('heatwave'); setShowAll(false);}}
          >
            📰 폭염 뉴스
          </button>
          <button 
            className={`news-tab ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => {setActiveTab('health'); setShowAll(false);}}
          >
            🏥 건강 대처법
          </button>
        </div>
        
        <div className="news-header-info">
          <div className="news-count">
            <span className="news-count-number">{currentArticles.length}</span>개 기사
          </div>
          
          <button 
            onClick={loadNews}
            className="news-refresh-button"
          >
            🔄 새로고침
          </button>
        </div>
      </div>

      {/* 뉴스 그리드 */}
      {displayedArticles.length > 0 ? (
        <>
          <div className="news-grid">
            {displayedArticles.map((article, index) => (
              <NewsCard 
                key={`${activeTab}-${article.title}-${index}`} 
                article={article}
                category={activeTab}
              />
            ))}
          </div>
          
          {currentArticles.length > 4 && (
            <div className="news-more">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="news-more-button"
              >
                {showAll ? '접기' : `더보기 (${currentArticles.length - 4}개 더)`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="news-empty">
          <div className="news-empty-icon">
            📰
          </div>
          현재 {activeTab === 'heatwave' ? '폭염 뉴스' : '건강 대처법'}가 없습니다.
        </div>
      )}
    </div>
  );
}
