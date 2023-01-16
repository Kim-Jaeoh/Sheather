import React, { useEffect, useState } from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import styled from "@emotion/styled";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { WeatherFiveDataType } from "../types/type";

const Weather = () => {
  const { location } = useCurrentLocation();
  const [weathers, setWeathers] = useState<WeatherFiveDataType | null>(null);

  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`;

  const { data, isLoading } = useQuery<AxiosResponse, AxiosError>(
    ["Weather", location],
    async () => await axios.get(URL),
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location),
    }
  );

  useEffect(() => {
    if (location) {
      setWeathers(data?.data);
    }
  }, [data, location]);

  return (
    <>
      {weathers ? (
        <Container>
          <>
            <WeatherBox>
              {weathers?.list.map((res) => {
                return (
                  <WeatherList key={res.dt}>
                    <div>날짜: {res.dt_txt}</div>
                    <div>
                      <img
                        src={`http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`}
                        alt=""
                      />
                    </div>
                    <div>{res.weather[0].description}</div>
                    <div>최고: {Math.round(res.main.temp_max)}º</div>
                    <div>최저: {Math.round(res.main.temp_min)}º</div>
                    <div>바람: {Math.round(res.wind.speed)}m/s</div>
                  </WeatherList>
                );
              })}
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
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
`;

const WeatherBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const WeatherList = styled.div`
  border: 1px solid #9e9e9e;
  flex: 1 1 120px;
  padding: 12px;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
`;
