import styled from "styled-components";
import { convertWeatherItems, calcHeatIndexSimple } from "./weatherUtility";
import hot from "./weather-assets/hot.png";
import warm from "./weather-assets/warm.png";
import cool from "./weather-assets/cool.png";

function getGradientForTemp(val) {
  if (val >= 35) {
    return `linear-gradient(
      to bottom,
      rgba(229, 57, 53, 0.95),
      rgba(255, 87, 34, 0.9)
    )`;
  } else if (val >= 32) {
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
  width: 100%;
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
  height: 100%;
  display: flex;
  border-radius: inherit;
  position: absolute;
  top: 0;
  background: ${({ val }) => getGradientForTemp(val)};
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
`;

function getTitle(val) {
  if (val >= 35) {
    return "폭염!";
  } else if (val >= 32) {
    return "폭염주의!";
  } else {
    return "선선함";
  }
}
function getContent(val) {
  if (val >= 35) {
    return "열사병에 주의하세요!";
  } else if (val >= 32) {
    return "외출 시 주의하세요!";
  } else {
    return "날씨가 시원합니다.";
  }
}

function getImage(val) {
  if (val >= 35) {
    return hot;
  } else if (val >= 32) {
    return warm;
  } else {
    return cool;
  }
}

export default function WarningCard({ items, convertedItems }) {
  const converedtNowItems = Object.values(convertWeatherItems(items, "live"));
  const temp = converedtNowItems[0]?.data?.T1H ?? 0;
  const humid = converedtNowItems[0]?.data?.REH ?? 0;

  const tmpTemp = convertedItems?.data?.TMP ?? 0;
  const tmpHumid = convertedItems?.data?.REH ?? 0;

  const value = calcHeatIndexSimple(temp, humid);

  return (
    <WarningCardWrapper val={value}>
      <WarningImageWrapper>
        <WarningCardImage src={getImage(value)} alt="" />
      </WarningImageWrapper>
      <WarningTextWrapper>
        <TextTitle val={value}>{getTitle(value)}</TextTitle>
        <TextContent>{getContent(value)}</TextContent>
      </WarningTextWrapper>
    </WarningCardWrapper>
  );
}
