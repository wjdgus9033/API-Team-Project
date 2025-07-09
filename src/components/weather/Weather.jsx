import { useEffect } from "react";
import WeatherCard from "./WeatherCard";
import styled from "styled-components";
import { useLocationStore } from "../../../store/locationStore";
import { convertWeatherItems } from "./weatherUtility";
import {
  useWeatherAPIStore,
  fetchHourWeatherData,
  fetchNowWeatherData,
} from "../../../store/weatherAPIStore";
import { getToday, getHour } from "../../../utility/util";
import { LabelCard } from "./WeatherStyled";
import WeatherLabelCard from "./WeatherLabelCard";
import WeatherLiveCard from "./WeatherLiveCard";

const WeatherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  justify-content: center;
`;

const WeatherCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  overflow-x: auto;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover {
    scrollbar-color: rgba(0,0,0,0.4) transparent;
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
    background-color: rgba(0,0,0,0.4);
  }
`;

export default function Weather() {
  const {
    hourWeatherData,
    nowWeatherData,
    setHourWeatherData,
    setNowWeatherData,
  } = useWeatherAPIStore();
  const { position, startWatching } = useLocationStore();

  useEffect(() => {
    const watchId = startWatching();
    console.log("position =============== ", position);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    async function fetchSet() {
      try {
        const hourData = await fetchHourWeatherData(position);
        //console.log("data==================", hourData);
        const nowData = await fetchNowWeatherData(position);
        console.log("data==================", nowData, position);
        setHourWeatherData(hourData);
        setNowWeatherData(nowData);
      } catch (error) {
        console.error("API 호출 에러:", error);
      }
    }
    fetchSet();
  }, [position]);

function getNowSky() {
  if (!hourWeatherData) {
    console.log("hourWeatherData가 아직 없음");
    return null;
  }
  const convertItem = convertWeatherItems(hourWeatherData, "day");

  console.log("converted ============ ", convertItem);

  const key = getToday() + getHour();
  console.log("찾는 예보 키:", key);

  const data = convertItem[key];

  if (data) {
    console.log("예보 데이터:", data);
  } else {
    console.warn("예보 없음:", key);
  }

  return data;
}

  return (
    <WeatherWrapper>
      <WeatherCardWrapper>
        <WeatherLiveCard items={nowWeatherData} convertedItems={getNowSky()} />
      </WeatherCardWrapper>
      <WeatherCardWrapper>
        <WeatherLabelCard/>
        <WeatherCard items={hourWeatherData} />
      </WeatherCardWrapper>
    </WeatherWrapper>
  );
}
