import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import RangeTimeModal from "../components/modal/feed/RangeTimeModal";
import FeedCategory from "../components/feed/FeedCategory";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ExploreFeedCategory from "../components/explore/ExploreFeedCategory";
import TempClothes from "../assets/TempClothes";
import Flicking from "@egjs/react-flicking";
import "../styles/DetailFlicking.css";

const Explore = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [secondSelectCategory, setSecondSelectCategory] = useState(0);
  const [url, setUrl] = useState(
    `http://localhost:4000/api/explore?cat=outer&detail=${encodeURIComponent(
      "전체"
    )}&`
  );
  const [detail, setDetail] = useState("전체");
  const [dateCategory, setDateCategory] = useState("recent");
  const [rangeTime, setRangeTime] = useState<number[]>([0, 23]);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetailDone, setIsDetailDone] = useState(false);
  const { ClothesCategory } = TempClothes();

  const categoryArray = [
    { cat: "아우터", link: "outer" },
    { cat: "상의", link: "top" },
    { cat: "내의", link: "innerTop" },
    { cat: "하의", link: "bottom" },
    { cat: "기타", link: "etc" },
  ];

  useEffect(() => {
    const api = "http://localhost:4000/api/explore";
    if (secondSelectCategory === 0) {
      return setUrl(
        `${api}?cat=${
          categoryArray[selectCategory].link
        }&detail=${encodeURIComponent("전체")}&`
      );
    }
    return setUrl(
      `${api}?cat=${
        categoryArray[selectCategory].link
      }&detail=${encodeURIComponent(detail)}&`
    );
  }, [detail, selectCategory]);

  // 세부 카테고리에 '전체' 태그 추가
  const secondMenu = useMemo(() => {
    const categories = [
      ClothesCategory.outer,
      ClothesCategory.top,
      ClothesCategory.innerTop,
      ClothesCategory.bottom,
      ClothesCategory.etc,
    ];

    const filteredCategories = categories.map((category) => {
      return ["전체", ...category.filter((item) => item !== "없음")];
    });

    return filteredCategories[selectCategory];
  }, [
    ClothesCategory.bottom,
    ClothesCategory.etc,
    ClothesCategory.innerTop,
    ClothesCategory.outer,
    ClothesCategory.top,
    selectCategory,
  ]);

  const onClickToUrl = (type: string) => {
    setDetail(type);
  };

  const onSelectCategory = (res: number) => {
    setSelectCategory(res);
    setSecondSelectCategory(0);
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
    if (url.includes("outer")) {
      setSelectCategory(0);
    }
    if (url.includes("popular")) {
      setSelectCategory(1);
    }
  };

  return (
    <Container>
      <CategoryBox>
        <CategoryList>
          {categoryArray.map((res, index) => {
            return (
              <Category
                onClick={() => onSelectCategory(index)}
                select={selectCategory}
                num={index}
                key={res.cat}
                to={`${res.link}`}
              >
                <SelectName>{res.cat}</SelectName>
              </Category>
            );
          })}
        </CategoryList>
      </CategoryBox>

      <SelectTimeBox select={selectCategory}>
        <SelectCategory>
          <Flicking
            onChanged={(e) => console.log(e)}
            moveType="freeScroll"
            bound={true}
            align="prev"
          >
            <TagBox>
              {secondMenu.map((res, index) => {
                return (
                  <SelectCurrentTime
                    key={index}
                    to={`?cat=${
                      categoryArray[selectCategory].link
                    }&detail=${encodeURIComponent(index)}`}
                    onClick={() => {
                      setSecondSelectCategory(index);
                      onClickToUrl(res);
                    }}
                    select={secondSelectCategory}
                    num={index}
                  >
                    {res}
                  </SelectCurrentTime>
                );
              })}
            </TagBox>
          </Flicking>
        </SelectCategory>

        {/* {selectCategory === 2 && isDetailModal && (
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
        )} */}
      </SelectTimeBox>

      {/* {isDetailDone && selectCategory === 2 && (
        <SelectDetailTimeBox>
          <SelectCategoryBox>
            <SelectCategoryBtn
              select={dateCategory}
              category={"outer"}
              type="button"
              onClick={() => setDateCategory("outer")}
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
      )} */}

      <Routes>
        {categoryArray.map((res, index) => {
          return (
            <Route
              key={index}
              path={res.link}
              element={<ExploreFeedCategory url={url} />}
            />
          );
        })}
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

const CategoryBox = styled.nav`
  margin-top: 20px;
  border-bottom: 1px solid ${thirdColor};
  box-sizing: border-box;
`;

const CategoryList = styled.ul`
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  /* display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  gap: 40px;
  margin-top: 20px;
  overflow-x: auto;
  overflow-y: hidden; */
  /* border-bottom: 1px solid ${thirdColor}; */
`;

const Category = styled(Link)<{ select: number; num: number }>`
  flex: 0 0 auto;
  /* display: inline-flex;
  height: 44px;
  font-size: 16px;
  position: relative;
  padding-top: 15px;
  padding-bottom: 6px;
  color: #222;
  cursor: pointer;
  border-bottom: 2px solid #222; */
  margin: 0;
  padding: 16px 0 6px;
  height: 44px;
  font-weight: ${(props) => props.num === props.select && "bold"};
  color: ${(props) => props.num !== props.select && thirdColor};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  border-bottom: ${(props) =>
    props.num === props.select
      ? `2px solid ${secondColor}`
      : "2px solid transparent"};
`;

const SelectName = styled.span`
  position: relative;
  line-height: 20px;
  background-color: #fff;
`;

const SelectTimeBox = styled.nav<{ select: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 16px;
  margin-bottom: 14px;
  padding: 0 100px;
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
  min-width: 500px;
  position: relative;
  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  }
  /* gap: 10px; */
`;

const TagBox = styled.div`
  display: flex;
  align-items: center;
  flex: nowrap;
  gap: 8px;
`;

const SelectCurrentTime = styled(Link)<{ select: number; num: number }>`
  border-radius: 9999px;
  color: ${(props) => (props.num === props.select ? "#fff" : `${thirdColor}`)};
  background: ${(props) =>
    props.num === props.select ? "#ff5673" : "transparent"};
  border: ${(props) =>
    props.num === props.select
      ? "2px solid #ff5673"
      : `1px solid ${fourthColor}`};
  padding: 6px 10px;
  /* line-height: 18px; */
  font-size: 14px;
  font-weight: ${(props) => props.num === props.select && "bold"};
  cursor: pointer;
  /* padding: 7px 16px;
  font-size: 14px;
  letter-spacing: -0.21px;
  line-height: 17px;
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background: ${(props) =>
    props.num === props.select ? "#ff5673" : "transparent"};
  color: ${(props) => (props.num === props.select ? "#fff" : `${thirdColor}`)};
  border: 1px solid #f0f0f0;
  border-radius: 30px;
  cursor: pointer; */
`;
