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
import moment from "moment";
const WeatherSlider = lazy(() => import("../components/weather/WeatherSlider"));

const Weather = () => {
  const [weather, setWeather] = useState<WeathersFiveDataType | null>(null);
  const [weatherArray, setWeatherArray] = useState<
    WeathersFiveDataType[] | null
  >(null);
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
      setWeather({
        ...weatherData?.data,
        dt: weatherData?.data.dt * 1000, // +32400
        // realDateTime: weatherData?.data.dt + 32400, //+32400
      });
    }
  }, [weatherData]);

  useEffect(() => {
    if (weathersData) {
      const list = weathersData?.data?.list.map((res) => {
        return { ...res, dt: res.dt * 1000 };
      });
      // return setWeatherArray({
      //   ...res,
      //   dt: res.dt * 1000, // +32400
      //   // realDateTime: weatherData?.data.dt + 32400, //+32400
      // });
      setWeatherArray(list);
    }
  }, [weathersData]);

  // 날짜 정보 가져오기
  const dateArray = useMemo(() => {
    const checkDate = weatherArray?.map((res) => moment(res?.dt).format("DD"));
    const filter = new Set(checkDate); // 중복 제거
    return Array.from(filter);
  }, [weatherArray]);

  const date1 = useMemo(
    () =>
      weatherArray?.filter(
        (res) => moment(res?.dt).format("DD") === dateArray[0]
      ),
    [dateArray, weatherArray]
  );

  const date2 = useMemo(
    () =>
      weatherArray?.filter(
        (res) => moment(res?.dt).format("DD") === dateArray[1]
      ),
    [dateArray, weatherArray]
  );
  const date3 = useMemo(
    () =>
      weatherArray?.filter(
        (res) => moment(res?.dt).format("DD") === dateArray[2]
      ),
    [dateArray, weatherArray]
  );
  const date4 = useMemo(
    () =>
      weatherArray?.filter(
        (res) => moment(res?.dt).format("DD") === dateArray[3]
      ),
    [dateArray, weatherArray]
  );
  const date5 = useMemo(
    () =>
      weatherArray?.filter(
        (res) => moment(res?.dt).format("DD") === dateArray[4]
      ),
    [dateArray, weatherArray]
  );

  // 이전 날짜 체크
  const dayCheck = useMemo(() => {
    const time = new Date();
    if (filterData1) {
      const checkDate = moment(filterData1[0]?.dt).format("DD");
      return time.getDate() === Number(checkDate); // 오늘 날짜와 day 날짜가 다르면 false
    }
  }, [filterData1]);

  // day+1 날짜 체크2
  const dayPlusCheck = useMemo(() => {
    const time = new Date();
    if (date2) {
      const checkPlusDate = moment(date2[0]?.dt).format("DD");
      return time.getDate() === Number(checkPlusDate); // 오늘 날짜와 day+1 날짜가 다르면 false
    }
  }, [date2]);

  // 현재 날씨 - 시간에 맞게 안내 위치 이동 (32400(초 단위) = 9시간)
  // ( ex. 1시간 = 3600초(60*60*1000) )
  const timeCheck = useMemo(() => {
    if (dayCheck) {
      const check = filterData1.sort((a, b) => a?.dt - b?.dt);
      return dayCheck ? check : null;
    }
  }, [dayCheck, filterData1]);

  const timePlusCheck = useMemo(() => {
    if (dayPlusCheck) {
      const check = filterData2.sort((a, b) => a?.dt - b?.dt);
      return dayPlusCheck ? check : null;
    }
  }, [dayPlusCheck, filterData2]);

  useEffect(() => {
    if (weather && date1 && date2 && date3 && date4 && date5) {
      setFilterData1([weather, ...date1]);
      if (dayPlusCheck) {
        setFilterData2([weather, ...date2]);
      } else {
        setFilterData2(date2);
      }
      setFilterData3(date3);
      setFilterData4(date4);
      setFilterData5(date5);
    }
  }, [date1, date2, date3, date4, date5, dayPlusCheck, weather]);

  return (
    <Container>
      {/* <Toaster position="bottom-left" reverseOrder={false} /> */}
      <WeatherBox>
        <>
          {dayCheck && <WeatherSlider data={timeCheck} />}
          <WeatherSlider data={dayPlusCheck ? timePlusCheck : filterData2} />
          <WeatherSlider data={filterData3} />
          <WeatherSlider data={filterData4} />
          <WeatherSlider data={filterData5} />
        </>
      </WeatherBox>
    </Container>
  );
};

export default Weather;

const Container = styled.main`
  overflow: hidden;
  /* width: 700px; */
  height: 100%;
  border-top: 2px solid #222;
  background: #48a3ff;
`;

const WeatherBox = styled.div`
  position: relative;
  padding: 20px;
  > div:last-of-type {
    /* border-bottom: none; */
  }
`;
