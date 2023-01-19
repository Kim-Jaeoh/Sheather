import React, { useEffect, useState } from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import styled from "@emotion/styled";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  WeatherDataType,
  WeatherMapDataType,
  WeathersFiveDataType,
} from "../types/type";
import SlickSlider from "../utils/SlickSlider";

const Weather = () => {
  const { location } = useCurrentLocation();
  const [weathers, setWeathers] = useState<WeathersFiveDataType>(null);
  const [filterDate, setFilterDate] = useState([]); // 날짜
  const [filterData1, setFilterData1] = useState<WeathersFiveDataType[]>([]);
  const [filterData2, setFilterData2] = useState<WeathersFiveDataType[]>([]);
  const [filterData3, setFilterData3] = useState<WeathersFiveDataType[]>([]);
  const [filterData4, setFilterData4] = useState<WeathersFiveDataType[]>([]);
  const [filterData5, setFilterData5] = useState<WeathersFiveDataType[]>([]);
  const [dayCheck, setDayCheck] = useState(false);
  const [timeCheck, setTimeCheck] = useState(null);

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

  useEffect(() => {
    if (weatherData) {
      setWeathers({
        ...weatherData?.data,
        dt: weatherData?.data.dt + 32400,
        dateTime: weatherData?.data.dt,
      });
    }
  }, [weatherData]);

  useEffect(() => {
    weathersData?.data?.list.map((res) =>
      setFilterDate((prev) => [
        ...prev,
        res?.dt_txt?.split("-")[2].split(" ")[0],
      ])
    );
  }, [weathersData?.data?.list]);

  useEffect(() => {
    const filter = new Set(filterDate);
    let date = [Array.from(filter)];

    const today = weathersData?.data?.list.filter(
      (res) => res.dt_txt?.split("-")[2].split(" ")[0] === date[0][0]
    );

    const today2 = weathersData?.data?.list.filter(
      (res) => res.dt_txt?.split("-")[2].split(" ")[0] === date[0][1]
    );
    const today3 = weathersData?.data?.list.filter(
      (res) => res.dt_txt?.split("-")[2].split(" ")[0] === date[0][2]
    );
    const today4 = weathersData?.data?.list.filter(
      (res) => res.dt_txt?.split("-")[2].split(" ")[0] === date[0][3]
    );
    const today5 = weathersData?.data?.list.filter(
      (res) => res.dt_txt?.split("-")[2].split(" ")[0] === date[0][4]
    );

    if (today) {
      setFilterData1([weatherData?.data, ...today]);
    }
    if (today2) {
      setFilterData2([weathers, ...today2]);
    }
    setFilterData3(today3);
    setFilterData4(today4);
    setFilterData5(today5);
  }, [filterDate, weatherData?.data, weathers, weathersData?.data?.list]);

  // 이전 날짜 체크
  useEffect(() => {
    const time = new Date();
    if (filterData2) {
      const lastDay = filterData1[1]?.dt_txt?.split("-")[2].split(" ")[0];
      setDayCheck(time.getDate() === Number(lastDay)); // 오늘 날짜와 어제 날짜가 다르면 false
    }
  }, [filterData1, filterData2]);

  // 현재 시간에 맞게 안내 위치 이동 (32400(초 단위) = 9시간)
  // ( ex. 1시간 = 3600초(60*60*1000) )
  useEffect(() => {
    const check = [...filterData2].sort(
      (a, b) => (a.dt - 32400) * 1000 - (b.dt - 32400) * 1000
    );
    setTimeCheck(check);
  }, [filterData2, weatherData?.data.dt]);

  return (
    <>
      {!isLoading ? (
        <Container>
          <>
            <WeatherBox>
              {filterData1 &&
              filterData2 &&
              filterData3 &&
              filterData4 &&
              filterData5 ? (
                <>
                  {dayCheck && <SlickSlider data={filterData1} />}
                  <SlickSlider data={timeCheck} />
                  <SlickSlider data={filterData3} />
                  <SlickSlider data={filterData4} />
                  <SlickSlider data={filterData5} />
                </>
              ) : (
                <div>로딩중</div>
              )}
            </WeatherBox>
          </>
        </Container>
      ) : (
        <div>로딩중..</div>
      )}
    </>
  );
};

export default Weather;

const Container = styled.main`
  /* height: 260px; */
  height: 100%;
`;

const WeatherBox = styled.div`
  position: relative;
`;
