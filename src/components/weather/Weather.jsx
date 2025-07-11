import WeatherCard from "./WeatherCard";
import { convertWeatherItems } from "./weatherUtility";
import { getToday, getHour } from "../../../utility/util";
import { WeatherCardWrapper, PText } from "./WeatherStyled";
import WeatherLabelCard from "./WeatherLabelCard";
import WeatherLiveCard from "./WeatherLiveCard";
import WarningCard from "./WarningCard";
import styled from "styled-components";

const WeatherCardGrid = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
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
      <section className="weather-card-section">
        <div className="weather-card">
          <PText mVal={"20px"}>오늘의 폭염주의보</PText>
          <WarningCard />
        </div>
        <div className="weather-card">
          오늘의 날씨
          <WeatherLiveCard
            items={nowWeatherData}
            convertedItems={getNowSkyAndTempData()}
          />
        </div>
      </section>
      <section className="weather-card full">
        오늘의 날씨 온도
        <WeatherCardWrapper>
          <WeatherLabelCard />
          <WeatherCard items={hourWeatherData} />
        </WeatherCardWrapper>
      </section>
    </>
  );
}
