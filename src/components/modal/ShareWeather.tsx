import React, { useEffect } from "react";
import { Modal } from "@mui/material";
import styled from "@emotion/styled";
import { ResDataType } from "../slider/SlickSlider";
import { GrClose } from "react-icons/gr";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

type Props = {
  shareBtn: boolean;
  shareBtnClick: () => void;
};

const ShareWeather = ({ shareBtn, shareBtnClick }: Props) => {
  const shareWeatherData = useSelector((state: RootState) => {
    return state.weather;
  });

  return (
    <Modal open={shareBtn} onClose={shareBtnClick} disableScrollLock={false}>
      <Container>
        <Header>
          <CloseBox onClick={shareBtnClick}>
            <GrClose />
          </CloseBox>
        </Header>
        <WeatherCategoryBox>
          <WeatherCategoryText>
            <WeatherCategoryMain>온도</WeatherCategoryMain>
            <WeatherCategorySub>
              {Math.round(shareWeatherData?.main.temp)}º
            </WeatherCategorySub>
          </WeatherCategoryText>
          <WeatherCategoryText>
            <WeatherCategoryMain>체감</WeatherCategoryMain>
            <WeatherCategorySub>
              {Math.round(shareWeatherData?.main?.feels_like)}º
            </WeatherCategorySub>
          </WeatherCategoryText>
          <WeatherCategoryText>
            <WeatherCategoryMain>최고</WeatherCategoryMain>
            <WeatherCategorySub>
              {Math.round(shareWeatherData?.main.temp_max)}º
            </WeatherCategorySub>
          </WeatherCategoryText>
          <WeatherCategoryText>
            <WeatherCategoryMain>최저</WeatherCategoryMain>
            <WeatherCategorySub>
              {Math.round(shareWeatherData?.main.temp_min)}º
            </WeatherCategorySub>
          </WeatherCategoryText>
          <WeatherCategoryText>
            <WeatherCategoryMain>바람</WeatherCategoryMain>
            <WeatherCategorySub>
              {Math.round(shareWeatherData?.wind.speed)}
              <span>m/s</span>
            </WeatherCategorySub>
          </WeatherCategoryText>
        </WeatherCategoryBox>
      </Container>
    </Modal>
  );
};

export default ShareWeather;

const Container = styled.div`
  width: 500px;
  height: 600px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #222;
  box-shadow: 10px 10px 0 -2px #48a3ff, 10px 10px #222222;
  /* box-shadow: 0px 14px 0 -2px #48a3ff, 0px 14px #222222; */
`;

const Header = styled.header`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseBox = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  cursor: pointer;

  svg {
    font-size: 18px;
  }
`;

const WeatherCategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 4px;
`;

const WeatherCategoryText = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 14px;
  }
`;

const WeatherCategoryIconBox = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 26px;
`;

const WeatherCategoryIcon = styled.img`
  display: block;
  margin: 6px 0 0;
  width: 100px;
`;

const WeatherCategoryIconText = styled.span`
  user-select: text;
  font-weight: bold;
`;

const WeatherCategoryMain = styled.span`
  user-select: text;
  border: 1px solid #b3b3b3;
  border-radius: 9999px;
  padding: 2px 6px;
  margin-right: 8px;
  font-size: 10px;
`;

const WeatherCategorySub = styled.span`
  user-select: text;
  font-size: 12px;
  span {
    font-size: 10px;
  }
`;
