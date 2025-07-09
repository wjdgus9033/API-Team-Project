import styled from "styled-components";
import { convertPTY, convertSky, convertWeatherItems } from "./weatherUtility";
import {
  CardContainer,
  Temperature,
  CardDate,
  SpanText,
  WeatherImage,
  LineContainer,
  PText,
  DateLabel,
  CardContainerWrapper,
} from "./WeatherStyled";


export default function WeatherCard({ items }) {
  const convertItem = Object.values(convertWeatherItems(items, "day"));

  // baseDate, baseTime, category, fcstDate, fcstTime, fcstValue, nx, ny
  function createCard({ time,date, data, itemIdx }) {
    const styledCard = (
      <CardContainerWrapper key={itemIdx} time={time}>
        {time === "00시" && <DateLabel>{date}</DateLabel>}
      <CardContainer>
        {/* {nextDateLabel(time)} */}
        <PText>{time}</PText>
        <WeatherImage>ASDF</WeatherImage>
        <Temperature>{data.TMP}℃</Temperature>
        <PText>{data.REH}%</PText>
        <PText>{data.POP}%</PText>
        <PText>{data.WSD}m/s</PText>
      </CardContainer>
      </CardContainerWrapper>
    );
    return styledCard;
  }


  return (
    convertItem &&
    convertItem.map((item, itemIdx) => (
      <>
        {createCard(item, itemIdx)}
      </>
    ))
  );
}

// 0
// :
// data
// :
// PCP
// : "강수없음"
// POP
// : "20"
// PTY
// :
// "0"
// REH
// :
// "90"
// SKY
// :
// "3"
// SNO
// :
// "적설없음"
// TMP
// :
// "25"
// UUU
// :
// "0.8"
// VEC
// :
// "207"
// VVV
// :
// "1.6"
// WAV
// :
// "-999"
// WSD
// :
// "1.8"

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

1
맑음
3
구름많음
4
흐림


0
없음
1
비
2
비/눈
3
눈
4
소나기
5
빗방울
6
빗방울눈날림

*/
