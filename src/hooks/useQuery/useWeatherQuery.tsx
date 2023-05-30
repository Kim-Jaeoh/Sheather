import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { weatherApi, nowWeatherApi } from "../../apis/api";
import { WeatherMapDataType, WeatherDataType } from "../../types/type";
import useCurrentLocation from "../useCurrentLocation";

const useWeatherQuery = () => {
  const { location } = useCurrentLocation();

  // 현재 날씨 정보 가져오기
  const { data: weatherData, isLoading: isWeatherLoading } = useQuery<
    AxiosResponse<WeatherDataType>,
    AxiosError
  >(["Weather", location], () => nowWeatherApi(location), {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

  // 단기 예보 정보 가져오기
  const { data: weathersData, isLoading: isWeathersLoading } = useQuery<
    AxiosResponse<WeatherMapDataType>,
    AxiosError
  >(["Weathers", location], () => weatherApi(location), {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

  return { weatherData, weathersData, isWeatherLoading, isWeathersLoading };
};

export default useWeatherQuery;
