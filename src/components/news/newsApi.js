// 네이버 뉴스 API 관련 함수들

// 환경변수에서 API 키 가져오기
const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;

// 지연 함수 (API 속도 제한 방지)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 네이버 뉴스 API 호출 함수
export const fetchNaverNews = async (query = '폭염', display = 20) => {
  try {
    const url = `/api/naver/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}&sort=date`;
    console.log('API 호출 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET'
    });

    console.log('응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API 응답 데이터:', data);
    return data.items || [];
  } catch (error) {
    console.error('네이버 뉴스 API 에러:', error);
    throw error;
  }
};

// 폭염 관련 뉴스 가져오기 (일반 뉴스)
export const fetchHeatwaveNews = async () => {
  try {
    console.log('폭염 뉴스 API 호출 시작...');
    
    // 일반 폭염 뉴스 키워드들 (개수 줄임)
    const keywords = ['폭염', '무더위'];
    const allNews = [];

    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      console.log(`키워드 "${keyword}" 검색 중...`);
      
      try {
        const news = await fetchNaverNews(keyword, 10);
        console.log(`키워드 "${keyword}" 결과:`, news.length, '개');
        allNews.push(...news);
        
        // 다음 요청 전 1초 대기 (속도 제한 방지)
        if (i < keywords.length - 1) {
          await delay(1000);
        }
      } catch (keywordError) {
        console.error(`키워드 "${keyword}" 검색 실패:`, keywordError);
        // 429 에러 시 더 긴 대기
        if (keywordError.message.includes('429')) {
          console.log('속도 제한 감지, 5초 대기...');
          await delay(5000);
        }
      }
    }

    if (allNews.length === 0) {
      console.log('모든 API 호출 실패, 더미 데이터 사용');
      return getDummyHeatwaveNews();
    }

    // 중복 제거 (제목 기준)
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(item => item.title === news.title)
    );

    console.log('최종 폭염 뉴스:', uniqueNews.length, '개');
    // 최신순 정렬
    return uniqueNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  } catch (error) {
    console.error('폭염 뉴스 가져오기 실패:', error);
    return getDummyHeatwaveNews(); // 에러 시 더미 데이터 반환
  }
};

// 폭염 건강 대처법 뉴스 가져오기
export const fetchHealthNews = async () => {
  try {
    console.log('건강 뉴스 API 호출 시작...');
    
    // 건강 관련 키워드들 (개수 줄임)
    const keywords = ['온열질환', '폭염 대처'];
    const allNews = [];

    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      console.log(`키워드 "${keyword}" 검색 중...`);
      
      try {
        const news = await fetchNaverNews(keyword, 10);
        console.log(`키워드 "${keyword}" 결과:`, news.length, '개');
        allNews.push(...news);
        
        // 다음 요청 전 1초 대기 (속도 제한 방지)
        if (i < keywords.length - 1) {
          await delay(1000);
        }
      } catch (keywordError) {
        console.error(`키워드 "${keyword}" 검색 실패:`, keywordError);
        // 429 에러 시 더 긴 대기
        if (keywordError.message.includes('429')) {
          console.log('속도 제한 감지, 5초 대기...');
          await delay(5000);
        }
      }
    }

    if (allNews.length === 0) {
      console.log('모든 API 호출 실패, 더미 데이터 사용');
      return getDummyHealthNews();
    }

    // 중복 제거 (제목 기준)
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(item => item.title === news.title)
    );

    console.log('최종 건강 뉴스:', uniqueNews.length, '개');
    // 최신순 정렬
    return uniqueNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  } catch (error) {
    console.error('건강 뉴스 가져오기 실패:', error);
    return getDummyHealthNews(); // 에러 시 더미 데이터 반환
  }
};

// API 테스트 함수 (개발용)
export const testNaverAPI = async () => {
  try {
    console.log('=== 네이버 API 테스트 시작 ===');
    console.log('환경변수 확인:');
    console.log('CLIENT_ID 존재:', !!CLIENT_ID);
    console.log('CLIENT_SECRET 존재:', !!CLIENT_SECRET);
    
    const result = await fetchNaverNews('폭염', 3);
    console.log('API 테스트 성공:', result);
    return result;
  } catch (error) {
    console.error('API 테스트 실패:', error);
    return null;
  }
};

// 더미 데이터 - 폭염 일반 뉴스 (API 에러 시 사용)
export const getDummyHeatwaveNews = () => [
  {
    title: "올여름 폭염 주의보 발령, 체감온도 35도 육박",
    description: "기상청이 전국에 폭염 주의보를 발령했다고 발표했습니다. 체감온도가 35도를 넘을 것으로 예상된다고...",
    link: "#",
    pubDate: "Mon, 07 Jul 2025 10:00:00 +0900"
  },
  {
    title: "서울·경기 폭염경보 확대, 최고기온 37도 예상",
    description: "기상청은 서울과 경기 지역에 폭염경보를 확대 발령한다고 발표했습니다. 최고기온이 37도까지 오를 것으로...",
    link: "#",
    pubDate: "Mon, 07 Jul 2025 09:30:00 +0900"
  },
  {
    title: "전력수급 비상, 에어컨 사용량 급증으로 전력소비 최고치",
    description: "연일 계속되는 폭염으로 에어컨 사용량이 급증하면서 전력소비량이 역대 최고치를 경신했습니다...",
    link: "#",
    pubDate: "Mon, 07 Jul 2025 08:15:00 +0900"
  }
];

// 더미 데이터 - 건강 대처법 뉴스 (API 에러 시 사용)
export const getDummyHealthNews = () => [
  {
    title: "무더위 대비 건강관리 요령, 충분한 수분 섭취 중요",
    description: "연일 계속되는 무더위로 인한 온열질환 환자가 증가하고 있어 각별한 주의가 필요합니다. 수분 섭취와 휴식이 중요...",
    link: "#",
    pubDate: "Mon, 07 Jul 2025 11:00:00 +0900"
  },
  {
    title: "온열질환 예방법, 시원한 곳에서 충분한 휴식 취해야",
    description: "폭염으로 인한 온열질환을 예방하기 위해서는 시원한 곳에서의 충분한 휴식과 규칙적인 수분 섭취가 필수입니다...",
    link: "#",
    pubDate: "Mon, 07 Jul 2025 10:30:00 +0900"
  },
  {
    title: "어린이·노인 폭염 대처법, 외출 자제하고 실내 활동 권장",
    description: "폭염에 특히 취약한 어린이와 노인을 위한 특별 대처법이 발표되었습니다. 낮 시간 외출을 자제하고...",
    link: "#",
    pubDate: "Mon, 07 Jul 2025 09:45:00 +0900"
  }
];
