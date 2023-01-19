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
        <MenuLink to="/message">
          <MenuList>
            <BsChatDots />
            {/* <BsChatDotsFill /> */}
            <MenuText>메세지</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink to="/explore">
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
  width: 240px;
  background: #fff;
  user-select: none;
`;

const MenuBox = styled.ul`
  padding: 0 16px;
  width: 100%;
  height: 100vh;
  position: sticky;
  top: 0;
  border: 2px solid #222222;

  a:nth-of-type(1):hover li:hover {
    box-shadow: 0px 6px 0 -2px #e29be9, 0px 6px #222222;
  }

  a:nth-of-type(2):hover li:hover {
    box-shadow: 0px 6px 0 -2px #48a3ff, 0px 6px #222222;
  }

  a:nth-of-type(3):hover li:hover {
    box-shadow: 0px 6px 0 -2px #ff5c1b, 0px 6px #222222;
  }

  a:nth-of-type(4):hover li:hover {
    box-shadow: 0px 6px 0 -2px #45de5f, 0px 6px #222222;
  }
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
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    border: 2px solid #222222;
  }
`;
const MenuText = styled.h2`
  padding-left: 16px;
`;
