import styled from "styled-components";
import "./weather.css";
import { convertWeatherItems, calcSummerHeatIndex } from "./weatherUtility";
import tmpimage2 from "./weather-assets/tmpimage2.png";

function getGradientForTemp(val) {
  if (val >= 35) {
    return `linear-gradient(
      to bottom,
      rgba(229, 57, 53, 0.95),
      rgba(255, 87, 34, 0.9)
    )`;
  } else if (val >= 33) {
    return `linear-gradient(
      to bottom,
      rgba(255, 167, 38, 0.9),
      rgba(255, 229, 127, 0.8)
    )`;
  } else {
    return `linear-gradient(
      to bottom,
      rgba(165, 214, 167, 0.8),
      rgba(200, 230, 201, 0.7)
    )`; // 옅은 연두색 안전 느낌
  }
}

const WarningCardImage = styled.img`
  width: 200px;
  height: 200px;
  position: absolute;
  top: auto;
  left: 0;
`;

const TextTitle = styled.h1`
  font-size: 4.5rem;
`;
const TextContent = styled.p`
  font-size: 1.5rem;
`;

const WarningCardWrapper = styled.div`
  width: 100%;
  height: 15rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: inherit;
  position: relative;
  /* background: ${({ val }) => getGradientForTemp(val)}; */
`;

const WarningImageWrapper = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const WarningTextWrapper = styled.div`
width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 2rem;
`;

export default function WarningCard({ items, convertedItems }) {
  const converedtNowItems = Object.values(convertWeatherItems(items, "live"));
  const temp = converedtNowItems[0]?.data?.T1H ?? 0;
  const humid = converedtNowItems[0]?.data?.REH ?? 0;

  const tmpTemp = convertedItems?.data?.TMP ?? 0;
  const tmpHumid = convertedItems?.data?.REH ?? 0;
  const wind = convertedItems?.data?.WSD ?? 0;

  const value = calcSummerHeatIndex(temp, humid, wind);

  return (
    <WarningCardWrapper val={value}>
      <WarningImageWrapper>
        <WarningCardImage src={tmpimage2} alt="" />
      </WarningImageWrapper>
      <WarningTextWrapper>
        <TextTitle>폭염주의</TextTitle>
        <TextContent>더우니까 나가지마세요</TextContent>
      </WarningTextWrapper>
    </WarningCardWrapper>
  );
}
