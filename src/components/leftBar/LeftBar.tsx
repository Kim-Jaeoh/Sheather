import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import {
  BsChatDots,
  BsPersonCircle,
  BsPlusCircle,
  BsSun,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { SlBell } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import { ReactComponent as SheatherLogoSmall } from "../../assets/image/sheather_logo_s.svg";
import { shareWeather } from "../../app/weather";
import ColorList from "../../assets/data/ColorList";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import useMediaScreen from "../../hooks/useMediaScreen";
import { WeatherDataType, MessageType, NoticeArrType } from "../../types/type";
import NoticeModal from "../modal/notice/NoticeModal";
import SearchModal from "../modal/search/SearchModal";
import ShareWeatherModal from "../modal/shareWeather/ShareWeatherModal";
import Deco from "./Deco";
import useGetMyAccount from "../../hooks/useGetMyAccount";
import { nowWeatherApi } from "../../apis/api";

type MenuFuncgionType = {
  [key: string]: () => void;
};

type props = {
  onIsLogin: (callback: () => void) => void;
};

const LeftBar = ({ onIsLogin }: props) => {
  const [selectMenu, setSelectMenu] = useState("feed");
  const [shareBtn, setShareBtn] = useState(false);
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isNoticeModal, setIsNoticeModal] = useState(false);
  const { location } = useCurrentLocation();
  const { userLogin, userObj, myAccount } = useGetMyAccount();
  const { isMobile, isTablet, isDesktop, RightBarNone } = useMediaScreen();

  const { pathname } = useLocation();
  const dispatch = useDispatch();

  // 현재 날씨 정보 가져오기
  const { data: weatherData } = useQuery<
    AxiosResponse<WeatherDataType>,
    AxiosError
  >(["Weather", location], () => nowWeatherApi(location), {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

  useEffect(() => {
    if (!RightBarNone) {
      setIsSearchModal(false);
    }
  }, [RightBarNone]);

  // 메뉴
  useEffect(() => {
    setSelectMenu(pathname.split("/")[1]);
  }, [pathname]);

  // // 방법 1. 버튼 클릭
  // const onBtnClick = (type: string) => {
  //   isLogin(() => {
  //     if (type === "message" || type === "profile") {
  //       return setSelectMenu(type);
  //     }
  //     if (type === "search") {
  //       return setIsSearchModal((prev) => !prev);
  //     }
  //     if (type === "notice") {
  //       return setIsNoticeModal((prev) => !prev);
  //     }
  //     if (type === "write") {
  //       setShareBtn((prev) => !prev);
  //       return dispatch(shareWeather(weatherData?.data));
  //     }
  //   });
  // };

  // 방법 2. 버튼 클릭
  const menuFunctions: MenuFuncgionType = {
    message: () => {
      setSelectMenu("message");
    },
    profile: () => {
      setSelectMenu("profile");
    },
    search: () => {
      setIsSearchModal((prev) => !prev);
    },
    notice: () => {
      setIsNoticeModal((prev) => !prev);
    },
    write: () => {
      setShareBtn((prev) => !prev);
      dispatch(shareWeather(weatherData?.data));
    },
  };

  const onBtnClick = (type: string) => {
    onIsLogin(() => {
      menuFunctions[type]();
    });
  };

  return (
    <>
      {shareBtn && (
        <ShareWeatherModal shareBtn={shareBtn} setShareBtn={setShareBtn} />
      )}
      {isNoticeModal && (
        <NoticeModal
          modalOpen={isNoticeModal}
          modalClose={() => setIsNoticeModal(false)}
        />
      )}
      {isSearchModal && (
        <SearchModal
          modalOpen={isSearchModal}
          modalClose={() => setIsSearchModal(false)}
        />
      )}
      <Container>
        {isDesktop && <Deco />}
        <MenuBox pathname={pathname}>
          {!isMobile && (
            <LogoBox to="/">
              {!isTablet ? (
                <Logo>
                  <LogoImage
                    src="/image/sheather_logo.png"
                    alt="shather logo"
                  />
                </Logo>
              ) : (
                // <SheatherLogo width="100%" height="100%" />
                <SheatherLogoSmall width="100%" height="100%" />
              )}
            </LogoBox>
          )}
          <MenuLink
            style={{ order: 0 }}
            menu={selectMenu}
            cat="feed"
            onClick={() => setSelectMenu("feed")}
            color="#ff5673"
            to="/feed/following"
          >
            <MenuList>
              <AiOutlineHome />
              <MenuText>피드</MenuText>
            </MenuList>
          </MenuLink>
          <MenuLink
            style={{ order: 1 }}
            menu={selectMenu}
            cat="weather"
            onClick={() => setSelectMenu("weather")}
            color="#48a3ff"
            to="/weather"
          >
            <MenuList>
              <BsSun />
              <MenuText>날씨</MenuText>
            </MenuList>
          </MenuLink>
          <MenuLink
            style={{ order: isMobile ? 4 : 3 }}
            menu={selectMenu}
            cat="message"
            onClick={() => onBtnClick("message")}
            color="#ff5c1b"
            to={userLogin && "/message"}
          >
            <MenuList>
              <BsChatDots />
              <MenuText>메세지</MenuText>
              {myAccount?.message?.some((res: MessageType) => !res?.isRead) && (
                <NoticeBox />
              )}
            </MenuList>
          </MenuLink>
          {RightBarNone && !isMobile && (
            <MenuBtn
              style={{ order: 3 }}
              menu={selectMenu}
              cat="search"
              color="#2cbadd"
              onClick={() => onBtnClick("search")}
            >
              <MenuList>
                <FiSearch />
                <MenuText>검색</MenuText>
              </MenuList>
            </MenuBtn>
          )}
          {!isMobile && (
            <MenuBtn
              style={{ order: 4 }}
              menu={selectMenu}
              cat="notice"
              color="#cbdd2c"
              onClick={() => onBtnClick("notice")}
            >
              <MenuList>
                <SlBell />
                <MenuText>알림</MenuText>
                {myAccount?.notice?.some(
                  (res: NoticeArrType) => !res?.isRead
                ) && <NoticeBox />}
              </MenuList>
            </MenuBtn>
          )}
          {/* <MenuLink
            menu={selectMenu}
            cat="explore"
            onClick={() => setSelectMenu(3)}
            color="#30c56e"
            to="/explore"
          >
            <MenuList>
              <IoCompassOutline />
              <MenuText>탐색</MenuText>
            </MenuList>
          </MenuLink> */}
          <MenuBtn
            style={{ order: isMobile ? 3 : 5 }}
            menu={selectMenu}
            cat="write"
            color="#fff048"
            onClick={() => onBtnClick("write")}
          >
            <MenuList>
              <BsPlusCircle />
              <MenuText>글쓰기</MenuText>
            </MenuList>
          </MenuBtn>
          <MenuLink
            style={{ order: 6 }}
            menu={selectMenu}
            cat="profile"
            onClick={() => onBtnClick("profile")}
            to={userLogin && `profile/${userObj?.displayName}/post`}
            color="#6f4ccf"
          >
            <MenuList>
              {userLogin ? (
                <>
                  <UserProfileBox>
                    <UserProfile src={userObj?.profileURL} alt="profile" />
                  </UserProfileBox>
                  <MenuText>프로필</MenuText>
                </>
              ) : (
                <>
                  <BsPersonCircle />
                  <MenuText>로그인</MenuText>
                </>
              )}
            </MenuList>
          </MenuLink>
        </MenuBox>
      </Container>
    </>
  );
};

export default LeftBar;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.section`
  width: 70px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: #fff;
  user-select: none;
  padding: 30px;
  border: 2px solid ${secondColor};
  border-right: none;
  border-radius: 40px 0 0 40px;

  @media (min-width: 1060px) {
    width: 220px;
  }

  @media (min-width: 768px) and (max-width: 1059px) {
    padding: 0;
    h2 {
      display: none;
    }
  }

  @media (max-width: 767px) {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    position: fixed;
    top: unset;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    padding: 0 30px;
    border: 0;
    border-top: 1px solid ${secondColor};
    z-index: 100;

    h2 {
      display: none;
    }

    nav {
      flex-direction: row;
      justify-content: space-evenly;
      > div:first-of-type {
        display: none;
      }
    }
  }
`;

const MenuBox = styled.nav<{ pathname: string }>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoBox = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  /* width: 150px; */
  /* height: 92px; */
  margin-bottom: 30px;
  overflow: hidden;
  cursor: pointer;
  /* padding: 20px; */

  @media (min-width: 768px) and (max-width: 1059px) {
    width: 34px;
    margin-bottom: 0;
    padding: 28px 0 14px;
  }
`;

const Logo = styled.div`
  width: 170px;
`;

const LogoImage = styled.img`
  display: block;
  width: 100%;
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
      props.cat === props.menu
        ? `2px solid ${secondColor}`
        : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.cat === props.menu
        ? `0px 6px 0 -2px ${props.color}, 0px 6px #222`
        : "0"};
  }

  &:hover li:hover,
  &:active li:active {
    border: 2px solid ${secondColor};
    box-shadow: 0px 6px 0 -2px ${(props) => props.color}, 0px 6px ${secondColor};
  }

  @media (max-width: 1059px) {
    width: auto;
    height: 60px;

    li {
      padding: 10px;
      position: relative;
      box-shadow: none;
      border: none;
      &::after {
        display: ${(props) => (props.cat === props.menu ? "block" : "none")};
        content: "";
        width: 20px;
        height: 2px;
        position: absolute;
        background: ${secondColor};
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }
    &:hover li:hover,
    &:active li:active {
      border: none;
      box-shadow: none;
    }
  }

  @media (max-width: 767px) {
    li {
      padding: 16px 10px;
      margin: 0;
      border: none;
    }
    &:hover li:hover,
    &:active li:active {
      border: none;
    }
  }
`;

const MenuBtn = styled.button<{ cat: string; menu: string; color: string }>`
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
      props.cat === props.menu
        ? `2px solid ${secondColor}`
        : "2px solid transparent"};
    box-shadow: ${(props) =>
      props.cat === props.menu
        ? `0px 6px 0 -2px ${props.color}, 0px 6px #222`
        : "0"};
  }

  &:hover li:hover,
  &:active li:active {
    border: 2px solid ${secondColor};
    box-shadow: 0px 6px 0 -2px ${(props) => props.color}, 0px 6px ${secondColor};
  }

  @media (max-width: 1059px) {
    width: auto;
    height: 60px;

    li {
      padding: 10px;
      position: relative;
      box-shadow: none;
      border: none;
    }
    &:hover li:hover,
    &:active li:active {
      &::after {
        display: ${(props) => (props.cat === props.menu ? "block" : "none")};
        content: "";
        width: 20px;
        height: 2px;
        position: absolute;
        background: ${secondColor};
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
      border: none;
      box-shadow: none;
    }
  }

  @media (max-width: 767px) {
    li {
      padding: 16px 10px;
      margin: 0;
      border: none;
    }
    &:hover li:hover,
    &:active li:active {
      border: none;
    }
  }
`;

const MenuList = styled.li`
  width: 100%;
  padding: 20px;
  position: relative;
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
  font-family: "GmarketSans", -apple-system, Apple SD Gothic Neo, Malgun Gothic,
    sans-serif !important;
  margin-bottom: -4px; // 폰트 교체로 인해 여백 제거
  margin-left: 16px;
  text-align: left;
  font-size: 18px;
  white-space: nowrap;
  flex: 1;
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

const NoticeBox = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5c1b;

  @media (max-width: 1059px) {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
  }

  @media (max-width: 767px) {
    position: absolute;
    top: 14px;
    left: 31px;
    width: 12px;
    height: 12px;
    border: 2px solid #fff;
  }
`;
