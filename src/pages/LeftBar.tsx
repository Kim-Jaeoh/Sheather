import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation, useParams } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import {
  BsChatDots,
  BsChatDotsFill,
  BsPersonCircle,
  BsSun,
  BsSunFill,
} from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import AuthFormModal from "../components/modal/auth/AuthFormModal";
import { useDispatch } from "react-redux";
import { currentUser, loginToken } from "../app/user";
import { authService, dbService } from "../fbase";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";

const LeftBar = () => {
  const [select, setSelect] = useState(false);
  const [selectMenu, setSelectMenu] = useState(0);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  useEffect(() => {
    if (pathname.includes("feed")) {
      return setSelectMenu(0);
    }
    if (pathname.includes("weather")) {
      return setSelectMenu(1);
    }
    if (pathname.includes("message")) {
      return setSelectMenu(2);
    }
    if (pathname.includes("explore")) {
      return setSelectMenu(3);
    }
    if (pathname.includes("profile")) {
      return setSelectMenu(4);
    }
  }, [pathname]);

  const menu = useMemo(() => {
    switch (selectMenu) {
      case 0:
        return "feed";
      case 1:
        return "weather";
      case 2:
        return "message";
      case 3:
        return "explore";
      case 4:
        return "profile";
      default:
        return "feed";
    }
  }, [selectMenu]);

  const onClick = () => {
    setSelect((prev) => !prev);
  };

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃 하시겠어요?");
    if (ok) {
      authService.signOut();
      dispatch(loginToken(false));
      dispatch(
        currentUser({
          uid: "",
          createdAt: "",
          profileURL: "",
          email: "",
          name: "",
          displayName: "",
          description: "",
          follower: [],
          following: [],
        })
      );
      window.location.reload();
    }
  };

  return (
    <Container>
      <MenuBox pathname={pathname}>
        <LogoBox>SHEATHER</LogoBox>
        <MenuLink
          menu={menu}
          cat="feed"
          onClick={() => setSelectMenu(0)}
          color="#ff5673"
          to="/feed/recent"
        >
          <MenuList>
            <AiOutlineHome />
            <MenuText>피드</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink
          menu={menu}
          cat="weather"
          onClick={() => setSelectMenu(1)}
          color="#48a3ff"
          to="/weather"
        >
          <MenuList>
            <BsSun />
            <MenuText>날씨</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink
          menu={menu}
          cat="message"
          onClick={() => setSelectMenu(2)}
          color="#ff5c1b"
          to="/message"
        >
          <MenuList>
            <BsChatDots />
            <MenuText>메세지</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink
          menu={menu}
          cat="explore"
          onClick={() => setSelectMenu(3)}
          color="#30c56e"
          to="/explore/outer"
        >
          <MenuList>
            <FiSearch />
            <MenuText>탐색</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink
          menu={menu}
          cat="profile"
          onClick={() => {
            !userLogin && onClick();
            setSelectMenu(4);
          }}
          color="#6f4ccf"
          to={userLogin && `/profile/${userObj?.displayName}/post`}
          state={userObj.displayName}
        >
          <MenuList>
            <BsPersonCircle />
            <MenuText>프로필</MenuText>
          </MenuList>
        </MenuLink>
        <div onClick={onClick}>
          <MenuList>
            <FiSearch />
            <MenuText>로그인</MenuText>
          </MenuList>
        </div>
        <div onClick={onLogOutClick}>
          <MenuList>
            <FiSearch />
            <MenuText>로그아웃</MenuText>
          </MenuList>
        </div>
        <div>{userObj && userObj.displayName}</div>
        {select && <AuthFormModal modalOpen={select} modalClose={onClick} />}
      </MenuBox>
    </Container>
  );
};

export default LeftBar;

const Container = styled.nav`
  flex: 0 1 auto;
  max-height: 100%;
  position: relative;
  width: 250px;
  background: #fff;
  user-select: none;
`;

const MenuBox = styled.ul<{ pathname: string }>`
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

const MenuLink = styled(Link)<{ cat: string; menu: string; color: string }>`
  display: flex;
  align-items: center;

  svg {
    font-size: 24px;
  }

  li {
    font-weight: ${(props) => (props.cat === props.menu ? "bold" : "normal")};
    border: ${(props) =>
      props.cat === props.menu ? "2px solid #222222" : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.cat === props.menu
        ? `0px 6px 0 -2px ${props.color}, 0px 6px #222`
        : "0"};
  }
  &:hover li:hover,
  &:active li:active {
    border: 2px solid #222222;
    box-shadow: 0px 6px 0 -2px ${(props) => props.color}, 0px 6px #222222;
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
  transition: all 0.15s linear;
`;

const MenuText = styled.h2`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px; // 폰트 교체로 인해 여백 제거
  margin-left: 20px;
  font-size: 18px;
`;
