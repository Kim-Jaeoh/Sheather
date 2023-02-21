import React, { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import moment from "moment";
import Calendar from "react-calendar";
import "../../../styles/Calendar.css"; // css import
import { BsCalendar3 } from "react-icons/bs";
import Slider from "rc-slider";
import "../../../styles/RangeTimeModalRcSlider.css";
// import "rc-slider/assets/index.css";

type Props = {
  rangeTime: number[];
  setRangeTime: React.Dispatch<React.SetStateAction<number[]>>;
  changeValue: Date;
  setChangeValue: React.Dispatch<React.SetStateAction<Date>>;
  onReset: () => void;
  onDone: () => void;
};

const RangeTimeModal = (props: Props) => {
  const {
    changeValue,
    setChangeValue,
    rangeTime,
    setRangeTime,
    onReset,
    onDone,
  } = props;

  const [isCalendar, setIsCalendar] = useState(false);

  // 캘린더 토글
  const onClickCalendar = () => setIsCalendar((prev) => !prev);

  // 캘린더 날짜 지정 후 닫기
  const setClickCalendar = (e: Date) => {
    setChangeValue(e);
    onClickCalendar();
  };

  const handleSliderChange = (value: number | number[]) => {
    setRangeTime(Array.isArray(value) ? value : [value]); // setRangeTime 함수를 이용해 상태 업데이트
  };

  return (
    <RangeBox>
      <ViewNumberBox>
        {isCalendar && (
          <CalendarBox>
            <Calendar
              formatDay={(locale, date) => moment(date).format("DD")} // 날'일' 제외하고 숫자만 보이도록 설정
              showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
              onChange={(e: Date) => {
                setClickCalendar(e);
              }}
              value={changeValue}
            />
          </CalendarBox>
        )}
        <DateBox onClick={onClickCalendar}>
          {isCalendar ? (
            <ResetBtn>CANCLE</ResetBtn>
          ) : (
            <>
              <DateIcon>
                <BsCalendar3 />
              </DateIcon>
              <DateText>{moment(changeValue).format("YYYY-MM-DD")}</DateText>
            </>
          )}
        </DateBox>
        {rangeTime && (
          <ViewNumber>
            {rangeTime[0] < 10 ? "0" + rangeTime[0] : rangeTime[0]} ~{" "}
            {rangeTime[1] < 10 ? "0" + rangeTime[1] : rangeTime[1]}시
          </ViewNumber>
        )}
      </ViewNumberBox>
      <RangeSlideBox>
        <Slider
          range
          min={1}
          max={24}
          value={rangeTime}
          onChange={handleSliderChange}
          allowCross={false}
          pushable={1}
          defaultValue={[1, 24]}
        />
      </RangeSlideBox>
      <RangeNumberBox>
        <RangeNumber>1시</RangeNumber>
        <RangeNumber>24시</RangeNumber>
      </RangeNumberBox>
      <ButtonBox>
        <ResetBtn onClick={onReset}>RESET</ResetBtn>
        <DoneBtn onClick={onDone}>DONE</DoneBtn>
      </ButtonBox>
    </RangeBox>
  );
};

export default RangeTimeModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const RangeBox = styled.div`
  padding: 20px;
  z-index: 100;
  position: absolute;
  border-radius: 8px;
  top: 40px;
  border: 2px solid ${secondColor};
  width: 300px;
  background: #fff;
  animation-name: slideDown;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
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

const ViewNumberBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ViewNumber = styled.div`
  font-weight: bold;
`;

const RangeSlideBox = styled.div`
  padding: 0 8px;
  margin-top: 20px;
`;

const RangeNumberBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 12px;
`;

const RangeNumber = styled.p`
  font-size: 12px;
`;

const ButtonBox = styled.div`
  margin: 0 -6px -6px;
  margin-top: 20px;
  display: flex;
  align-content: center;
  justify-content: space-between;
`;

const ResetBtn = styled.button`
  padding: 2px 0;
  font-size: 14px;
  cursor: pointer;
  color: #ff5673;
`;

const DoneBtn = styled.button`
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 9999px;
  border: 1px solid #ff5673;
  background: #fff;
  color: #ff5673;

  &:hover,
  &:active {
    color: #fff;
    background: #ff5673;
  }

  transition: all 0.2s linear;
`;

const CalendarBox = styled.div`
  z-index: 99;
  position: absolute;
  left: -1px;
  top: 56px;
  bottom: 0px;
  right: -1px;
  > div {
    padding: 10px;
    border-radius: 0 0 8px 8px;
  }
`;

const DateBox = styled.div`
  display: flex;
  /* justify-content: end; */
  align-items: center;
  gap: 6px;
  cursor: pointer;
  /* position: absolute; */
  /* top: 12px; */
  /* right: 12px; */
  color: ${secondColor};
`;
const DateText = styled.span`
  font-size: 14px;
`;

const DateIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
