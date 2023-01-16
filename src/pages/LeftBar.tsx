import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsChatDots, BsChatDotsFill, BsSun, BsSunFill } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";

type Props = {};

const LeftBar = (props: Props) => {
  return (
    <Container>
      <MenuBox>
        <LogoBox>SHEATHER</LogoBox>
        <MenuLink to="/">
          <MenuList>
            <AiOutlineHome />
            <MenuText>피드</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink to="/weather">
          <MenuList>
            <BsSun />
            {/* <BsSunFill /> */}
            <MenuText>날씨</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink to="/weather">
          <MenuList>
            <BsChatDots />
            {/* <BsChatDotsFill /> */}
            <MenuText>메세지</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink to="/weather">
          <MenuList>
            <FiSearch />
            <MenuText>탐색</MenuText>
          </MenuList>
        </MenuLink>
      </MenuBox>
    </Container>
  );
};

export default LeftBar;

const Container = styled.nav`
  flex: 0 1 auto;
  max-height: 100%;
  position: relative;
  width: 280px;
  background: #fff;
  /* box-shadow: 15px 15px 0 -4px white; */
`;

const MenuBox = styled.ul`
  padding: 0 16px;
  width: 100%;
  height: 100vh;
  position: sticky;
  top: 0;
  border: 2px solid #222222;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  line-height: auto;
  width: 100%;
  height: 92px;
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
`;

const MenuLink = styled(Link)`
  flex: 0 1 auto;
  display: flex;
  align-items: center;

  svg {
    font-size: 24px;
  }
`;

const MenuList = styled.li`
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  margin: 8px 0;
  -webkit-user-select: none;
  user-select: none;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border: 2px solid #222222;

    svg {
      transition: transform 0.2s;
      transform: scale3d(1.1);
      /* transform: scale(1.1); */
    }
  }
`;
const MenuText = styled.span`
  padding-left: 16px;
`;
