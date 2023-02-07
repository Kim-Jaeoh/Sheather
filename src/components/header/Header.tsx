import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { WeatherDataType } from "../../types/type";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { MdPlace } from "react-icons/md";
import { Spinner } from "../../assets/Spinner";

const Header = () => {
  const { location } = useCurrentLocation();
  const { pathname } = useLocation();
  const [weather, setWeather] = useState<WeatherDataType | null>(null);
  const [address, setAddress] = useState({
    name: "",
    region_1depth_name: "",
    region_2depth_name: "",
    region_3depth_name: "",
  });

  console.log(pathname);

  const changeColor = useMemo(() => {
    if (pathname.includes("detail")) {
      return "#ff5673";
    }
    if (pathname.includes("weather")) {
      return "#48a3ff";
    }
    if (pathname.includes("message")) {
      return "#ff5c1b";
    }
    if (pathname.includes("explore")) {
      return "#30c56e";
    }
    return "#ff5673";
  }, [pathname]);

  // 날씨 정보 받아오기
  const weatherApi = async () =>
    await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`
    );

  // 현재 주소 받아오기
  const regionApi = async () => {
    return await axios.get(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${location?.coordinates.lon}&y=${location?.coordinates.lat}&input_coord=WGS84`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
        },
      }
    );
  };

  // 날씨 정보 받아오기
  const { data: weatherData, isLoading } = useQuery(
    ["Weather", location],
    weatherApi,
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location),
    }
  );

  // 현재 주소 받아오기
  const { data: regionData, isLoading: isLoading2 } = useQuery(
    ["Region", weatherData?.data],
    regionApi,
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(weatherData?.data),
    }
  );

  useEffect(() => {
    if (location && regionData?.data) {
      const { documents } = regionData?.data;
      setAddress(documents[0]?.address);
    }
  }, [location, regionData?.data]);

  return (
    <>
      {!isLoading ? (
        <Container>
          <WeatherBox>
            <NowBox changeColor={changeColor}>
              <p>NOW</p>
            </NowBox>
            <WeatherInfo>
              <InfoText>
                <MdPlace />
                <span>
                  {regionData?.data?.documents[0]?.address?.region_3depth_name}
                </span>
              </InfoText>
              <WeatherIcon>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData?.data?.weather[0].icon}@2x.png`}
                  alt="weather icon"
                />
              </WeatherIcon>
            </WeatherInfo>
            <WeatherInfo>
              <InfoText>날씨</InfoText>
              <WeatherDesc>
                {weatherData?.data?.weather[0].description}
              </WeatherDesc>
            </WeatherInfo>
            <WeatherInfo>
              <InfoText>현재</InfoText>
              <WeatherTemp changeColor={changeColor}>
                {Math.round(weatherData?.data?.main.temp)}
                <sup>º</sup>
              </WeatherTemp>
            </WeatherInfo>
            <WeatherInfo>
              <InfoText>최저</InfoText>
              <WeatherTempSub>
                {Math.round(weatherData?.data?.main.temp_min)}
                <sup>º</sup>
              </WeatherTempSub>
            </WeatherInfo>
            <WeatherInfo>
              <InfoText>최고</InfoText>
              <WeatherTempSub>
                {Math.round(weatherData?.data?.main.temp_max)}
                <sup>º</sup>
              </WeatherTempSub>
            </WeatherInfo>
            <WeatherInfo>
              <InfoText>추천하는 옷</InfoText>
              <WeatherIcon></WeatherIcon>
            </WeatherInfo>
          </WeatherBox>
        </Container>
      ) : (
        <Container />
      )}
    </>
  );
};

export default Header;

const Container = styled.nav`
  position: sticky;
  top: 0;
  /* width: 800px; */
  height: 80px;
  border: 2px solid #222222;
  background-color: #fff;
  overflow: hidden;
  z-index: 99;
`;

const WeatherBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const NowBox = styled.div<{ changeColor: string }>`
  width: 22px;
  height: 100%;
  background-color: ${(props) => props.changeColor};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-right: 2px solid #222222;

  p {
    font-size: 14px;
    letter-spacing: 2px;
    font-weight: bold;
    color: #fff;
    transform: rotate(-90deg);
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 120px;
  min-width: 80px;
  text-align: center;
  text-overflow: ellipsis;
  height: 100%;
  padding: 6px 14px;
  position: relative;

  &::after {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    width: 1px;
    height: 100%;
    background: #dbdbdb;
  }
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  img {
    display: block;
    width: 80%;
  }
`;

const InfoText = styled.span`
  font-size: 10px;
  height: 20px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherTemp = styled.p<{ changeColor?: string }>`
  font-size: 20px;
  height: 50px;
  font-weight: bold;
  color: ${(props) => props.changeColor};
  display: flex;
  align-items: center;
  justify-content: center;

  sup {
    margin-bottom: 4px;
    font-size: 14px;
  }
`;

const WeatherTempSub = styled(WeatherTemp)`
  color: #8b8b8b;
`;

const WeatherDesc = styled.span`
  font-size: 14px;
  word-break: keep-all;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-weight: bold;
`;
