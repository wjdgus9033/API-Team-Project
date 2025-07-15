import WeatherCard from "./WeatherCard";
import { convertWeatherItems } from "./weatherUtility";
import { getToday, getHour } from "../../../utility/util";
import { WeatherCardWrapper, PText } from "./WeatherStyled";
import WeatherLabelCard from "./WeatherLabelCard";
import WeatherLiveCard from "./WeatherLiveCard";
import WarningCard from "./WarningCard";
import styled from "styled-components";

const WeatherCardSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const WeatherCardGrid = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  position: relative;
  height: 20rem;
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  ${({ full }) => full && `
    margin-bottom: 2rem;
    padding: 10px 0 30px;
  `}
`;


export default function Weather({ nowWeatherData, hourWeatherData }) {
  function getNowSkyAndTempData() {
    if (!hourWeatherData) {
      return null;
    }
    const convertItem = convertWeatherItems(hourWeatherData, "day");
    console.log("converted ============ ", convertItem);
    const key = getToday() + getHour();
    const data = convertItem[key];
    return data;
  }

  return (
    <>
      <WeatherCardSection>
        <WeatherCardGrid>
          <PText mVal={"20px"}>오늘의 폭염주의보</PText>
          <WarningCard />
        </WeatherCardGrid>
        <WeatherCardGrid>
          <PText mVal={"20px"}>오늘의 날씨</PText>
          <WeatherLiveCard
            items={nowWeatherData}
            convertedItems={getNowSkyAndTempData()}
          />
        </WeatherCardGrid>
      </WeatherCardSection>
      <WeatherCardGrid full>
        <PText mVal={"10px"}>오늘의 일간 날씨</PText>
        <WeatherCardWrapper>
          <WeatherLabelCard />
          <WeatherCard items={hourWeatherData} />
        </WeatherCardWrapper>
      </WeatherCardGrid>
    </>
  );
}
