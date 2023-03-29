import React, { useEffect, useMemo, useState } from "react";
import useMediaScreen from "../../hooks/useMediaScreen";
import styled from "@emotion/styled";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ColorList from "../../assets/ColorList";
import RangeTimeModal from "../modal/feed/RangeTimeModal";
import moment from "moment";
import MobileFeedWeatherInfo from "./MobileFeedWeatherInfo";
import MobileFeedCategoryModal from "../modal/feed/MobileFeedCategoryModal";
import { RiListSettingsFill } from "react-icons/ri";
import FeedWeatherInfo from "./FeedWeatherInfo";

type Props = {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
};

const SortFeedCategory = ({ url, setUrl }: Props) => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [dateCategory, setDateCategory] = useState("recent");
  const [rangeTime, setRangeTime] = useState<number[]>([0, 23]);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetailDone, setIsDetailDone] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useMediaScreen();

  const value = useMemo(() => {
    return moment(changeValue).format("YYYYMMDD");
  }, [changeValue]);

  useEffect(() => {
    // 최신
    if (selectCategory === 0) {
      setCategoryModal(false); // 모바일 카테고리 모달

      return setUrl(`${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`);
    }
    // 인기
    if (selectCategory === 1) {
      setCategoryModal(false); // 모바일 카테고리 모달

      return setUrl(`${process.env.REACT_APP_SERVER_PORT}/api/feed/popular?`);
    }
    // 시간별
    if (selectCategory === 2) {
      if (isDetailDone) {
        setCategoryModal(false); // 모바일 카테고리 모달

        navigate(
          `date?value=${value}&min=${rangeTime[0]}&max=${rangeTime[1]}&cat=${dateCategory}`
        );
        return setUrl(
          `${process.env.REACT_APP_SERVER_PORT}/api/feed/date?value=${value}&min=${rangeTime[0]}&max=${rangeTime[1]}&cat=${dateCategory}&`
        );
      }
    }
  }, [
    dateCategory,
    isDetailDone,
    navigate,
    rangeTime,
    selectCategory,
    setUrl,
    value,
  ]);

  // 메인 카테고리
  useEffect(() => {
    if (pathname.includes("recent")) {
      return setSelectCategory(0);
    }
    if (pathname.includes("popular")) {
      return setSelectCategory(1);
    }
    if (pathname.includes("date")) {
      return setSelectCategory(2);
    }
  }, [pathname, search]);

  // 세부 카테고리
  useEffect(() => {
    if (search.includes("cat=recent")) {
      return setDateCategory("recent");
    }
    if (search.includes("cat=popular")) {
      return setDateCategory("popular");
    }
  }, [search]);

  const onSelectCategory2 = () => {
    setSelectCategory(2);
    setIsDetailDone(false);
    setIsDetailModal(true);
  };

  const onReset = () => {
    setRangeTime([0, 23]);
    setChangeValue(new Date());
  };

  const onDone = () => {
    setIsDetailDone(true);
    setIsDetailModal(false);
  };

  const onModalClose = () => {
    setIsDetailModal((prev) => !prev);
    // 취소 시 이전 카테고리로 이동
    if (url.includes("recent")) {
      setSelectCategory(0);
    }
    if (url.includes("popular")) {
      setSelectCategory(1);
    }
  };

  const onCategoryModalClose = () => {
    setCategoryModal((prev) => !prev);
  };

  return (
    <>
      {categoryModal && (
        <MobileFeedCategoryModal
          modalOpen={categoryModal}
          selectCategory={selectCategory}
          modalClose={onCategoryModalClose}
          setSelectCategory={setSelectCategory}
          onSelectCategory2={onSelectCategory2}
        />
      )}
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
      {isMobile ? (
        <>
          <InfoBox>
            <MobileFeedWeatherInfo />
            <IconBox onClick={onCategoryModalClose}>
              <RiListSettingsFill />
            </IconBox>
          </InfoBox>
          {selectCategory === 2 && isDetailDone && (
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
        </>
      ) : (
        <>
          <FeedWeatherInfo />
          <SelectTimeBox select={selectCategory}>
            <SelectCategory>
              <SelectCategoryTextLink
                to="recent"
                onClick={() => setSelectCategory(0)}
                select={selectCategory}
                num={0}
              >
                <SelectCategoryText>최신</SelectCategoryText>
              </SelectCategoryTextLink>
              <SelectCategoryTextLink
                to="popular"
                onClick={() => setSelectCategory(1)}
                select={selectCategory}
                num={1}
              >
                <SelectCategoryText>인기</SelectCategoryText>
              </SelectCategoryTextLink>
              <SelectCategoryTextLink
                to="date"
                onClick={onSelectCategory2}
                select={selectCategory}
                num={2}
              >
                <SelectCategoryText>날짜별</SelectCategoryText>
              </SelectCategoryTextLink>
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
          </SelectTimeBox>
        </>
      )}
    </>
  );
};

export default SortFeedCategory;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const InfoBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
`;

const IconBox = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  svg {
    color: ${thirdColor};
    width: 24px;
    height: 24px;
  }
`;

const SelectTimeBox = styled.div<{ select: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px;
`;

const SelectDetailTimeBox = styled.div`
  width: 100%;
  margin: 20px 0;

  @media (max-width: 767px) {
    margin: 10px 0;
    padding: 0 16px 16px;
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
  color: ${secondColor};
  @media (max-width: 767px) {
    font-size: 12px;
    border-color: ${fourthColor};
  }
`;

const SelectDetailTime = styled.p`
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: end;
  color: ${secondColor};
  padding-top: 10px;
  border-top: 1px solid ${secondColor};
  @media (max-width: 767px) {
    font-size: 12px;
    border-color: ${fourthColor};
    color: ${thirdColor};
  }
`;

const SelectCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const SelectCategoryTextLink = styled(Link)<{ select: number; num: number }>`
  width: 70px;
  flex: 1;
  color: ${secondColor};
  background: ${(props) =>
    props.num === props.select ? "#fff" : "transparent"};
  border-radius: 9999px;
  border: ${(props) =>
    props.num === props.select ? "2px solid #222" : "1px solid #222"};
  padding: 8px 10px;
  text-align: center;
  white-space: nowrap;
  font-size: 18px;
  font-weight: ${(props) => (props.num === props.select ? "700" : "500")};
  box-shadow: ${(props) =>
    props.num === props.select &&
    `0px 4px 0 -2px ${secondColor}, 0px 4px ${secondColor}
    `};

  cursor: pointer;
`;

const SelectCategoryText = styled.h2``;
