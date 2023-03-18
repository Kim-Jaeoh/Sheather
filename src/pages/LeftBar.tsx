import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import {
  BsChatDots,
  BsChatDotsFill,
  BsPersonCircle,
  BsSun,
  BsSunFill,
} from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import AuthFormModal from "../components/modal/auth/AuthFormModal";
import { useDispatch } from "react-redux";
import { currentUser, loginToken } from "../app/user";
import { authService, dbService } from "../fbase";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse, AxiosError } from "axios";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { WeatherDataType } from "../types/type";
import ShareWeatherModal from "../components/modal/shareWeather/ShareWeatherModal";
import { shareWeather } from "../app/getWeather";

const LeftBar = () => {
  const [isAuthModal, setIsAuthModal] = useState(false);
  const [selectMenu, setSelectMenu] = useState(0);
  const [shareBtn, setShareBtn] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const { onLogOutClick } = useLogout();
  const { location } = useCurrentLocation();

  const nowWeatherApi = async () =>
    await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`
    );

  // 현재 날씨 정보 가져오기
  const { data: weatherData } = useQuery<
    AxiosResponse<WeatherDataType>,
    AxiosError
  >(["Weather", location], nowWeatherApi, {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

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
      return setSelectMenu(5);
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
        return "write";
      case 5:
        return "profile";
      default:
        return "feed";
    }
  }, [selectMenu]);

  const onWriteClick = () => {
    if (userLogin) {
      setShareBtn((prev) => !prev);
      setSelectMenu(4);
      dispatch(shareWeather(weatherData?.data));
    } else {
      setIsAuthModal((prev) => !prev);
    }
  };

  const onProfileClick = () => {
    if (!userLogin) {
      setIsAuthModal((prev) => !prev);
    } else {
      navigate(`/profile/${userObj?.displayName}/post`, {
        state: userObj?.displayName,
      });
      setSelectMenu(5);
    }
  };

  return (
    <>
      {shareBtn && (
        <ShareWeatherModal shareBtn={shareBtn} setShareBtn={setShareBtn} />
      )}
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
            to="/explore"
          >
            <MenuList>
              <FiSearch />
              <MenuText>탐색</MenuText>
            </MenuList>
          </MenuLink>
          <MenuBtn
            menu={menu}
            cat="write"
            color="#ffe448"
            onClick={onWriteClick}
          >
            <MenuList>
              <FiPlusCircle />
              <MenuText>글쓰기</MenuText>
            </MenuList>
          </MenuBtn>
          <MenuBtn
            menu={menu}
            cat="profile"
            onClick={onProfileClick}
            color="#6f4ccf"
          >
            <MenuList>
              {userLogin ? (
                <UserProfileBox>
                  <UserProfile src={userObj?.profileURL} alt="profile" />
                </UserProfileBox>
              ) : (
                <BsPersonCircle />
              )}
              <MenuText>프로필</MenuText>
            </MenuList>
          </MenuBtn>
          {isAuthModal && (
            <AuthFormModal
              modalOpen={isAuthModal}
              modalClose={onProfileClick}
            />
          )}
        </MenuBox>
      </Container>
    </>
  );
};

export default LeftBar;

const Container = styled.section`
  position: sticky;
  top: 0;
  flex: 0 1 auto;
  width: 220px;
  height: 100vh;
  background: #fff;
  user-select: none;
  padding: 0 30px;
  border: 2px solid #222222;
  border-radius: 40px 0 0 40px;
`;

const MenuBox = styled.nav<{ pathname: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  outline: none;
  width: 100%;
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
    /* box-shadow: 1px 1px 0 ${(props) => props.color},
      2px 2px 0 ${(props) => props.color}, 3px 3px 0 ${(props) => props.color},
      4px 4px 0 ${(props) => props.color}, 5px 5px 0 ${(props) => props.color},
      6px 6px 0 2px #222222; */
    box-shadow: 0px 6px 0 -2px ${(props) => props.color}, 0px 6px #222222;
  }
`;

const MenuBtn = styled.div<{ cat: string; menu: string; color: string }>`
  display: flex;
  align-items: center;
  outline: none;
  width: 100%;

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
  margin-left: 18px;
  font-size: 18px;
  white-space: nowrap;
`;

const UserProfileBox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #dbdbdb;
`;

const UserProfile = styled.img`
  display: block;
  width: 100%;
  height: 100%;
`;
