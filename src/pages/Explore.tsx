import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import moment from "moment";
import RangeTimeModal from "../components/modal/feed/RangeTimeModal";
import FeedCategory from "../components/feed/FeedCategory";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ExploreFeedCategory from "../components/explore/ExploreFeedCategory";

const Explore = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [url, setUrl] = useState(`http://localhost:4000/api/feed/recent?`);
  const [dateCategory, setDateCategory] = useState("recent");
  const [rangeTime, setRangeTime] = useState<number[]>([0, 23]);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetailDone, setIsDetailDone] = useState(false);

  const value = useMemo(() => {
    return moment(changeValue).format("YYYYMMDD");
  }, [changeValue]);

  useEffect(() => {
    // 최신
    if (selectCategory === 0) {
      return setUrl("http://localhost:4000/api/feed/recent?");
    }

    // 인기
    if (selectCategory === 1) {
      return setUrl("http://localhost:4000/api/feed/popular?");
    }

    // 시간별
    if (selectCategory === 2) {
      if (isDetailDone) {
        return setUrl(
          `http://localhost:4000/api/feed/date?value=${value}&min=${rangeTime[0]}&max=${rangeTime[1]}&cat=${dateCategory}&`
        );
      }
    }
  }, [
    changeValue,
    dateCategory,
    isDetailDone,
    rangeTime,
    selectCategory,
    value,
  ]);

  const onSelectCategory2 = () => {
    setSelectCategory(2);
    setIsDetailDone(false);
    setIsDetailModal(true);
  };

  const onReset = () => {
    setRangeTime([1, 24]);
    setChangeValue(new Date());
  };

  const onDone = () => {
    setIsDetailDone(true);
    setIsDetailModal(false);
  };

  const onModalClose = () => {
    setIsDetailModal((prev) => !prev);
    if (url.includes("recent")) {
      setSelectCategory(0);
    }
    if (url.includes("popular")) {
      setSelectCategory(1);
    }
  };

  return (
    <Container>
      <SelectTimeBox select={selectCategory}>
        <SelectCategory>
          <SelectCurrentTime
            to="recent"
            onClick={() => setSelectCategory(0)}
            select={selectCategory}
            num={0}
          >
            최신
          </SelectCurrentTime>
          <SelectCurrentTime
            to="popular"
            onClick={() => setSelectCategory(1)}
            select={selectCategory}
            num={1}
          >
            인기
          </SelectCurrentTime>
          <SelectCurrentTime
            to="date"
            onClick={onSelectCategory2}
            select={selectCategory}
            num={2}
          >
            시간별
          </SelectCurrentTime>
        </SelectCategory>

        {selectCategory === 2 && isDetailModal && (
          <RangeTimeModal
            modalOpen={isDetailModal}
            modalClose={onModalClose}
            rangeTime={rangeTime}
            setRangeTime={setRangeTime}
            changeValue={changeValue}
            setChangeValue={setChangeValue}
            onReset={onReset}
            onDone={onDone}
          />
        )}
      </SelectTimeBox>

      {isDetailDone && selectCategory === 2 && (
        <SelectDetailTimeBox>
          <SelectCategoryBox>
            <SelectCategoryBtn
              select={dateCategory}
              category={"recent"}
              type="button"
              onClick={() => setDateCategory("recent")}
            >
              최신순
            </SelectCategoryBtn>
            <SelectCategoryBtn
              select={dateCategory}
              category={"popular"}
              type="button"
              onClick={() => setDateCategory("popular")}
            >
              인기순
            </SelectCategoryBtn>
          </SelectCategoryBox>
          <SelectDetailTime>
            {moment(changeValue).format("YYYY년 MM월 DD일")} &nbsp;
            {rangeTime[0] < 10 ? "0" + rangeTime[0] : rangeTime[0]} ~{" "}
            {rangeTime[1] < 10 ? "0" + rangeTime[1] : rangeTime[1]}시
          </SelectDetailTime>
        </SelectDetailTimeBox>
      )}

      <Routes>
        <Route path="recent" element={<ExploreFeedCategory url={url} />} />
        <Route path="popular" element={<ExploreFeedCategory url={url} />} />
        <Route path="date" element={<ExploreFeedCategory url={url} />} />
      </Routes>
    </Container>
  );
};
export default Explore;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.main`
  height: 100%;
  /* padding: 20px; */
  position: relative;
  border-top: 2px solid ${secondColor};
`;

const SelectTimeBox = styled.nav<{ select: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const SelectDetailTimeBox = styled.div`
  width: 100%;
  padding: 0 10px;
  margin-bottom: 10px;
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

const SelectCategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 12px;
  margin-bottom: 10px;
`;

const SelectCategoryBtn = styled.button<{ select: string; category: string }>`
  padding: 0;
  transition: all 0.15s linear;
  font-size: 14px;
  font-weight: ${(props) =>
    props.select === props.category ? "bold" : "normal"};
  cursor: pointer;
`;

const SelectDetailTime = styled.p`
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: end;
  color: ${thirdColor};
  padding-top: 10px;
  border-top: 1px solid ${fourthColor};
`;

const SelectCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const SelectCurrentTime = styled(Link)<{ select: number; num: number }>`
  border-radius: 9999px;
  color: ${(props) => (props.num === props.select ? "#fff" : `${thirdColor}`)};
  background: ${(props) =>
    props.num === props.select ? "#ff5673" : "transparent"};
  border: 2px solid
    ${(props) => (props.num === props.select ? "#ff5673" : "tranparent")};
  padding: 6px 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;
