import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { WeatherDataType } from "../../types/type";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { MdPlace } from "react-icons/md";
import { Spinner } from "../../assets/spinner/Spinner";
import Flicking from "@egjs/react-flicking";
import "../../styles/DetailFlicking.css";
import TempClothes from "../../assets/data/TempClothes";
import ColorList from "../../assets/data/ColorList";
import { IoShirtOutline } from "react-icons/io5";
import { BsSun } from "react-icons/bs";

const MobileFeedWeatherInfo = () => {
  const { location } = useCurrentLocation();
  const { pathname } = useLocation();

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

  const { tempClothes } = TempClothes(); // 옷 정보

  const filterTempClothes = useMemo(() => {
    const temp = weatherData?.data?.main.temp;
    return tempClothes.filter(
      (info) =>
        info.tempMax >= Math.round(temp) && info.tempMin <= Math.round(temp)
    );
  }, [weatherData?.data?.main.temp]);

  return (
    <Container>
      {!isLoading2 ? (
        <WearDetailBox>
          <WearDetail>
            <WearInfoBox>
              <FlickingCategoryBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <WearInfo>
                    <CategoryTagBox>
                      <WearInfoMain>
                        <BsSun />
                      </WearInfoMain>
                      <CategoryTag>
                        <MdPlace />
                        {
                          regionData?.data?.documents[0]?.address
                            ?.region_3depth_name
                        }
                      </CategoryTag>
                      <CategoryTag>
                        <WeatherIcon>
                          <img
                            src={`http://openweathermap.org/img/wn/${weatherData?.data?.weather[0].icon}@2x.png`}
                            alt="weather icon"
                          />
                        </WeatherIcon>
                        {weatherData?.data?.weather[0].description}
                      </CategoryTag>
                      <CategoryTag>
                        {Math.round(weatherData?.data?.main.temp)}
                        <sup>º</sup>
                      </CategoryTag>
                      <CategoryTag>
                        {Math.round(weatherData?.data?.wind.speed)}
                        <span>m/s</span>
                      </CategoryTag>
                      <WearInfoMain style={{ marginLeft: `4px` }}>
                        <IoShirtOutline />
                      </WearInfoMain>
                      {filterTempClothes[0].clothes.map((res, index) => {
                        return <CategoryTag key={index}>{res}</CategoryTag>;
                      })}
                    </CategoryTagBox>
                  </WearInfo>
                </Flicking>
              </FlickingCategoryBox>
            </WearInfoBox>
          </WearDetail>
        </WearDetailBox>
      ) : (
        <Spinner />
      )}
    </Container>
  );
};

export default MobileFeedWeatherInfo;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  /* padding-right: 16px; */
  overflow: hidden;
  color: ${thirdColor};
`;

const WearDetailBox = styled.div`
  width: 100%;
  overflow: hidden;
  padding-right: 16px;
  position: relative;
  /* display: flex;
  align-items: center;
  border: 1px solid red; */
`;

const WearDetail = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const WearInfoBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const WearInfoMain = styled.div`
  flex: 0 0 auto;
  user-select: text;
  color: ${secondColor};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${thirdColor};
    width: 12px;
    height: 12px;
  }
`;

const FlickingCategoryBox = styled.div`
  /* position: relative; */
  width: 100%;
  cursor: pointer;
  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fafafa);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  }
`;

const WearInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  img {
    display: block;
    width: 100%;
  }
`;

const CategoryTagBox = styled.div`
  display: flex;
  flex: nowrap;
  gap: 8px;
`;

const CategoryTag = styled.div`
  font-size: 12px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  border: 1px solid ${fourthColor};
  border-radius: 8px;

  svg {
    margin-right: 2px;
    font-size: 12px;
    color: ${thirdColor};
  }

  span {
    font-size: 10px;
  }
`;
