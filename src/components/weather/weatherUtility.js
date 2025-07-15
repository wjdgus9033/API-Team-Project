import { getHour } from "../../../utility/util";

import sunny from "./weather-assets/sunny.png";
import cloudyDay from "./weather-assets/cloudy-day.png";
import cloudy from "./weather-assets/cloudy.png";
import overCast from "./weather-assets/overcast.png";
import showerDay from "./weather-assets/shower-day.png";
import sleet from "./weather-assets/sleet.png";
import sleetNight from "./weather-assets/sleet-night.png";
import drizzle from "./weather-assets/drizzle.png";
import rain from "./weather-assets/rain.png";
import snow from "./weather-assets/snow.png";
import clearNight from "./weather-assets/clear-night.png";
import cloudyNight from "./weather-assets/cloudy-night.png";
import rainNight from "./weather-assets/rain-night.png"; 
import overCastNight from "./weather-assets/overcast-night.png";

const ptyRecord = {
  1: rain,
  2: sleet,
  3: snow,
  4: showerDay,
  5: drizzle,
  6: "drizzleAndSnow",
};
const skyDayRecord = { 1: sunny, 3: cloudy, 4: overCast };
const skyNightReconds = {
  1: clearNight, 3: cloudyNight, 4: overCastNight
};

export function convertSky(num) {
  switch (num) {
    case "1":
      return "맑음";
    case "3":
      return "구름많음";
    case "4":
      return "흐림";
    default:
      return "날씨 정보 없음";
  }
}

export function convertPTY(num) {
  switch (num) {
    case "0":
      return "없음";
    case "1":
      return "비";
    case "2":
      return "비/눈";
    case "3":
      return "눈";
    case "4":
      return "소나기";
    case "5":
      return "빗방울";
    case "6":
      return "빗방울눈날림";
    default:
      return "강수 정보 없음";
  }
}

export function getImageFile(sky, pty, time) {
  if (time >= 6 && time < 21) {
    if (ptyRecord[pty]) return ptyRecord[pty];
    if (skyDayRecord[sky]) return skyDayRecord[sky];
    return null;
  } else {
    if (ptyRecord[pty]) return ptyRecord[pty];
    if (skyNightReconds[sky]) return skyNightReconds[sky];
    return null;
  }
}

export function convertWeatherItems(items, category) {
  const groups = {};

  if (category === "live") {
    items?.forEach((item) => {
      const key = item.baseDate + item.baseTime;

      if (!groups[key]) {
        groups[key] = {
          time: item.baseTime.slice(0, 2),
          data: {},
        };
      }
      groups[key].data[item.category] = item.obsrValue;
    });
  }

  if (category === "day") {
    items?.forEach((item) => {
      const key = item.fcstDate + item.fcstTime;

      if (!groups[key]) {
        groups[key] = {
          date: item.fcstDate.slice(6, 8) + "일",
          time: item.fcstTime.slice(0, 2),
          data: {},
        };
      }
      groups[key].data[item.category] = item.fcstValue;
    });
  }
  //console.log("groups ============== " ,groups);
  return groups;
}

export function calcHeatIndexSimple(temp, humidity) {
  const T = parseFloat(temp);
  const RH = parseFloat(humidity);

  if (isNaN(T) || isNaN(RH)) return "-";

  // 한국에서 자주 쓰는 간단 체감온도 근사식
  const HI = T + 0.55 * (1 - RH / 100) * (T - 14.5);
  return HI.toFixed(1);
}
