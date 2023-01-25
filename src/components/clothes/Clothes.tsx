import React, { Dispatch, SetStateAction, useMemo } from "react";
import styled from "@emotion/styled";
import { IoMdArrowBack } from "react-icons/io";
import TempClothes from "../../utils/TempClothes";

type Props = {
  index: number;
  temp: number;
  clothBtnClick: (index: number) => void;
};

const Clothes = ({ clothBtnClick, index, temp }: Props) => {
  const { tempClothes } = TempClothes(); // 옷 정보

  const filterTempClothes = useMemo(() => {
    return tempClothes.filter(
      (info) =>
        info.tempMax >= Math.round(temp) && info.tempMin <= Math.round(temp)
    );
  }, [temp]);

  return (
    <Container>
      <WeatherInfoBox>
        <WeatherInfoBtn onClick={() => clothBtnClick(index)}>
          <IoMdArrowBack />
        </WeatherInfoBtn>
      </WeatherInfoBox>
      <WeatherDateListBox>
        <WeatherDateListMain>추천</WeatherDateListMain>
        <WeatherDateListSub>
          {filterTempClothes[0]?.clothes?.map((clothes, index) => (
            <WeatherDateSubList key={index}>{clothes}</WeatherDateSubList>
          ))}
        </WeatherDateListSub>
      </WeatherDateListBox>
    </Container>
  );
};

export default Clothes;

const Container = styled.div`
  position: absolute;
  z-index: 20;
  width: 100%;
  height: 100%;
  margin: -14px;
  padding: 14px;
  background-color: rgba(72, 163, 255, 1);
  animation-name: slideUp;
  animation-duration: 0.2s;
  animation-timing-function: ease-in-out;

  @keyframes slideUp {
    from {
      transform: translateY(50px);
    }
    to {
      transform: translateY(0px);
    }
  }
`;

const WeatherInfoBox = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;

  animation-name: slideDown;
  animation-duration: 0.8s;
  animation-timing-function: ease;

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const WeatherInfoBtn = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #dbdbdb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.1s;
  outline: none;

  &:hover,
  &:focus {
    border: 1px solid #48a3ff;
    svg {
      color: #48a3ff;
    }
  }
  svg {
    font-size: 24px;
  }
`;

const WeatherDateListBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const WeatherDateListMain = styled.p`
  user-select: text;
  border: 1px solid #fff;
  font-weight: bold;
  background: #fff;
  border-radius: 9999px;
  color: #48a3ff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding: 6px 10px;
  width: 52px;
  margin: 28px 0;

  opacity: 0;
  animation-name: slideDown;
  animation-duration: 0.8s;
  animation-delay: 0.2s;
  animation-timing-function: ease;
  animation-fill-mode: both;

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const WeatherDateListSub = styled.ul`
  height: 100%;
`;

const WeatherDateSubList = styled.li`
  color: #fff;
  font-size: 14px;
  align-items: center;
  font-weight: bold;
  &:not(:last-of-type) {
    margin-bottom: 16px;
  }

  opacity: 0;
  animation-name: slideDown;
  animation-duration: 0.8s;
  animation-delay: 0.3s;
  animation-timing-function: ease;
  animation-fill-mode: both;
  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  &:hover,
  &:focus {
    user-select: text;
    /* cursor: pointer; */
    /* background-image: ; */
  }
`;
