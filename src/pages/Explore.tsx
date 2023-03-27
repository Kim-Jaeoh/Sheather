import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import ExploreFeedCategory from "../components/explore/ExploreFeedCategory";
import TempClothes from "../assets/TempClothes";
import Flicking from "@egjs/react-flicking";
import "../styles/DetailFlicking.css";

const categoryArray = [
  { cat: "아우터", link: "outer" },
  { cat: "상의", link: "top" },
  { cat: "내의", link: "innerTop" },
  { cat: "하의", link: "bottom" },
  { cat: "기타", link: "etc" },
];

const Explore = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [secondSelectCategory, setSecondSelectCategory] = useState(0);
  const [url, setUrl] = useState(
    `${
      process.env.REACT_APP_SERVER_PORT
    }/api/explore?cat=outer&detail=${encodeURIComponent("전체")}&`
  );
  const [detail, setDetail] = useState("전체");
  const { ClothesCategory } = TempClothes();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  // api 값 불러오기
  useEffect(() => {
    const api = `${process.env.REACT_APP_SERVER_PORT}/api/explore`;
    if (+searchParams.get("detail") === 0) {
      return setUrl(
        `${api}?cat=${
          categoryArray[selectCategory]?.link
        }&detail=${encodeURIComponent("전체")}&`
      );
    }
    return setUrl(
      `${api}?cat=${
        categoryArray[selectCategory]?.link
      }&detail=${encodeURIComponent(detail)}&`
    );
  }, [detail, searchParams, selectCategory]);

  // 뒤로, 앞으로 갈 시 이전 데이터 받아오기
  useEffect(() => {
    let cat = pathname?.split("/")[2];
    setDetail(ClothesCategory[cat][+searchParams.get("detail")]);
  }, [ClothesCategory, pathname, searchParams]);

  // 카테고리
  useEffect(() => {
    let cat = pathname?.split("/")[2];
    let number = +searchParams.get("detail");
    if (cat === "top") {
      // number += 1;
    }

    const findIndex = categoryArray.findIndex(
      (res) => res.link === pathname?.split("/")[2]
    );
    setSelectCategory(findIndex);
    setSecondSelectCategory(number);
    // 리팩토링
    // if (pathname.includes("outer")) {
    //   return setSelectCategory(0);
    // }
    // if (pathname.includes("top")) {
    //   return setSelectCategory(1);
    // }
    // if (pathname.includes("innerTop")) {
    //   return setSelectCategory(2);
    // }
    // if (pathname.includes("bottom")) {
    //   return setSelectCategory(3);
    // }
    // if (pathname.includes("etc")) {
    //   return setSelectCategory(4);
    // }
  }, [ClothesCategory, pathname, searchParams]);

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

  const onClickToUrl = (type: string, index: number) => {
    setSecondSelectCategory(index);
    setDetail(type);
  };

  const onSelectCategory = (res: number) => {
    setSelectCategory(res);
    setSecondSelectCategory(0);
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
                to={`${res.link}?detail=0`}
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
              {secondMenu?.map((res, index) => {
                return (
                  <SelectCurrentTime
                    key={index}
                    to={`?detail=${encodeURIComponent(index)}`}
                    onClick={() => {
                      onClickToUrl(res, index);
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
      </SelectTimeBox>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: #30c56e;
`;

const CategoryBox = styled.nav`
  position: sticky;
  top: 0;
  z-index: 20;
  border-top: 2px solid ${secondColor};
  border-bottom: 2px solid ${secondColor};
  box-sizing: border-box;
  background: #fff;
`;

const CategoryList = styled.ul`
  width: 100%;
  height: 60px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
`;

const Category = styled(Link)<{ select: number; num: number }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  height: 100%;
  font-weight: ${(props) => (props.num === props.select ? 700 : 500)};
  font-size: ${(props) => (props.num === props.select ? "18px" : "16px")};
  cursor: pointer;

  &:after {
    position: absolute;
    bottom: 0;
    display: block;
    width: 100%;
    height: 4px;
    content: "";
    background-color: ${(props) =>
      props.num === props.select ? secondColor : `transparent`};
  }
`;

const SelectName = styled.h2`
  position: relative;
  line-height: 20px;
`;

const SelectTimeBox = styled.nav<{ select: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  margin-bottom: 14px;
  width: 100%;
  padding: 10px 100px;
`;

const SelectCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 500px;
  position: relative;
  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #30c56e);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 40px;
    content: "";
  }
  /* gap: 10px; */
`;

const TagBox = styled.div`
  display: flex;
  align-items: center;
  flex: nowrap;
  gap: 10px;
  height: 40px;
`;

const SelectCurrentTime = styled(Link)<{ select: number; num: number }>`
  border-radius: 9999px;
  color: ${secondColor};
  /* color: ${(props) =>
    props.num === props.select ? secondColor : "#fff"}; */
  background: ${(props) =>
    props.num === props.select ? "#fff" : "transparent"};
  border: ${(props) =>
    props.num === props.select
      ? `2px solid ${secondColor}`
      : `1px solid ${secondColor}`};
  /* border: ${(props) =>
    props.num === props.select
      ? `2px solid ${secondColor}`
      : `1px solid transparent`}; */
  padding: 6px 10px;
  /* line-height: 18px; */
  font-size: 14px;
  font-weight: ${(props) => (props.num === props.select ? 700 : 500)};
  cursor: pointer;
  box-shadow: ${(props) =>
    props.num === props.select && `0 3px 0 ${secondColor}`};
`;
