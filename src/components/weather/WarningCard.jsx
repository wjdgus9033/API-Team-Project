import styled from "styled-components";
import { convertWeatherItems, calcHeatIndexSimple } from "./weatherUtility";
import hot from "./weather-assets/hot.png";
import warm from "./weather-assets/warm.png";
import cool from "./weather-assets/cool.png";

function getGradientForTemp(val) {
  if (val >= 35) {
    return `linear-gradient(
      to bottom,
      rgba(237, 45, 42, 0.8),
      rgba(224, 101, 64, 0.7)
    )`;
  } else if (val >= 32) {
    return `linear-gradient(
      to bottom,
      rgba(255, 171, 45, 0.8),
      rgba(255, 217, 127, 0.7)
    )`;
  } else {
    return `linear-gradient(
      to bottom,
      rgba(165, 214, 167, 0.8),
      rgba(200, 230, 201, 0.7)
    )`;
  }
}

const getFontColorForTemp = (val) => {
  if (!val) return "black";

  if (val >= 35) {
    return `rgba(248, 49, 46, 0.9)`;
  } else if (val >= 32) {
    return `rgba(252, 158, 16, 0.9)`;
  } else {
    return `rgba(0, 89, 255, 0.7)`;
  }
};

const WarningCardImage = styled.img`
  width: 100%;
  top: auto;
  left: 0;
`;

const TextTitle = styled.h1`
  font-size: 4.5rem;
  color: ${({ val }) => getFontColorForTemp(val)};
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
  const tmpTemp = convertedItems?.data?.TMP ?? 0;
  const tmpHumid = convertedItems?.data?.REH ?? 0;

  const temp = converedtNowItems[0]?.data?.T1H ?? tmpTemp;
  const humid = converedtNowItems[0]?.data?.REH ?? tmpHumid;

  console.log("temp and humid ===========", temp, humid);

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
