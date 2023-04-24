import React, { useEffect, useMemo, useState } from "react";
import useMediaScreen from "../../hooks/useMediaScreen";
import styled from "@emotion/styled";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import ColorList from "../../assets/data/ColorList";
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
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [selectCategory, setSelectCategory] = useState(0);
  const [isDate, setIsDate] = useState(false);
  const [dateCategory, setDateCategory] = useState("recent");
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
    if (selectCategory === 0) {
      setCategoryModal(false); // 모바일 카테고리 모달
      if (dateCategory === "recent") {
        // 최신순
        return setUrl(
          `${process.env.REACT_APP_SERVER_PORT}/api/feed/following/recent?users=${followArr}&`
        );
      } else {
        // 인기순
        return setUrl(
          `${process.env.REACT_APP_SERVER_PORT}/api/feed/following/popular?users=${followArr}&`
        );
      }
    }

    // 탐색
    if (selectCategory === 1) {
      setCategoryModal(false); // 모바일 카테고리 모달
      if (dateCategory === "recent") {
        // 최신순
        return setUrl(`${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`);
      } else {
        // 인기순
        return setUrl(`${process.env.REACT_APP_SERVER_PORT}/api/feed/popular?`);
      }
    }
  }, [dateCategory, followArr, selectCategory, setUrl]);

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
    if (pathValue("date")) {
      return setSelectCategory(2);
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

  // 서브-날짜별 클릭
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
    // 취소 시 이전 카테고리로 이동
    if (url.includes("following")) {
      setSelectCategory(0);
    }
    if (url.includes("explore")) {
      setSelectCategory(1);
    }
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
          setSelectCategory={setSelectCategory}
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
          <SelectDetailTimeBox>
            {userObj?.displayName ||
              (userObj?.following?.length !== 0 && (
                <>
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
                    <SelectCategoryDateBtn
                      select={isDate && isDetailDone ? "date" : null}
                      category={"date"}
                      type="button"
                      onClick={() => onSelectCategory2()}
                    >
                      날짜별
                    </SelectCategoryDateBtn>
                    {isDate && isDetailDone && (
                      <SelectDeleteBtn onClick={() => setIsDate(false)}>
                        <IoMdClose />
                      </SelectDeleteBtn>
                    )}
                  </SelectCategoryBox>
                </>
              ))}
          </SelectDetailTimeBox>
        </>
      ) : (
        <>
          <FeedWeatherInfo />
          <SelectTimeBox select={selectCategory}>
            <SelectCategory>
              <SelectCategoryTextLink
                to="following"
                onClick={() => onSelectCategory(0)}
                select={selectCategory}
                num={0}
              >
                <SelectCategoryText>팔로잉</SelectCategoryText>
              </SelectCategoryTextLink>
              <SelectCategoryTextLink
                to="explore"
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

            <SelectDetailTimeBox>
              {userObj?.displayName ||
                (userObj?.following?.length !== 0 && (
                  <>
                    {isDate && isDetailDone && (
                      <SelectDetailTime>
                        {moment(changeValue).format("YYYY년 MM월 DD일")} &nbsp;
                        {rangeTime[0] < 10
                          ? "0" + rangeTime[0]
                          : rangeTime[0]}{" "}
                        ~{" "}
                        {rangeTime[1] < 10 ? "0" + rangeTime[1] : rangeTime[1]}
                        시
                      </SelectDetailTime>
                    )}
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
                      <SelectCategoryDateBtn
                        select={isDate && isDetailDone ? "date" : null}
                        category={"date"}
                        type="button"
                        onClick={() => onSelectCategory2()}
                      >
                        날짜별
                      </SelectCategoryDateBtn>
                      {isDate && isDetailDone && (
                        <SelectDeleteBtn onClick={() => setIsDate(false)}>
                          <IoMdClose />
                        </SelectDeleteBtn>
                      )}
                    </SelectCategoryBox>
                  </>
                ))}
            </SelectDetailTimeBox>
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
  margin-bottom: 16px;
  /* padding: 20px 16px; */
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
  border-top: 1px solid ${secondColor};

  @media (max-width: 767px) {
    margin: 0;
    padding: 0;
    border: none;
    /* padding: 0px 16px; */
    padding: 0;
    > div {
      border-top: 1px solid ${fourthColor};
      padding: 16px 0;
      width: 100%;
    }
  }
`;

const SelectCategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  /* gap: 12px; */
`;

const SelectCategoryBtn = styled.button<{ select: string; category: string }>`
  padding: 0;
  margin-left: 12px;
  transition: all 0.15s linear;
  font-size: 14px;
  font-weight: ${(props) =>
    props.select === props.category ? "bold" : "normal"};
  cursor: pointer;
  color: ${secondColor};
  white-space: pre;
  @media (max-width: 767px) {
    font-size: 12px;
    /* border-color: ${fourthColor}; */
  }
`;

const SelectCategoryDateBtn = styled(SelectCategoryBtn)`
  text-decoration: ${(props) =>
    props.select === props.category ? `underline` : `none`};
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
    color: ${secondColor};
    width: 18px;
    height: 18px;
  }
`;

const SelectDetailTime = styled.p`
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: ${secondColor};
  white-space: pre;

  @media (max-width: 767px) {
    font-size: 12px;
    font-weight: 300;
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
  width: 78px;
  flex: 1;
  color: ${secondColor};
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
    `0px 4px 0 -2px ${secondColor}, 0px 4px ${secondColor}
    `};

  cursor: pointer;
`;

const SelectCategoryText = styled.h2``;
