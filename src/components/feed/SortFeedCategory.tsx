import React, { useEffect, useMemo, useState } from "react";
import useMediaScreen from "../../hooks/useMediaScreen";
import styled from "@emotion/styled";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import RangeTimeModal from "../modal/feed/RangeTimeModal";
import moment from "moment";
import MobileFeedWeatherInfo from "./MobileFeedWeatherInfo";
import MobileFeedCategoryModal from "../modal/feed/MobileFeedCategoryModal";
import { RiListSettingsFill } from "react-icons/ri";
import FeedWeatherInfo from "./FeedWeatherInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IoMdClose } from "react-icons/io";

type Props = {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
};

const SortFeedCategory = ({ url, setUrl }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [selectCategory, setSelectCategory] = useState(null);
  const [dateCategory, setDateCategory] = useState(null);
  const [isDate, setIsDate] = useState(false);
  const [rangeTime, setRangeTime] = useState<number[]>([0, 23]);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetailDone, setIsDetailDone] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isMobile } = useMediaScreen();

  // 팔로잉 목록 담기
  const followArr = useMemo(() => {
    let arr: string[] = [];
    userObj.following.forEach((res) => arr.push(res.displayName));
    return arr;
  }, [userObj.following]);

  useEffect(() => {
    // 팔로잉
    if (pathname.includes("following")) {
      setCategoryModal(false); // 모바일 카테고리 모달
      if (pathname.includes("recent")) {
        // 최신순
        navigate("following/recent");
        return setUrl(
          `${process.env.REACT_APP_SERVER_PORT}/api/feed/following/recent?users=${followArr}&`
        );
      } else {
        // 인기순
        navigate("following/popular");
        return setUrl(
          `${process.env.REACT_APP_SERVER_PORT}/api/feed/following/popular?users=${followArr}&`
        );
      }
    }

    // 탐색
    if (pathname.includes("explore")) {
      setCategoryModal(false); // 모바일 카테고리 모달
      if (pathname.includes("recent")) {
        // 최신순
        navigate("explore/recent");
        return setUrl(`${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`);
      } else {
        // 인기순
        navigate("explore/popular");
        return setUrl(`${process.env.REACT_APP_SERVER_PORT}/api/feed/popular?`);
      }
    }
  }, [dateCategory, followArr, navigate, pathname, setUrl]);

  useEffect(() => {
    // 날짜별
    if (isDate) {
      if (isDetailDone) {
        setCategoryModal(false); // 모바일 카테고리 모달
        const value = moment(changeValue).format("YYYYMMDD"); // 날짜 형식
        if (pathname.split("/")[2] === "following") {
          // 팔로잉
          navigate(
            `following?value=${value}&min=${rangeTime[0]}&max=${rangeTime[1]}&cat=${dateCategory}`
          );
          return setUrl(
            `${process.env.REACT_APP_SERVER_PORT}/api/feed/following/date?users=${followArr}&value=${value}&min=${rangeTime[0]}&max=${rangeTime[1]}&cat=${dateCategory}&`
          );
        } else {
          // 탐색
          navigate(
            `explore?value=${value}&min=${rangeTime[0]}&max=${rangeTime[1]}&cat=${dateCategory}`
          );
          return setUrl(
            `${process.env.REACT_APP_SERVER_PORT}/api/feed/date?value=${value}&min=${rangeTime[0]}&max=${rangeTime[1]}&cat=${dateCategory}&`
          );
        }
      }
    }
  }, [
    changeValue,
    dateCategory,
    followArr,
    isDate,
    isDetailDone,
    navigate,
    pathname,
    rangeTime,
    setUrl,
  ]);

  // 메인 카테고리
  useEffect(() => {
    const pathValue = (type: string) => pathname.includes(type);
    if (pathValue("following")) {
      return setSelectCategory(0);
    }
    if (pathValue("explore")) {
      return setSelectCategory(1);
    }
  }, [pathname]);

  // 서브 카테고리
  useEffect(() => {
    const pathValue = (type: string) => pathname.includes(type);
    if (pathValue("recent")) {
      return setDateCategory("recent");
    }
    if (pathValue("popular")) {
      return setDateCategory("popular");
    }
  }, [pathname]);

  // 세부 카테고리
  useEffect(() => {
    const searchValue = (type: string) => searchParams.get(type);
    if (searchValue("cat") === `recent`) {
      return setDateCategory("recent");
    }
    if (searchValue("cat") === "popular") {
      return setDateCategory("popular");
    }
  }, [searchParams]);

  // 메인 카테고리
  const onSelectCategory = (e: number) => {
    setSelectCategory(e);
    setDateCategory(`recent`);
    setIsDate(false);
    setIsDetailDone(false);
    setIsDetailModal(false);
  };

  // 서브 카테고리
  const onDateCategory = (type: string) => {
    setDateCategory(type);
    navigate(`${pathname.split("/")[2]}/${type}`);
  };

  // 날짜별 클릭
  const onSelectCategory2 = () => {
    setIsDate(true);
    setIsDetailModal(true);
    setIsDetailDone(false);
  };

  // 초기화
  const onReset = () => {
    setRangeTime([0, 23]);
    setChangeValue(new Date());
  };

  // 날짜 설정
  const onDone = () => {
    setIsDetailDone(true);
    setIsDetailModal(false);
  };

  // 날짜 선택 모달
  const onDetailModal = () => {
    setIsDetailModal((prev) => !prev);
    setIsDate(false);
  };

  const onDatePrev = () => {
    // 취소 시 이전 카테고리로 이동
    if (pathname.includes("following")) {
      setSelectCategory(0);
      navigate(`feed/following/${dateCategory}`);
    }
    if (pathname.includes("explore")) {
      setSelectCategory(1);
      navigate(`feed/explore/${dateCategory}`);
      // navigate(-1);
    }
    setIsDate(false);
  };

  // 모바일 버전
  const onCategoryModal = () => {
    setCategoryModal((prev) => !prev);
  };

  return (
    <>
      {isMobile && categoryModal && (
        <MobileFeedCategoryModal
          modalOpen={categoryModal}
          selectCategory={selectCategory}
          modalClose={onCategoryModal}
          onSelectCategory={onSelectCategory}
          onSelectCategory2={onSelectCategory2}
        />
      )}
      {isDate && isDetailModal && (
        <RangeTimeModal
          modalOpen={isDetailModal}
          modalClose={onDetailModal}
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
            <IconBox onClick={onCategoryModal}>
              <RiListSettingsFill />
            </IconBox>
          </InfoBox>
          {userObj?.following?.length !== 0 && (
            <SelectDetailTimeBox>
              {isDate && isDetailDone && (
                <SelectDetailTime>
                  {moment(changeValue).format("YYYY년 MM월 DD일")} &nbsp;
                  {rangeTime[0] < 10 ? "0" + rangeTime[0] : rangeTime[0]} ~{" "}
                  {rangeTime[1] < 10 ? "0" + rangeTime[1] : rangeTime[1]}시
                </SelectDetailTime>
              )}
              <SelectCategoryBox>
                <SelectCategoryBtn
                  select={dateCategory}
                  category={"recent"}
                  onClick={() => onDateCategory("recent")}
                >
                  최신순
                </SelectCategoryBtn>
                <SelectCategoryBtn
                  select={dateCategory}
                  category={"popular"}
                  onClick={() => onDateCategory("popular")}
                >
                  인기순
                </SelectCategoryBtn>
                <SelectCategoryDateBtn
                  select={isDate && isDetailDone ? "date" : null}
                  category={"date"}
                  onClick={() => onSelectCategory2()}
                >
                  날짜별
                </SelectCategoryDateBtn>
                {isDate && isDetailDone && (
                  <SelectDeleteBtn onClick={onDatePrev}>
                    <IoMdClose />
                  </SelectDeleteBtn>
                )}
              </SelectCategoryBox>
            </SelectDetailTimeBox>
          )}
        </>
      ) : (
        <>
          <FeedWeatherInfo />
          <SelectTimeBox select={selectCategory}>
            <SelectCategory>
              <SelectCategoryTextLink
                to="following/recent"
                onClick={() => onSelectCategory(0)}
                select={selectCategory}
                num={0}
              >
                <SelectCategoryText>팔로잉</SelectCategoryText>
              </SelectCategoryTextLink>
              <SelectCategoryTextLink
                to="explore/recent"
                onClick={() => onSelectCategory(1)}
                select={selectCategory}
                num={1}
              >
                <SelectCategoryText>탐색</SelectCategoryText>
              </SelectCategoryTextLink>
            </SelectCategory>

            {isDate && isDetailModal && (
              <RangeTimeModal
                modalOpen={isDetailModal}
                modalClose={onDetailModal}
                rangeTime={rangeTime}
                setRangeTime={setRangeTime}
                changeValue={changeValue}
                setChangeValue={setChangeValue}
                onReset={onReset}
                onDone={onDone}
              />
            )}

            {userObj?.following?.length !== 0 && (
              <SelectDetailTimeBox>
                {isDate && isDetailDone && (
                  <SelectDetailTime>
                    {moment(changeValue).format("YYYY년 MM월 DD일")} &nbsp;
                    {rangeTime[0] < 10
                      ? "0" + rangeTime[0]
                      : rangeTime[0]} ~{" "}
                    {rangeTime[1] < 10 ? "0" + rangeTime[1] : rangeTime[1]}시
                  </SelectDetailTime>
                )}
                <SelectCategoryBox>
                  <SelectCategoryBtn
                    select={dateCategory}
                    category={"recent"}
                    onClick={() => onDateCategory("recent")}
                  >
                    최신순
                  </SelectCategoryBtn>
                  <SelectCategoryBtn
                    select={dateCategory}
                    category={"popular"}
                    onClick={() => onDateCategory("popular")}
                  >
                    인기순
                  </SelectCategoryBtn>
                  <SelectCategoryDateBtn
                    select={isDate && isDetailDone ? "date" : null}
                    category={"date"}
                    onClick={onSelectCategory2}
                  >
                    날짜별
                  </SelectCategoryDateBtn>
                  {isDate && isDetailDone && (
                    <SelectDeleteBtn onClick={onDatePrev}>
                      <IoMdClose />
                    </SelectDeleteBtn>
                  )}
                </SelectCategoryBox>
              </SelectDetailTimeBox>
            )}
          </SelectTimeBox>
        </>
      )}
    </>
  );
};

export default SortFeedCategory;

const InfoBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  border-bottom: 1px solid var(--fourth-color);
`;

const IconBox = styled.button`
  width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  cursor: pointer;
  svg {
    color: var(--third-color);
    width: 22px;
    height: 22px;
  }
`;

const SelectTimeBox = styled.div<{ select: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 40px 0;
`;

const SelectDetailTimeBox = styled.div`
  width: 100%;
  margin: 40px 0 10px;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: end;
  border-top: 1px solid var(--second-color);

  @media (max-width: 767px) {
    margin: 0;
    border: none;
    padding: 16px;
    > div {
      width: 100%;
    }
  }
`;

const SelectCategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;

const SelectCategoryBtn = styled.button<{ select: string; category: string }>`
  padding: 0;
  margin-left: 12px;
  transition: all 0.15s linear;
  font-size: 14px;
  font-weight: ${(props) =>
    // props.select ? "bold" : "normal")};
    props.select === props.category ? "bold" : "normal"};
  cursor: pointer;
  color: var(--second-color);
  white-space: pre;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

const SelectCategoryDateBtn = styled(SelectCategoryBtn)`
  text-decoration: ${(props) => (props.select ? `underline` : `none`)};

  text-underline-position: under;
`;

const SelectDeleteBtn = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 0;
  cursor: pointer;
  svg {
    color: var(--second-color);
    /* width: 18px; */
    /* height: 18px; */
  }

  @media (max-width: 767px) {
    margin-left: 2px;
    width: 14px;
    height: 14px;
  }
`;

const SelectDetailTime = styled.p`
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: var(--second-color);
  white-space: pre;

  @media (max-width: 767px) {
    font-size: 10px;
    font-weight: 300;
    color: var(--third-color);
  }
`;

const SelectCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const SelectCategoryTextLink = styled(Link)<{ select: number; num: number }>`
  width: 78px;
  flex: 1;
  color: var(--second-color);
  background: ${(props) =>
    props.num === props.select ? "#fff" : "transparent"};
  border-radius: 9999px;
  border: ${(props) =>
    props.num === props.select ? "2px solid #222" : "1px solid #222"};
  padding: 8px 14px;
  text-align: center;
  white-space: nowrap;
  font-size: 18px;
  font-weight: ${(props) => (props.num === props.select ? "700" : "500")};
  box-shadow: ${(props) =>
    props.num === props.select &&
    `0px 4px 0 -2px var(--second-color), 0px 4px var(--second-color)
    `};

  cursor: pointer;
`;

const SelectCategoryText = styled.h2``;
