import React, { useState } from "react";
import styled from "@emotion/styled";
import moment from "moment";
import Calendar from "react-calendar";
import "../../../styles/Calendar.css"; // css import
import { BsCalendar3 } from "react-icons/bs";
import Slider from "rc-slider";
import "../../../styles/RangeTimeModalRcSlider.css";
import { Modal } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import useMediaScreen from "../../../hooks/useMediaScreen";
import { BiLeftArrowAlt } from "react-icons/bi";

type Props = {
  modalOpen: boolean;
  rangeTime: number[];
  changeValue: Date;
  modalClose: () => void;
  setRangeTime: React.Dispatch<React.SetStateAction<number[]>>;
  setChangeValue: React.Dispatch<React.SetStateAction<Date>>;
  onReset: () => void;
  onDone: () => void;
};

const RangeTimeModal = (props: Props) => {
  const {
    modalOpen,
    changeValue,
    rangeTime,
    modalClose,
    setChangeValue,
    setRangeTime,
    onReset,
    onDone,
  } = props;

  const [isCalendar, setIsCalendar] = useState(false);
  const { isMobile } = useMediaScreen();

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
    <Modal
      open={modalOpen}
      onClose={modalClose}
      disableScrollLock={false}
      // BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <RangeBox isMobile={isMobile}>
        <Header>
          <p>날짜 지정</p>
          {isCalendar ? (
            <IconBox onClick={onClickCalendar} style={{ marginRight: "auto" }}>
              <BiLeftArrowAlt />
            </IconBox>
          ) : (
            <IconBox onClick={modalClose} style={{ marginLeft: "auto" }}>
              <IoMdClose />
            </IconBox>
          )}
        </Header>
        {isCalendar ? (
          <CalendarBox>
            <Calendar
              formatDay={(locale, date) => moment(date).format("D")} // 날'일' 제외하고 숫자만 보이도록 설정
              showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
              onChange={(e: Date) => {
                setClickCalendar(e);
              }}
              value={changeValue}
            />
          </CalendarBox>
        ) : (
          <Container>
            <ViewNumberBox>
              <DateBox onClick={onClickCalendar}>
                <DateIcon>
                  <BsCalendar3 />
                </DateIcon>
                <DateText>{moment(changeValue).format("YYYY-MM-DD")}</DateText>
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
                min={0}
                max={23}
                value={rangeTime}
                onChange={handleSliderChange}
                allowCross={false}
                pushable={1}
                defaultValue={[0, 23]}
              />
            </RangeSlideBox>
            <RangeNumberBox>
              <RangeNumber>0시</RangeNumber>
              <RangeNumber>23시</RangeNumber>
            </RangeNumberBox>
            <ButtonBox>
              <ResetBtn onClick={onReset}>초기화</ResetBtn>
              <DoneBtn onClick={onDone}>완료</DoneBtn>
            </ButtonBox>
          </Container>
        )}
      </RangeBox>
    </Modal>
  );
};

export default RangeTimeModal;

const RangeBox = styled.div<{ isMobile: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 20px;
  border: 2px solid var(--second-color);
  width: 400px;
  background: #fff;
  box-shadow: 8px 8px 0 -2px var(--feed-color), 8px 8px var(--second-color);
  overflow: hidden;

  @media (max-width: 767px) {
    width: 300px;
    border-width: 1px;
    box-shadow: 6px 6px 0 -1px var(--feed-color), 6px 6px var(--second-color);
  }
`;

const Header = styled.header`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  position: relative;
  p {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    font-size: 16px;
    user-select: none;
  }

  overflow: hidden;
  border-bottom: 1px solid var(--third-color);

  @media (max-width: 767px) {
    p {
      font-size: 14px;
    }
  }
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    /* padding: 8px; */
  }
`;

const CancleBox = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid var(--third-color);
`;

const Container = styled.div`
  padding: 20px;
`;

const ViewNumberBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ViewNumber = styled.div`
  font-weight: 500;
  font-size: 14px;
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
  margin: 0 0px -6px;
  margin-top: 20px;
  display: flex;
  align-content: center;
  justify-content: space-between;
`;

const ResetBtn = styled.button`
  padding: 2px 0;
  font-size: 14px;
  cursor: pointer;
  color: var(--feed-color);
`;

const DoneBtn = styled.button`
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 9999px;
  border: 1px solid var(--feed-color);
  background: #fff;
  color: var(--feed-color);

  &:hover,
  &:active {
    color: #fff;
    background: var(--feed-color);
  }

  transition: all 0.15s linear;
`;

const CalendarBox = styled.div`
  z-index: 99;
  /* position: absolute; */
  /* left: -1px; */
  /* top: 52px; */
  /* bottom: 0; */
  /* right: -1px; */
  > div:last-of-type {
    padding: 10px;
    /* border-radius: 0 0 20px 20px; */
    border-top: none;
  }
`;

const DateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  color: var(--second-color);
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
