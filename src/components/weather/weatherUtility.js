
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


/**
1
맑음
3
구름많음
4
흐림


0
없음
1
비
2
비/눈
3
눈
4
소나기
5
빗방울
6
빗방울눈날림
 */
