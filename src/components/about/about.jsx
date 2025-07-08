import Poster from './poster';

export default function About() {
  return (
    <div>
      <Poster />
      <ul>
        <li>폭염이 무엇인지?, 폭염주의보/ 경보 기준</li>
        <li>예방 수칙안내 : 물 자주마시기, 
          가장 더운시간(오후 2~5시) 야외 활동 피하기, 
          냉방기 적정 온도 :26~28도 유지, 
          무더위 쉼터 활용(링크로 연결해서 쉼터 이동)</li>
        <li>증상별 대처법 : 증상, 설명, 응급 대처법</li>
        <li>외부 연결 링크 : 기상청 날씨 예보, 재난 안전 포털, 행정안전부 폭염 가이드북</li>
      </ul>
    </div>
  )
}
