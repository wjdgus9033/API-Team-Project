// 환경변수에서 API 키 가져오기 (나중에 설정)
const envType = import.meta.env.VITE_ENV_TYPE;

// 공통 fetch 함수 (환경별 분기)
async function fetchNews(query) {
  let apiUrl = '';
  if (envType === 'dev') {
    // 개발 환경: 네이버 API 프록시 서버 경로 (예시)
    apiUrl = `/api/naver/v1/search/news.json?query=${encodeURIComponent(query)}&display=10&sort=sim`;
  } else if (envType === 'prod') {
    // 배포 환경: PHP 프록시 사용
    apiUrl = `./api/news-data.php?query=${encodeURIComponent(query)}`;
  } else {
    throw new Error('환경변수 VITE_ENV_TYPE가 dev 또는 prod로 설정되어야 합니다.');
  }

  const res = await fetch(apiUrl);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`뉴스 API 호출 실패: ${errorText}`);
  }
  return await res.json();
}

// 여러 키워드로 뉴스 통합 검색 (중복 제거 및 최신순 정렬)
async function fetchMultiKeywordNews(keywords) {
  const allNews = [];
  for (let i = 0; i < keywords.length; i++) {
    try {
      const data = await fetchNews(keywords[i]);
      if (data.items) allNews.push(...data.items);
      // 네이버 API 속도 제한 방지 (개발 환경에서만 적용)
      if (envType === 'dev' && i < keywords.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (e) {
      // 429 등 에러 시 대기 (개발 환경에서만 적용)
      if (envType === 'dev' && e.message.includes('429')) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  // 중복 제거 (title 기준)
  const uniqueNews = allNews.filter(
    (news, idx, self) => idx === self.findIndex(item => item.title === news.title)
  );
  // 최신순 정렬
  return uniqueNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

// 폭염 관련 뉴스 가져오기 (일반 뉴스)
export const fetchHeatwaveNews = async () => {
  const keywords = ['폭염', '무더위', '폭염주의보', '폭염경보'];
  return await fetchMultiKeywordNews(keywords);
};

// 폭염 건강 대처법 뉴스 가져오기
export const fetchHealthNews = async () => {
  const keywords = ['온열질환', '폭염 대처', '폭염 건강', '열사병', '일사병'];
  return await fetchMultiKeywordNews(keywords);
};

// API 테스트 함수
export const testNaverAPI = async () => {
  try {
    const data = await fetchNews('테스트');
    return !!data;
  } catch (error) {
    console.error('API 테스트 실패:', error);
    return null;
  }
};