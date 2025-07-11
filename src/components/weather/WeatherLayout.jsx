import { useEffect } from "react";
import { useLocationStore } from "../../../store/locationStore";
import {
  useWeatherAPIStore,
  fetchHourWeatherData,
  fetchNowWeatherData,
} from "../../../store/weatherAPIStore";
import { getBaseHour, getHour, parseStorageItem } from "../../../utility/util";
import Weather from "./Weather";

export default function WeatherLayout() {
  const {
    hourWeatherData,
    nowWeatherData,
    setHourWeatherData,
    setNowWeatherData,
  } = useWeatherAPIStore();
  const { location, startWatching } = useLocationStore();

  useEffect(() => {
    sessionStorage.setItem("updatedLocation", JSON.stringify(location));
    console.log("location ==============", parseStorageItem("updatedLocation"));
    const watchId = startWatching();
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    //현재 작업중인 사항 >> 세션스토리지에 날씨 아이템 저장하여 API 과호출 방지,
    //Location Data의 값이 같을 시 useEffect를 호출하는걸 방지하여 현재는 1차적으로 방지해주는데 2차방지도 필요할듯함
    async function fetchSet() {
      try {
        const cachedNow = parseStorageItem("nowWeatherData")?.[0]?.baseTime;
        const cachedHour = parseStorageItem("hourWeatherData")?.[0]?.baseTime;
        if (cachedNow !== getHour() || !cachedNow) {
          const nowData = await fetchNowWeatherData(location);
          setNowWeatherData(nowData);
          console.log("Debug Test now data is true");
        } else {
          setNowWeatherData(parseStorageItem("nowWeatherData"));
          console.log("Debug now data is false");
        }

        if (cachedHour !== getBaseHour() || !cachedHour) {
          console.log("Debug Test hour data is true");
          const hourData = await fetchHourWeatherData(location);
          setHourWeatherData(hourData);
        } else {
          setHourWeatherData(parseStorageItem("hourWeatherData"));
          console.log("Debug hour data is false");
        }

        console.log(
          "parsed Storage Now Weather Item === ",
          parseStorageItem("nowWeatherData")
        );
        console.log(
          "parsed Storage Hour Weather Item === ",
          parseStorageItem("hourWeatherData")
        );
      } catch (error) {
        console.error("API 호출 에러:", error);
      }
    }
    fetchSet();
  }, [location]);

  return (
    <Weather
      hourWeatherData={hourWeatherData}
      nowWeatherData={nowWeatherData}
    />
  );
}
