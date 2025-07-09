// 홈
import Weather from "./weather/Weather";

export default function Home() {
  return (
    <>
      <Weather/>
      <h1>폭염 대응 정보 포털</h1>
      <p>폭염 피해를 줄이기 위한 정보 제공 및 무더위쉼터 검색 서비스입니다.</p>
      <ul>
        <li>인트로 슬로건: “무더위, 미리 대비합시다!”</li>
        <li>오늘의 폭염주의보 (날씨 API 연동 가능), 지금 날씨</li>
        <li>간단한 뉴스</li>
        <li>온열질환 종류, 무더위 피해자 차트</li>
      </ul>
    </>
  );
}
