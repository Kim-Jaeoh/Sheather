import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { useQuery } from "@tanstack/react-query";
import { MdPlace } from "react-icons/md";
import { Spinner } from "../../assets/spinner/Spinner";
import Flicking from "@egjs/react-flicking";
import "../../styles/DetailFlicking.css";
import TempClothes from "../../assets/data/TempClothes";
import ColorList from "../../assets/data/ColorList";
import { nowWeatherApi, regionApi } from "../../apis/api";
import { BiErrorCircle } from "react-icons/bi";

const FeedWeatherInfo = () => {
  const { location } = useCurrentLocation();
  const { tempClothes } = TempClothes(); // 옷 정보

  // 날씨 정보 받아오기
  const { data: weatherData, isLoading } = useQuery(
    ["Weather", location],
    () => nowWeatherApi(location),
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location?.coordinates?.acc),
    }
  );
  // 현재 주소 받아오기
  const { data: regionData, isLoading: isLoading2 } = useQuery(
    ["Region", location],
    () => regionApi(location),
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location?.coordinates?.acc),
    }
  );

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
        <WeatherBox>
          <NowBox>
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
                src={`/image/weather/${weatherData?.data?.weather[0].icon}.png`}
                // src={`https://openweathermap.org/img/wn/${weatherData?.data?.weather[0].icon}@2x.png`}
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
            <WeatherTemp>
              {Math.round(weatherData?.data?.main.temp)}
              <sup>º</sup>
            </WeatherTemp>
          </WeatherInfo>
          <WeatherClothesInfo>
            <InfoText>추천하는 옷</InfoText>
            <FlickingCategoryBox>
              <Flicking
                onChanged={(e) => console.log(e)}
                moveType="freeScroll"
                bound={true}
                // bounce={0}
                align="prev"
              >
                {/* <WearInfo> */}
                <TagBox>
                  {filterTempClothes[0]?.clothes?.map((res, index) => {
                    return <Tag key={index}>{res}</Tag>;
                  })}
                </TagBox>
                {/* </WearInfo> */}
              </Flicking>
            </FlickingCategoryBox>
          </WeatherClothesInfo>
        </WeatherBox>
      ) : (
        <Spinner />
      )}
      {location?.error?.message && (
        <NotInfoBox>
          <NotInfo>
            <BiErrorCircle />
            위치 권한이 허용되지 않았습니다.
          </NotInfo>
        </NotInfoBox>
      )}
    </Container>
  );
};

export default FeedWeatherInfo;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.nav`
  position: sticky;
  top: 0px;
  height: 80px;
  border-top: 2px solid #222;
  border-bottom: 2px solid #222;
  background-color: #fff;
  overflow: hidden;
  z-index: 99;
`;

const WeatherBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  div:not(:nth-of-type(1), :nth-of-type(4)) {
    flex: 1;
  }
  div:nth-of-type(3) {
    flex: 1 0 auto;
  }
`;

const NowBox = styled.div`
  width: 22px;
  height: 100%;
  background-color: #ff5673;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-right: 2px solid #222222;

  p {
    font-size: 12px;
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

const WeatherClothesInfo = styled.div`
  /* flex: 1; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  text-overflow: ellipsis;
  width: 100%;
  height: 100%;
  padding: 6px 14px;
  position: relative;
`;

const FlickingCategoryBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  /* height: 44px; */
  cursor: pointer;
  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  }
`;

const TagBox = styled.div`
  display: flex;
  flex: nowrap;
  width: 100%;
  padding: 2px;
  gap: 8px;
`;

const Tag = styled.div`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  border: 1px solid ${thirdColor};
  border-radius: 4px;

  svg {
    margin-right: 2px;
    font-size: 12px;
    color: ${secondColor};
  }
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  /* height: 50px; */
  flex: 1;
  overflow: hidden;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoText = styled.span`
  font-size: 12px;
  height: 20px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  svg {
    color: ${thirdColor};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const WeatherTemp = styled.p`
  font-size: 18px;
  flex: 1;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  sup {
    margin-bottom: 4px;
    font-size: 14px;
  }
`;

const WeatherDesc = styled.span`
  font-size: 14px;
  word-break: keep-all;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-weight: bold;
`;

const NotInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${secondColor};
`;

const NotInfo = styled.p`
  color: #fff;
  opacity: 0.4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }
`;
