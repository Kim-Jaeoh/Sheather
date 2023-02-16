import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
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
  const [myInfo, setMyInfo] = useState(null);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  const [select, setSelect] = useState(false);

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
          displayName: "",
          description: "",
          follower: [],
          following: [],
        })
      );
      window.location.reload();
    }
  };

  // 본인 정보 가져오기
  useEffect(() => {
    if (userLogin) {
      onSnapshot(doc(dbService, "users", userObj?.email), (doc) =>
        setMyInfo(doc.data())
      );
    }
  }, [userLogin, userObj]);

  return (
    <Container>
      <MenuBox pathname={pathname}>
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
            <MenuText>날씨</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink to="/message">
          <MenuList>
            <BsChatDots />
            <MenuText>메세지</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink to="/explore">
          <MenuList>
            <FiSearch />
            <MenuText>탐색</MenuText>
          </MenuList>
        </MenuLink>
        <MenuLink to="/profile">
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
        <div>{myInfo && myInfo.displayName}</div>
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

  /* 호버할 때 */
  a:nth-of-type(1):hover li:hover,
  a:nth-of-type(1):focus li:focus {
    border: 2px solid #222222;
    box-shadow: 0px 6px 0 -2px #ff5673, 0px 6px #222222;
  }

  a:nth-of-type(2):hover li:hover,
  a:nth-of-type(2):focus li:focus {
    border: 2px solid #222222;
    box-shadow: 0px 6px 0 -2px #48a3ff, 0px 6px #222222;
  }

  a:nth-of-type(3):hover li:hover,
  a:nth-of-type(3):focus li:focus {
    border: 2px solid #222222;
    box-shadow: 0px 6px 0 -2px #ff5c1b, 0px 6px #222222;
  }

  a:nth-of-type(4):hover li:hover,
  a:nth-of-type(4):focus li:focus {
    border: 2px solid #222222;
    box-shadow: 0px 6px 0 -2px #30c56e, 0px 6px #222222;
  }

  a:nth-of-type(5):hover li:hover,
  a:nth-of-type(5):focus li:focus {
    border: 2px solid #222222;
    box-shadow: 0px 6px 0 -2px #6f4ccf, 0px 6px #222222;
  }

  /* 메뉴 클릭 했을 때 */

  a:nth-of-type(1) li {
    font-weight: ${(props) =>
      props.pathname === ("/" || "/detail") ? "bold" : "normal"};
    border: ${(props) =>
      props.pathname === ("/" || "/detail")
        ? "2px solid #222222"
        : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.pathname === ("/" || "/detail")
        ? "0px 6px 0 -2px #ff5673, 0px 6px #222"
        : "0"};
  }
  a:nth-of-type(2) li {
    font-weight: ${(props) =>
      props.pathname === "/weather" ? "bold" : "normal"};
    border: ${(props) =>
      props.pathname === "/weather"
        ? "2px solid #222222"
        : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.pathname === "/weather"
        ? "0px 6px 0 -2px #48a3ff, 0px 6px #222"
        : "0"};
  }
  a:nth-of-type(3) li {
    font-weight: ${(props) =>
      props.pathname === "/message" ? "bold" : "normal"};
    border: ${(props) =>
      props.pathname === "/message"
        ? "2px solid #222222"
        : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.pathname === "/message"
        ? "0px 6px 0 -2px #ff5c1b, 0px 6px #222"
        : "0"};
  }
  a:nth-of-type(4) li {
    font-weight: ${(props) =>
      props.pathname === "/explore" ? "bold" : "normal"};
    border: ${(props) =>
      props.pathname === "/explore"
        ? "2px solid #222222"
        : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.pathname === "/explore"
        ? "0px 6px 0 -2px #30c56e, 0px 6px #222"
        : "0"};
  }
  a:nth-of-type(5) li {
    font-weight: ${(props) =>
      props.pathname === "/profile" ? "bold" : "normal"};
    border: ${(props) =>
      props.pathname === "/profile"
        ? "2px solid #222222"
        : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.pathname === "/profile"
        ? "0px 6px 0 -2px #6f4ccf, 0px 6px #222"
        : "0"};
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
`;

const MenuText = styled.h2`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px; // 폰트 교체로 인해 여백 제거
  margin-left: 20px;
  font-size: 18px;
`;
