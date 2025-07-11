
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

export function convertWeatherItems(items, category) {
  const groups = {};

  if (category === "live") {
    items?.forEach((item) => {
      const key = item.baseDate + item.baseTime;

      if (!groups[key]) {
        groups[key] = {
          time:
            item.baseTime.slice(0, 2) +
            "시",
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
          date:item.fcstDate.slice(6,8) + "일" ,
          time:
            item.fcstTime.slice(0, 2) +
            "시",
          data: {},
        };
      }
      groups[key].data[item.category] = item.fcstValue;
    });
  }
   //console.log("groups ============== " ,groups);
  return groups;
}

export function calcSummerHeatIndex(temp, humidity, windSpeed) {
  const t = parseFloat(temp);
  const h = parseFloat(humidity);
  const w = parseFloat(windSpeed);

  if (isNaN(t) || isNaN(h) || isNaN(w)) return "-";

  const hi = t + 0.33 * h - 0.70 * w - 4.00;
  return hi.toFixed(1);
}