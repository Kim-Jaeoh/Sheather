import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import defaultAccount from "../assets/account_img_default.png";
import ColorList from "../assets/ColorList";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FeedType } from "../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import useToggleLike from "../hooks/useToggleLike";
import useToggleBookmark from "../hooks/useToggleBookmark";
import moment from "moment";
import RangeTimeModal from "../components/modal/feed/RangeTimeModal";
import HomeSkeleton from "../assets/skeleton/HomeSkeleton";
import FeedCategory from "../components/modal/feed/FeedCategory";

const Home = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [feed, setFeed] = useState(null);
  const [rangeTime, setRangeTime] = useState<number[]>([1, 24]);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetailDone, setIsDetailDone] = useState(false);

  const feedApi = async () => {
    const { data } = await axios.get("http://localhost:4000/api/feed");
    return data;
  };

  // 피드 리스트 가져오기
  const { data: feedData, isLoading } = useQuery<FeedType[]>(
    ["feed"],
    feedApi,
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
    }
  );

  useEffect(() => {
    const date = (time: number) => new Date(time);

    // 최신
    if (selectCategory === 0) {
      return setFeed(
        feedData
          ?.filter((res) => res.createdAt)
          .sort((a, b) => a.createdAt - b.createdAt)
      );
    }

    // 인기
    if (selectCategory === 1) {
      return setFeed(feedData.sort((a, b) => b.like.length - a.like.length));
    }

    // 시간별
    if (selectCategory === 2) {
      if (isDetailDone) {
        // 1). 글 작성 날짜와 캘린더 날짜 비교
        const dayFilter = feedData.filter(
          (res) =>
            moment(res?.createdAt).format("YYYY-MM-DD") ===
            moment(changeValue).format("YYYY-MM-DD")
        );
        // 1)의 값에 시간 지정
        return setFeed(
          dayFilter
            .filter((res) => {
              const hour = date(res.createdAt).getHours();
              return hour >= rangeTime[0] && hour < rangeTime[1];
            })
            .sort((a, b) => a.like.length - b.like.length)
        );
      }
    }
  }, [selectCategory, feedData, isDetailDone, rangeTime, changeValue]);

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
  };

  return (
    <>
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
            <SelectDetailTime>
              {moment(changeValue).format("YYYY년 MM월 DD일")} &nbsp;
              {rangeTime[0] < 10 ? "0" + rangeTime[0] : rangeTime[0]} ~{" "}
              {rangeTime[1] < 10 ? "0" + rangeTime[1] : rangeTime[1]}시
            </SelectDetailTime>
          </SelectDetailTimeBox>
        )}

        {!isLoading && feed ? (
          <CardBox feedLength={feed?.length}>
            <Routes>
              <Route path="recent" element={<FeedCategory feed={feed} />} />
              <Route path="popular" element={<FeedCategory feed={feed} />} />
              <Route path="date" element={<FeedCategory feed={feed} />} />
            </Routes>
          </CardBox>
        ) : (
          <HomeSkeleton />
        )}

        {feed && feed.length < 1 && (
          <NotInfoBox>
            <NotInfo>해당 날짜의 글이 존재하지 않습니다.</NotInfo>
          </NotInfoBox>
        )}
      </Container>
    </>
  );
};
export default React.memo(Home);

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.main`
  height: 100%;
  padding: 20px 10px 10px;
  position: relative;
`;

const SelectTimeBox = styled.nav<{ select: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 20px;
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

const CardBox = styled.ul<{ feedLength?: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
`;

const NotInfoBox = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotInfo = styled.div``;
