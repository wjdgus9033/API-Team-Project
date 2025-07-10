import { useEffect } from "react";
import WeatherCard from "./WeatherCard";
import { useLocationStore } from "../../../store/locationStore";
import { convertWeatherItems } from "./weatherUtility";
import {
  useWeatherAPIStore,
  fetchHourWeatherData,
  fetchNowWeatherData,
} from "../../../store/weatherAPIStore";
import { getToday, getHour, parseStorageItem } from "../../../utility/util";
import { WeatherWrapper, WeatherCardWrapper } from "./WeatherStyled";
import WeatherLabelCard from "./WeatherLabelCard";
import WeatherLiveCard from "./WeatherLiveCard";


export default function Weather() {
  const {
    hourWeatherData,
    nowWeatherData,
    setHourWeatherData,
    setNowWeatherData,
  } = useWeatherAPIStore();
  const { position, startWatching } = useLocationStore();

  useEffect(() => {
    sessionStorage.setItem("updatedLocation", JSON.stringify(position));
    console.log("location ==============", parseStorageItem("updatedLocation"))
    const watchId = startWatching();
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
    return null;
  }
  const convertItem = convertWeatherItems(hourWeatherData, "day");

  console.log("converted ============ ", convertItem);

  const key = getToday() + getHour();

  const data = convertItem[key];

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
