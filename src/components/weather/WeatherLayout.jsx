import { useEffect, useState } from "react";
import { useLocationStore } from "../../../store/locationStore";
import {
  useWeatherAPIStore,
  fetchHourWeatherData,
  fetchNowWeatherData,
  fetchTempNowWeatherData,
} from "../../../store/weatherAPIStore";
import { getBaseHour, getHour, parseStorageItem} from "../../../utility/util";
import Weather from "./Weather";

export default function WeatherLayout() {
  const {
    hourWeatherData,
    nowWeatherData,
    setHourWeatherData,
    setNowWeatherData,
  } = useWeatherAPIStore();
  const { location, startWatching } = useLocationStore();
  const [ _loading, setLoading ] = useState(true);

  function chkLocation() {
    const updatedLoc = parseStorageItem("updatedLocation") ?? location;
    const lastLoc = parseStorageItem("lastLocation") ?? location;

    const updatedLocResult = parseInt(updatedLoc.nx) + parseInt(updatedLoc.ny);
    const lastLocResult = parseInt(lastLoc.nx) + parseInt(lastLoc.ny);
    
    return updatedLocResult === lastLocResult;
  }

  useEffect(() => {
    sessionStorage.setItem("updatedLocation", JSON.stringify(location));
    console.log("location ==============", parseStorageItem("updatedLocation"));
    const watchId = startWatching();
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    //현재 작업중인 사항 >> 세션스토리지에 날씨 아이템 저장하여 API 과호출 방지,
    //Location Data의 값이 같을 시 useEffect를 호출하는걸 방지하여 현재는 1차적으로 방지해주는데 2차방지도 필요할듯함
    //위 과제는 완료, 이제 로케이션값 갖고와서 로케이션까지 비교대상으로 넣어야함 안그러면 타지로 이동해도 동일한 데이터만나옴
    //위 과제 완 시간단위로 불러오는 api 정각되면 업데이트안돼서 안나오는데 그거 바꿨음 아힘들다 그만할래
    async function fetchSet() {
      try {
        setLoading(true);
        const cachedNow = parseStorageItem("nowWeatherData")?.[0]?.baseTime;
        const cachedHour = parseStorageItem("hourWeatherData")?.[0]?.baseTime;
        const checkedLoc = chkLocation();

        const debugNow = (parseInt(cachedNow) + 15).toString();
        //정각때 바로 업데이트 불가능해서(api문제) 정각 + 15분 이후에 변경되게 바꿈
        if ((debugNow !== getHour("check") || !cachedNow) || !checkedLoc) {
          let nowData = await fetchNowWeatherData(location);
          nowData = nowData ? nowData : await fetchTempNowWeatherData(location); 
          nowData && setNowWeatherData(nowData);
        } else {
          setNowWeatherData(parseStorageItem("nowWeatherData"));
        }

        if ((cachedHour !== getBaseHour() || !cachedHour) || !checkedLoc) {
          const hourData = await fetchHourWeatherData(location);
          hourData && setHourWeatherData(hourData);
        } else {
          setHourWeatherData(parseStorageItem("hourWeatherData"));
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSet();
  }, [location]);

  return (
    <Weather
      loading={_loading}
      hourWeatherData={hourWeatherData}
      nowWeatherData={nowWeatherData}
    />
  );
}
