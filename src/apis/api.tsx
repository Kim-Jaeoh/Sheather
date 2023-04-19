import axios from "axios";
import { LocationStateType } from "../types/type";

// 전체 피드
export const feedApi = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_SERVER_PORT}/api/feed`
  );
  return data;
};

// 단기 예보 정보 가져오기
export const weatherApi = async (location: LocationStateType) => {
  if (location.coordinates.lat) {
    return await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`
    );
  }
};
// 현재 날씨 정보 가져오기
export const nowWeatherApi = async (location: LocationStateType) => {
  if (location.coordinates.lat) {
    return await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`
    );
  }
};

// 현재 주소 받아오기
export const regionApi = async (location: LocationStateType) => {
  if (location.coordinates.lat) {
    return await axios.get(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${location?.coordinates.lon}&y=${location?.coordinates.lat}&input_coord=WGS84`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
        },
      }
    );
  }
};
