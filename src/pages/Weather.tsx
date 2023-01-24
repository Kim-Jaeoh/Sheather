import React, { useEffect, useState, lazy, useMemo } from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import styled from "@emotion/styled";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  WeatherDataType,
  WeatherMapDataType,
  WeathersFiveDataType,
} from "../types/type";
import { Spinner } from "../utils/Spinner";
const SlickSlider = lazy(() => import("../components/slider/SlickSlider"));

const Weather = () => {
  const [weathers, setWeathers] = useState<WeathersFiveDataType | null>(null);
  const [filterData1, setFilterData1] = useState<WeathersFiveDataType[]>([]);
  const [filterData2, setFilterData2] = useState<WeathersFiveDataType[]>([]);
  const [filterData3, setFilterData3] = useState<WeathersFiveDataType[]>([]);
  const [filterData4, setFilterData4] = useState<WeathersFiveDataType[]>([]);
  const [filterData5, setFilterData5] = useState<WeathersFiveDataType[]>([]);
  const { location } = useCurrentLocation();

  const weatherApi = async () =>
    await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`
    );

  const nowWeatherApi = async () =>
    await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`
    );

  // 단기 예보 정보 가져오기
  const { data: weathersData, isLoading } = useQuery<
    AxiosResponse<WeatherMapDataType>,
    AxiosError
  >(["Weathers", location], weatherApi, {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

  // 현재 날씨 정보 가져오기
  const { data: weatherData } = useQuery<
    AxiosResponse<WeatherDataType>,
    AxiosError
  >(["Weather", location], nowWeatherApi, {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

  // 시간 계산 추가
  useEffect(() => {
    if (weatherData) {
      setWeathers({
        ...weatherData?.data,
        dt: weatherData?.data.dt + 32400,
        realDateTime: weatherData?.data.dt + 32400,
      });
    }
  }, [weatherData]);

  // 날짜 정보 가져오기
  const dateArray = useMemo(() => {
    const checkDate = weathersData?.data?.list.map(
      (res) => res?.dt_txt?.split("-")[2].split(" ")[0]
    );
    const filter = new Set(checkDate); // 중복 제거
    return Array.from(filter);
  }, [weathersData?.data?.list]);

  const date1 = useMemo(
    () =>
      weathersData?.data?.list.filter(
        (res) => res.dt_txt?.split("-")[2].split(" ")[0] === dateArray[0]
      ),
    [dateArray, weathersData?.data?.list]
  );

  const date2 = useMemo(
    () =>
      weathersData?.data?.list.filter(
        (res) => res.dt_txt?.split("-")[2].split(" ")[0] === dateArray[1]
      ),
    [dateArray, weathersData?.data?.list]
  );
  const date3 = useMemo(
    () =>
      weathersData?.data?.list.filter(
        (res) => res.dt_txt?.split("-")[2].split(" ")[0] === dateArray[2]
      ),
    [dateArray, weathersData?.data?.list]
  );
  const date4 = useMemo(
    () =>
      weathersData?.data?.list.filter(
        (res) => res.dt_txt?.split("-")[2].split(" ")[0] === dateArray[3]
      ),
    [dateArray, weathersData?.data?.list]
  );
  const date5 = useMemo(
    () =>
      weathersData?.data?.list.filter(
        (res) => res.dt_txt?.split("-")[2].split(" ")[0] === dateArray[4]
      ),
    [dateArray, weathersData?.data?.list]
  );

  // 이전 날짜 체크
  const dayCheck = useMemo(() => {
    const time = new Date();
    if (filterData1) {
      const day = filterData1[1]?.dt_txt?.split("-")[2].split(" ")[0];
      return time.getDate() === Number(day); // 오늘 날짜와 day 날짜가 다르면 false
    }
  }, [filterData1]);

  // day+1 날짜 체크2
  const dayPlusCheck = useMemo(() => {
    const time = new Date();
    if (filterData2) {
      const dayPlus = filterData2[1]?.dt_txt?.split("-")[2].split(" ")[0];
      return time.getDate() === Number(dayPlus); // 오늘 날짜와 day+1 날짜가 다르면 false
    }
  }, [filterData2]);

  // 현재 날씨 - 시간에 맞게 안내 위치 이동 (32400(초 단위) = 9시간)
  // ( ex. 1시간 = 3600초(60*60*1000) )
  const timeCheck = useMemo(() => {
    if (dayCheck) {
      const check = filterData1.sort(
        (a, b) => (a?.dt - 32400) * 1000 - (b?.dt - 32400) * 1000
      );
      return dayCheck ? check : null;
    }
  }, [dayCheck, filterData1]);

  const timePlusCheck = useMemo(() => {
    if (dayPlusCheck) {
      const check = filterData2.sort(
        (a, b) => (a?.dt - 32400) * 1000 - (b?.dt - 32400) * 1000
      );
      return dayPlusCheck ? check : null;
    }
  }, [dayPlusCheck, filterData2]);

  useEffect(() => {
    if (weathers && date1 && date2 && date3 && date4 && date5) {
      setFilterData1([weathers, ...date1]);
      if (dayPlusCheck) {
        setFilterData2([weathers, ...date2]);
      } else {
        setFilterData2(date2);
      }
      setFilterData3(date3);
      setFilterData4(date4);
      setFilterData5(date5);
    }
  }, [date1, date2, date3, date4, date5, dayPlusCheck, weathers]);

  return (
    <>
      {!isLoading ? (
        <Container>
          <WeatherBox>
            <>
              <SlickSlider data={timeCheck} />
              <SlickSlider data={dayPlusCheck ? timePlusCheck : filterData2} />
              <SlickSlider data={filterData3} />
              <SlickSlider data={filterData4} />
              <SlickSlider data={filterData5} />
            </>
          </WeatherBox>
        </Container>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Weather;

const Container = styled.main`
  height: 100%;
`;

const WeatherBox = styled.div`
  position: relative;

  > div:last-of-type {
    border-bottom: none;
  }
`;
