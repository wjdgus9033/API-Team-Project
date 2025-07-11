import React from 'react';
import './NewsCard.css';

export default function NewsCard({ article, category = 'news' }) {
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

  // 카테고리별 아이콘과 라벨
  const getCategoryInfo = (category) => {
    switch(category) {
      case 'health':
        return { icon: '🏥', label: '건강정보' };
      case 'heatwave':
        return { icon: '📰', label: '폭염뉴스' };
      default:
        return { icon: '📰', label: '뉴스' };
    }
  };

  const categoryInfo = getCategoryInfo(category);
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

  return (
    <div
      className="news-card"
      onClick={() => window.open(article.link, '_blank')}
    >
      <h3 className="news-card-title">
        {cleanText(article.title)}
      </h3>
      
      <p className="news-card-description">
        {cleanText(article.description)?.substring(0, 80)}
        {cleanText(article.description)?.length > 80 ? '...' : ''}
      </p>
      
      <div className="news-card-footer">
        <span className="news-card-category">
          {categoryInfo.icon} {categoryInfo.label}
        </span>
        <span>
          {formatDate(article.pubDate)}
        </span>
      </div>
    </div>
  );
}
