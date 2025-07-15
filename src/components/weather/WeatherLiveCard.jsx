import { PText } from "./WeatherStyled";
import {
  convertPTY,
  getImageFile,
  convertWeatherItems,
  calcHeatIndexSimple,
} from "./weatherUtility";
import styled from "styled-components";

export const LiveCardContainer = styled.div`
  border-radius: inherit;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 89, 255, 0.7),
    rgba(66, 131, 252, 0.4)
  );
`;

const LeftWrapper = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const LiveWeatherImage = styled.img`
  width: calc(100% - 4rem);
`;
const LiveTemp = styled.h1`
  margin-top: 0.5rem;
`;

const LivePText = styled.p`
  margin: ${({ mVal }) => mVal ?? 0};
`;

export default function WeatherLiveCard({ items, convertedItems }) {
  const convertItem = Object.values(convertWeatherItems(items, "live"));
  const now = new Date();
  const minute = now.getMinutes();

  // baseDate, baseTime, category, fcstDate, fcstTime, fcstValue, nx, ny
  function createCard({ time, data }) {
    const get1 = calcHeatIndexSimple(
      parseFloat(data.T1H ?? convertedItems?.data?.TMP ?? 0),
      parseFloat(data.REH ?? convertedItems?.data?.REH ?? 0)
    );
    const styledCard = (
      <>
        <LeftWrapper>
          <LiveWeatherImage src={getImageFile(convertedItems?.data?.SKY ?? "0", data?.PTY ?? "0", time)} alt="Weather" />
          <LiveTemp>{data.T1H ?? convertedItems?.data?.TMP ?? "-"}°</LiveTemp>
          <h3>
            체감온도: <strong>{get1}</strong>
          </h3>
        </LeftWrapper>
        <RightWrapper>
          <h1 style={{margin: "10px", fontSize: "3rem"}}>
            {time}:{minute.toString().padStart(2, "0")}
          </h1>
          <LivePText mVal="3px">
            습도:{" "}
            <strong>{data.REH ?? convertedItems?.data?.REH ?? "-"}</strong>%
          </LivePText>
          <LivePText mVal="6px">
            비 올 확률: {convertedItems?.data?.POP ?? "-"}%
          </LivePText>
          <LivePText mVal="6px">
            풍속: {convertedItems?.data?.WSD ?? "-"}m/s
          </LivePText>
          <LivePText mVal="6px">
            강수형태:
            {convertPTY(data.PTY) ?? "-"}
          </LivePText>
        </RightWrapper>
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
