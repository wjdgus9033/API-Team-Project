export function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");

  const yyyymmdd = year + month + date;

  return yyyymmdd;
}

export function getHour() {
  const now = new Date();
  now.setHours(now.getHours() - 1);

  const hour = now.getHours().toString().padStart(2, "0") + "00";


  console.log("hour ========== ", hour);

  return hour;
}

export function getBaseHour() {
  const baseHour = parseInt(getHour(), 10) / 100;
  //0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300
  console.log("baseTime : ", baseHour);

  if (baseHour <= 2) return "2300";
  if (baseHour <= 5) return "0200";
  if (baseHour <= 8) return "0500";
  if (baseHour <= 11) return "0800";
  if (baseHour <= 14) return "1100";
  if (baseHour <= 17) return "1400";
  if (baseHour <= 20) return "1700";
  return "2000";
}
