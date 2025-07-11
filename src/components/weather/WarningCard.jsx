import styled from "styled-components";
import { convertWeatherItems, calcSummerHeatIndex } from "./weatherUtility";
import tmpimage2 from "./tmpimage2.png";

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

const WarningCardImage = styled.img `
  width  : 200px ;
  height: 200px;
  position: absolute;
  top: auto;
  left: 0;
`;
const TextContainer = styled.div `
        display: flex;
        flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 2rem;
`;

const TextTitle = styled.h1 `
    font-size: 4.5rem;
`
const TextContent = styled.p`
    font-size: 1.5rem;
`;

const WarningCardWrapper = styled.div`
  width: 30%;
  height: 15rem;
  max-width: 40rem;
  min-width: 30rem;
  margin-left: 10%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  border: 1px solid black;
  border-radius: 0.5rem;
  position: relative;
  background: ${({ val }) => getGradientForTemp(val)};
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
      <WarningCardImage src={tmpimage2} alt="" />
      <TextContainer>
        <TextTitle>폭염주의</TextTitle>
        <TextContent>더우니까 나가지마세요</TextContent>
      </TextContainer>
    </WarningCardWrapper>
  );
}
