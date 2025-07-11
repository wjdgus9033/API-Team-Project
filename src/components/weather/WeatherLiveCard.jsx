import {
  convertPTY,
  convertSky,
  convertWeatherItems,
  calcSummerHeatIndex,
} from "./weatherUtility";
import styled from "styled-components";
import {
  LiveCardContainer,
  Temperature,
  PText,
  CardDate,
  WeatherImage,
} from "./WeatherStyled";

import tempImage from "./weather-assets/tempImage.png";

const CardLine1 = styled.div`
  border: 1px solid rgba(255, 213, 173, 0.5);
  display: block;
  border-radius: 10px;
  height: 1.5rem;
  text-align: center;
  line-height: 50%;
  padding: 0.2rem;
`;
const LiveWeatherImage = styled.img`
  width: 120px;
  position: absolute;
  top: 0%;
  left: 15%;
`;
const LiveTemp = styled.h1`
  margin-top: 0.5rem;
`;

const LivePText = styled.p`
  margin: ${({ mVal }) => mVal ?? 0};
`;

export default function WeatherLiveCard({ items, convertedItems }) {
  const convertItem = Object.values(convertWeatherItems(items, "live"));
  console.log("convertedddd ==", convertedItems);
  console.log(convertItem);

  // baseDate, baseTime, category, fcstDate, fcstTime, fcstValue, nx, ny
  function createCard({ time, data }) {
    const styledCard = (
      <>
        {/* <CardLine1>
          <PText>{time || "-"} 날씨</PText>
        </CardLine1> */}
        <LiveWeatherImage src={tempImage} alt="Weather" />
        <LiveTemp>{data.T1H ?? convertedItems?.data?.TMP ?? "-"}°</LiveTemp>
        <LivePText>
          체감온도:{" "}
          <strong>
            {calcSummerHeatIndex(
              parseFloat(data.T1H ?? convertedItems?.data?.TMP ?? 0),
              parseFloat(data.REH ?? convertedItems?.data?.REH ?? 0),
              parseFloat(convertedItems?.data?.WSD ?? 0)
            )}
          </strong>
        </LivePText>
        <LivePText mVal="3px">
          습도: <strong>{data.REH ?? convertedItems?.data?.REH ?? "-"}</strong>%
        </LivePText>
        <LivePText mVal="6px">
          비 올 확률: {convertedItems?.data?.POP ?? "-"}%
        </LivePText>
        <LivePText mVal="6px">
          풍속: {convertedItems?.data?.WSD ?? "-"}m/s
        </LivePText>
        <LivePText mVal="6px">강수형태: {convertPTY(data.PTY) ?? "-"}</LivePText>
      </>
    );
    return styledCard;
  }
  return (
    convertItem &&
    convertItem.map((group, groupIdx) => (
      <LiveCardContainer key={groupIdx}>{createCard(group)}</LiveCardContainer>
    ))
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
