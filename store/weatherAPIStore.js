import axios from "axios";
import { create } from "zustand";
import { getHour, getToday, getBaseHour } from "../utility/util";

const API_URL =
  "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
//위에껀 단기예보조회
const URL =
  "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
//이게 초단기예보조회
const SERVICE_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const useWeatherAPIStore = create((set) => ({
  hourWeatherData: null,
  nowWeatherData: null,
  setHourWeatherData: (res) =>  set({hourWeatherData: res}),
  setNowWeatherData: (res) => set({nowWeatherData: res}),
}));

export async function fetchHourWeatherData(position) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        serviceKey: SERVICE_KEY,
        pageNo: 1,
        numOfRows: 736,
        dataType: "JSON",
        base_date: getToday(),
        base_time: getBaseHour(),
        nx: position.nx,
        ny: position.ny,
      },
    });
    return response.data.response.body.items.item;
  } catch (error) {
    console.error("API 호출 에러:", error);
  }
}

export async function fetchNowWeatherData(position) {
    try {
    const response = await axios.get(URL, {
      params: {
        serviceKey: SERVICE_KEY,
        pageNo: 1,
        numOfRows: 7,
        dataType: "JSON",
        base_date: getToday(),
        base_time: getHour(),
        nx: position.nx,
        ny: position.ny,
      },
    });
    return response.data.response.body.items.item;
  } catch (error) {
    console.error("API 호출 에러:", error);
  }
}