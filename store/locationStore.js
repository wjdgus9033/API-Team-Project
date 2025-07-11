import { create } from "zustand";
import { parseStorageItem } from "../utility/util";

const defaultLoc = convertLocation(37.2914844, 127.012561);

export const useLocationStore = create((set) => ({
  location: defaultLoc,
  setLocation: (loc) => set({ location: loc }),
  startWatching: () => {
    const watchId = navigator.geolocation.watchPosition(
      (loc) => {
        if (!loc) return;
        const val = parseStorageItem("updatedLocation");
        const parseVal = parseInt(val.nx, 10) + parseInt(val.ny, 10);
        const convertLoc = convertLocation(
          loc.coords.latitude,
          loc.coords.longitude
        );
        const parseLoc = parseInt(convertLoc.nx, 10) + parseInt(convertLoc.ny, 10);

        if(parseVal === parseLoc) return console.log("좌표가 동일합니다.");
        set({ location: convertLoc });
        sessionStorage.setItem("updatedLocation", JSON.stringify(convertLoc));
      },
      (error) => {
        console.warn(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
    return watchId;
  },
}));

export function convertLocation(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}
