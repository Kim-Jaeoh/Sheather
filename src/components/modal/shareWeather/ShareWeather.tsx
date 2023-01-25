import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@mui/material";
import styled from "@emotion/styled";
import { ResDataType } from "../../slider/SlickSlider";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useHandleResizeTextArea } from "../../../hooks/useHandleResizeTextArea";
import ShareWeatherForm from "./ShareWeatherForm";
import Slider from "react-slick";

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
          <HeaderCategory>Share</HeaderCategory>
          <CloseBox onClick={shareBtnClick}>
            <IoMdClose />
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
        <WearInfoBox>
          <WearInfo>
            <WearInfoMain>현재 착장</WearInfoMain>
            <WearInfoSub>패딩, 두꺼운 스웨터, 면바지</WearInfoSub>
          </WearInfo>
          <WearInfo>
            <WearInfoMain>추천 착장</WearInfoMain>
            <WearInfoSub>목도리, 장갑, 히트텍</WearInfoSub>
          </WearInfo>
        </WearInfoBox>
        <ShareWeatherForm />
      </Container>
    </Modal>
  );
};

export default ShareWeather;

const Container = styled.div`
  width: 500px;
  height: 800px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -40%);
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  /* overflow: hidden; */
  overflow: auto;
  border: 2px solid #222;
  box-shadow: 12px 12px 0 -2px #48a3ff, 12px 12px #222222;
  /* box-shadow: 0px 14px 0 -2px #48a3ff, 0px 14px #222222; */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.header`
  height: 48px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  border-bottom: 2px solid #222;
  padding: 0 12px;
  position: sticky;
  background: rgba(255, 255, 255, 0.808);
  top: 0px;
  backdrop-filter: blur(12px);
  z-index: 10;
`;

const HeaderCategory = styled.h2`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px; // 폰트 여백으로 인한 조정
  user-select: none;
`;

const CloseBox = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover,
  &:focus {
    color: #48a3ff;
  }

  svg {
    font-size: 24px;
  }
`;

const WeatherCategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  padding: 12px;
  border-bottom: 2px solid #222;
`;

const WeatherCategoryText = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-of-type) {
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
  font-size: 12px;
`;

const WeatherCategorySub = styled.span`
  user-select: text;
  font-size: 14px;
  span {
    font-size: 12px;
  }
`;

const WearInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* justify-content: space-evenly; */
  /* flex-wrap: wrap; */
  width: 100%;
  /* padding: 12px; */
  border-bottom: 2px solid #222;
  text-align: center;
`;

const WearInfo = styled.div`
  /* height: 100%; */
  flex: 1 1 250px;

  &:not(:last-of-type) {
    border-right: 2px solid #222;
  }
  padding: 12px;
`;

const WearInfoMain = styled.h3`
  user-select: text;
  border: 1px solid #b3b3b3;
  border-radius: 9999px;
  width: 64px;
  margin: 0 auto;
  padding: 4px 6px;
  font-size: 12px;
  margin-bottom: 10px;
`;

const WearInfoSub = styled.span`
  user-select: text;
  font-size: 14px;
`;
