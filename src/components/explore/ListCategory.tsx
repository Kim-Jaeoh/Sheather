import React, { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { Link } from "react-router-dom";

type Props = {};

const ListCategory = (props: Props) => {
  const [selectCategory, setSelectCategory] = useState(0);
  const onSelectCategory = (res: number) => {
    setSelectCategory(res);
  };

  return (
    <Container>
      <CategoryBox>
        <CategoryList>
          <Category
            onClick={() => onSelectCategory(0)}
            select={selectCategory}
            num={0}
            to={`/explore/tag`}
            // to={`${res.link}?detail=0`}
          >
            <SelectName>태그</SelectName>
          </Category>
        </CategoryList>
      </CategoryBox>
    </Container>
  );
};

export default ListCategory;

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
  /* color: ${(props) => props.num !== props.select && thirdColor}; */
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

const SelectName = styled.span`
  position: relative;
  line-height: 20px;
`;
