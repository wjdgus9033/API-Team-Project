import React, { useState, useEffect } from 'react';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NewsAPI 키 (실제 사용시 환경변수로 관리)
  const API_KEY = 'YOUR_API_KEY_HERE'; // newsapi.org에서 발급받은 키
  
  // 폭염 관련 키워드
  const heatwaveKeywords = '폭염 OR 무더위 OR 고온 OR 열대야 OR "더위주의보"';

  useEffect(() => {
    fetchHeatwaveNews();
  }, []);

  const fetchHeatwaveNews = async () => {
    try {
      setLoading(true);
      
      // NewsAPI 사용 예시
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(heatwaveKeywords)}&language=ko&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('뉴스를 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
      console.error('뉴스 API 에러:', err);
      
      // API 에러 시 더미 데이터 표시
      setArticles(getDummyNews());
    } finally {
      setLoading(false);
    }
  };

  // 더미 데이터 (API 키가 없을 때 사용)
  const getDummyNews = () => [
    {
      title: "올여름 폭염 주의보 발령, 체감온도 35도 육박",
      description: "기상청이 전국에 폭염 주의보를 발령했다고 발표했습니다. 체감온도가 35도를 넘을 것으로 예상된다고...",
      url: "#",
      urlToImage: null,
      publishedAt: "2025-07-07T10:00:00Z",
      source: { name: "기상청" }
    },
    {
      title: "무더위 대비 건강관리 요령, 충분한 수분 섭취 중요",
      description: "연일 계속되는 무더위로 인한 온열질환 환자가 증가하고 있어 각별한 주의가 필요합니다...",
      url: "#",
      urlToImage: null,
      publishedAt: "2025-07-07T09:30:00Z",
      source: { name: "보건복지부" }
    },
    {
      title: "서울시, 무더위쉼터 운영 확대... 24시간 개방",
      description: "서울시가 폭염 대비 무더위쉼터 운영을 확대한다고 발표했습니다. 주요 지역에서 24시간 운영됩니다...",
      url: "#",
      urlToImage: null,
      publishedAt: "2025-07-07T08:15:00Z",
      source: { name: "서울시청" }
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>
          폭염 관련 뉴스를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#e74c3c', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
        <button 
          onClick={fetchHeatwaveNews}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '28px', 
        marginBottom: '30px', 
        color: '#2c3e50',
        borderBottom: '3px solid #e74c3c',
        paddingBottom: '10px'
      }}>
        🌡️ 폭염 관련 뉴스
      </h1>
      
      <div style={{ marginBottom: '20px', color: '#666' }}>
        총 {articles.length}개의 폭염 관련 기사가 있습니다.
      </div>

      <div style={{ 
        display: 'grid', 
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {articles.map((article, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, shadow 0.2s',
              cursor: 'pointer'
            }}
            onClick={() => window.open(article.url, '_blank')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt="뉴스 이미지"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}
              />
            )}
            
            <h3 style={{ 
              fontSize: '18px', 
              marginBottom: '10px',
              color: '#2c3e50',
              lineHeight: '1.4'
            }}>
              {article.title}
            </h3>
            
            <p style={{ 
              color: '#666', 
              marginBottom: '15px',
              lineHeight: '1.5',
              fontSize: '14px'
            }}>
              {article.description?.substring(0, 150)}
              {article.description?.length > 150 ? '...' : ''}
            </p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#999'
            }}>
              <span>{article.source.name}</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        ))}
      </div>
      
      {articles.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          color: '#666',
          fontSize: '16px'
        }}>
          현재 폭염 관련 뉴스가 없습니다.
        </div>
      )}
    </div>
  );
}
