import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHeatwaveNews, fetchHealthNews } from '../newsApi';
import './HomeNewsSection.css';

export default function HomeNewsSection() {
  const [newsData, setNewsData] = useState([]);
  const [healthNewsData, setHealthNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [healthNewsLoading, setHealthNewsLoading] = useState(true);

  // HTML 태그 제거 함수
  const removeHtmlTags = (text) => {
    return text ? text.replace(/<[^>]*>/g, '') : '';
  };

  // HTML 엔티티 디코딩 함수
  const decodeHtmlEntities = (text) => {
    if (!text) return '';
    
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  // HTML 태그 제거 + 엔티티 디코딩
  const cleanText = (text) => {
    const withoutTags = removeHtmlTags(text);
    return decodeHtmlEntities(withoutTags);
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        // 일반 폭염 뉴스 로딩
        const news = await fetchHeatwaveNews();
        setNewsData(news.slice(0, 3));
      } catch (error) {
        // 뉴스 로딩 실패 시 더미 데이터 사용
      } finally {
        setNewsLoading(false);
      }
    };

    const loadHealthNews = async () => {
      try {
        // 건강 대처법 뉴스 로딩
        const healthNews = await fetchHealthNews();
        setHealthNewsData(healthNews.slice(0, 3));
      } catch (error) {
        // 건강 뉴스 로딩 실패 시 더미 데이터 사용
      } finally {
        setHealthNewsLoading(false);
      }
    };
    
    loadNews();
    loadHealthNews();
  }, []);

  return (
    <div className="home-news-section">
      {/* 뉴스 섹션 - 두 개의 카드 */}
      <div className="news-section-grid">
        {/* 일반 폭염 뉴스 카드 */}
        <div className="news-brief-card">
          <div className="news-header">
            <h3>📰 폭염 관련 뉴스</h3>
            <Link to="/news" className="more-link">더보기 →</Link>
          </div>
          <div className="news-brief-list">
            {newsLoading ? (
              <div className="news-loading">뉴스를 불러오는 중...</div>
            ) : newsData.length > 0 ? (
              newsData.map((article, index) => (
                <div key={index} className="news-brief-item">
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="news-link">
                    <h4>{cleanText(article.title)}</h4>
                  </a>
                  <span className="news-time">{new Date(article.pubDate).toLocaleString('ko-KR')}</span>
                </div>
              ))
            ) : (
              <div className="news-brief-item">
                <Link to="/news" className="news-link">
                  <h4>서울 폭염주의보 발령, 체감온도 37도</h4>
                </Link>
                <span className="news-time">2시간 전</span>
              </div>
            )}
          </div>
        </div>

        {/* 건강 대처법 뉴스 카드 */}
        <div className="news-brief-card health-news-card">
          <div className="news-header">
            <h3>🏥 건강 대처법 뉴스</h3>
            <Link to="/news" className="more-link">더보기 →</Link>
          </div>
          <div className="news-brief-list">
            {healthNewsLoading ? (
              <div className="news-loading">건강 뉴스를 불러오는 중...</div>
            ) : healthNewsData.length > 0 ? (
              healthNewsData.map((article, index) => (
                <div key={index} className="news-brief-item">
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="news-link">
                    <h4>{cleanText(article.title)}</h4>
                  </a>
                  <span className="news-time">{new Date(article.pubDate).toLocaleString('ko-KR')}</span>
                </div>
              ))
            ) : (
              <div className="news-brief-item">
                <Link to="/news" className="news-link">
                  <h4>온열질환 예방법, 충분한 수분 섭취 중요</h4>
                </Link>
                <span className="news-time">3시간 전</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
