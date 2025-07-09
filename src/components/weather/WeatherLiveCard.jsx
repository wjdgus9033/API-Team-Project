import { convertPTY, convertSky, convertWeatherItems } from "./weatherUtility";

import { LiveCardContainer, Temperature, PText, CardDate, SpanText } from "./WeatherStyled";

export default function WeatherLiveCard({ items, convertedItems}) {
    const convertItem = Object.values((convertWeatherItems(items, "live")));
    console.log("convertedddd ==" , convertedItems)
    console.log(convertItem);

    // baseDate, baseTime, category, fcstDate, fcstTime, fcstValue, nx, ny
  function createCard({time, data}) {
    const styledCard = (
      <>
      <CardDate>{time}</CardDate>
      <Temperature><SpanText>{convertSky(data.SKY)}</SpanText> {data.T1H}℃</Temperature>
      <PText>강수확률: {data.POP}%</PText>
      <>강수형태: {convertPTY(data.PTY)}</>
      </>
    );

    return styledCard;
  }
  return (
    convertItem &&
    convertItem.map((group, groupIdx) => <LiveCardContainer key={groupIdx}>{createCard(group)}</LiveCardContainer>)
  );
}

/*
TMP 1시간 기온 ℃
POP 강수확률 %
PCP 1시간 강수량 mm, 없으면 "강수없음"
SKY 하늘상태 코드값 (1~4)
PTY 강수형태 코드값 (0~6)
REH 습도 %
WSD 풍속 m/s
VEC 풍향 deg (0~360)
UUU 풍속(동서성분) m/s
VVV 풍속(남북성분) m/s
WAV 파고 m (해안/바다예보에서 주로, 육상 -999 의미)
SNO 적설 cm, 없으면 "적설없음"

1 맑음
3 구름많음
4 흐림

0 없음 
1 비 
2 비/눈
3 눈
4 소나기
5 빗방울
6 빗방울눈날림

*/