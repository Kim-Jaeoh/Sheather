import { createSlice } from "@reduxjs/toolkit";
import { WeatherDataType, WeathersFiveDataType } from "../types/type";

const initialState: WeathersFiveDataType = {
  id: null,
  cod: null,
  dt: null,
  main: {
    feels_like: null,
    temp: null,
    temp_max: null,
    temp_min: null,
  },
  weather: [
    {
      description: "",
      icon: "",
      id: null,
      main: "",
    },
  ],
  wind: {
    deg: null,
    gust: null,
    speed: null,
  },
};

const getWeather = createSlice({
  name: "getWeather",
  initialState,
  reducers: {
    shareWeather: (state, action) => action.payload,
  },
});

export default getWeather;
export const { shareWeather } = getWeather.actions;
