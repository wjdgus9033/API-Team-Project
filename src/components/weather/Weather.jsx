import WeatherCard from "./WeatherCard";
import { convertWeatherItems } from "./weatherUtility";
import { getToday, getHour } from "../../../utility/util";
import { PText } from "./WeatherStyled";
import WeatherLabelCard from "./WeatherLabelCard";
import WeatherLiveCard from "./WeatherLiveCard";
import WarningCard from "./WarningCard";
import styled from "styled-components";

export const WeatherCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover {
    scrollbar-color: rgba(0, 0, 0, 0.4) transparent;
  }

  &::-webkit-scrollbar {
    height: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

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
    padding: 0.5rem 0;
  `}
`;


export default function Weather({ nowWeatherData, hourWeatherData }) {
  function getNowSkyAndTempData() {
    if (!hourWeatherData) {
      return null;
    }
    const convertItem = convertWeatherItems(hourWeatherData, "day");
    const key = getToday() + getHour();
    const data = convertItem[key];
    return data;
  }

  return (
    <>
      <WeatherCardSection>
        <WeatherCardGrid>
          <WarningCard />
        </WeatherCardGrid>
        <WeatherCardGrid>
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
