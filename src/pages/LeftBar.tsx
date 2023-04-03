import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import {
  BsChatDots,
  BsPersonCircle,
  BsPlusCircle,
  BsSun,
} from "react-icons/bs";
import AuthFormModal from "../components/modal/auth/AuthFormModal";
import { useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse, AxiosError } from "axios";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { listType, WeatherDataType } from "../types/type";
import ShareWeatherModal from "../components/modal/shareWeather/ShareWeatherModal";
import { shareWeather } from "../app/weather";
import {
  onSnapshot,
  doc,
  collection,
  query,
  updateDoc,
} from "firebase/firestore";
import { currentUser, CurrentUserType } from "../app/user";
import { dbService } from "../fbase";
import useMediaScreen from "../hooks/useMediaScreen";
import ColorList from "../assets/ColorList";
import { SlBell } from "react-icons/sl";
import NoticeModal from "../components/modal/notice/NoticeModal";
import SearchModal from "../components/modal/search/SearchModal";
import { FiSearch } from "react-icons/fi";

const LeftBar = () => {
  const [isAuthModal, setIsAuthModal] = useState(false);
  const [selectMenu, setSelectMenu] = useState(0);
  const [myAccount, setMyAccount] = useState(null);
  const [users, setUsers] = useState([]);
  const [messageCollection, setMessageCollection] = useState(null);
  const [shareBtn, setShareBtn] = useState(false);
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isNoticeModal, setIsNoticeModal] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const { location } = useCurrentLocation();
  const { isDesktop, isTablet, isMobile, isMobileBefore, RightBarNone } =
    useMediaScreen();

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

  // 본인 계정 정보 가져오기
  useEffect(() => {
    if (userLogin) {
      const unsubscribe = onSnapshot(
        doc(dbService, "users", userObj?.displayName),
        (doc) => {
          setMyAccount(doc.data());
        }
      );

      return () => unsubscribe();
    }
  }, [userLogin, userObj?.displayName]);

  // 상대 계정 정보 가져오기
  useEffect(() => {
    if (myAccount) {
      myAccount?.message?.map(async (res: { user: string }) => {
        onSnapshot(doc(dbService, "users", res.user), (doc) => {
          setUsers((prev: CurrentUserType[]) => {
            // 중복 체크
            if (!prev.some((user) => user.uid === doc.data().uid)) {
              return [...prev, doc.data()];
            } else {
              return prev;
            }
          });
        });
      });
    }
  }, [myAccount]);

  // redux store에 message 정보 저장
  useEffect(() => {
    if (myAccount) {
      const checkCurrentUserInfo = userObj?.message?.some(
        (res: { id: string }) => res.id === messageCollection?.id
      );

      if (messageCollection && !checkCurrentUserInfo) {
        dispatch(
          currentUser({
            ...userObj,
            message: myAccount?.message.flat(),
          })
        );
      }
    }
  }, [dispatch, messageCollection, myAccount?.message]);

  // 채팅방 정보 불러오기
  useEffect(() => {
    const q = query(collection(dbService, `messages`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list: listType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const getInfo = users?.map((user) => {
        return list?.filter(
          (doc) =>
            doc.member.includes(userObj.displayName) &&
            doc.member.includes(user?.displayName)
        );
      });
      setMessageCollection(getInfo.flat());
    });
    return () => unsubscribe();
  }, [userObj.displayName, users]);

  // // 채팅방 알림 표시
  // useEffect(() => {
  //   if (messageCollection) {
  //     const filter = messageCollection.map((res: listType) => {
  //       return res.message
  //         .filter((msg) => msg.displayName !== userObj.displayName) // 1. 상대방과의 채팅 중
  //         .filter((msg: { isRead: boolean }) => msg.isRead === false); // 2. 안 읽은 것 가져오기
  //     });

  //     //  안 읽은 채팅방 있을 시 알림 표시
  //     const notice = filter.flat();
  //     if (notice.length > 0) {
  //       const checkReadInfo = async () => {
  //         const copy = [...myAccount?.message];
  //         await updateDoc(doc(dbService, "users", userObj.displayName), {
  //           message: copy.map((res) => {
  //             if (
  //               notice.some(
  //                 (chat: { displayName: string }) =>
  //                   chat.displayName === res.user
  //               )
  //             ) {
  //               return { ...res, isRead: false };
  //             } else {
  //               return { ...res };
  //             }
  //           }),
  //         });
  //       };

  //       checkReadInfo();
  //     }
  //   }
  // }, [messageCollection, myAccount?.message, userObj.displayName]);

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

  useEffect(() => {
    if (!RightBarNone) {
      setIsSearchModal(false);
    }
  }, [RightBarNone]);

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

  const onSearchModal = () => {
    setIsSearchModal((prev) => !prev);
    setSelectMenu(3);
  };

  // 알림 모달
  const onNoticeClick = () => {
    if (userLogin) {
      setIsNoticeModal((prev) => !prev);
      setSelectMenu(3);
    } else {
      setIsAuthModal((prev) => !prev);
    }
  };

  // 글 작성
  const onWriteClick = () => {
    if (userLogin) {
      setShareBtn((prev) => !prev);
      setSelectMenu(4);
      dispatch(shareWeather(weatherData?.data));
    } else {
      setIsAuthModal((prev) => !prev);
    }
  };

  // 프로필 이동
  const onProfileClick = () => {
    if (!userLogin) {
      setIsAuthModal((prev) => !prev);
    } else {
      navigate(`profile/${userObj?.displayName}/post`, {
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
      <Container
        isDesktop={isDesktop}
        isMobileBefore={isMobileBefore}
        isMobile={isMobile}
      >
        <MenuBox pathname={pathname}>
          <LogoBox>SHEATHER</LogoBox>
          <MenuLink
            style={{ order: 0 }}
            menu={menu}
            cat="feed"
            onClick={() => setSelectMenu(0)}
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
            style={{ order: isMobile ? 4 : 3 }}
            menu={menu}
            cat="message"
            onClick={() => setSelectMenu(2)}
            color="#ff5c1b"
            to="/message"
          >
            <MenuList>
              <BsChatDots />
              <MenuText>메세지</MenuText>
              {userObj?.message?.some((res) => !res?.isRead) && <NoticeBox />}
            </MenuList>
          </MenuLink>
          {RightBarNone && !isMobile && (
            <MenuBtn
              style={{ order: 3 }}
              menu={menu}
              cat="search"
              color="#2cbadd"
              onClick={onSearchModal}
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
              menu={menu}
              cat="notice"
              color="#cbdd2c"
              onClick={onNoticeClick}
            >
              <MenuList>
                <SlBell />
                <MenuText>알림</MenuText>
              </MenuList>
            </MenuBtn>
          )}
          {/* <MenuLink
            menu={menu}
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
            menu={menu}
            cat="write"
            color="#ffe448"
            onClick={onWriteClick}
          >
            <MenuList>
              <BsPlusCircle />
              <MenuText>글쓰기</MenuText>
            </MenuList>
          </MenuBtn>
          <MenuBtn
            style={{ order: 6 }}
            menu={menu}
            cat="profile"
            onClick={onProfileClick}
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

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.section<{
  isDesktop: boolean;
  isMobileBefore: boolean;
  isMobile: boolean;
}>`
  width: 70px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: #fff;
  user-select: none;
  padding: 0 30px;
  border: 2px solid ${secondColor};
  border-right: none;
  border-radius: 40px 0 0 40px;

  @media (min-width: 1060px) {
    width: 220px;
  }

  @media (max-width: 1059px) {
    h2 {
      display: none;
    }

    a,
    button {
      width: auto;
      li {
        padding: 10px;
        box-shadow: none;
      }
      &:hover li:hover,
      &:active li:active {
        box-shadow: none;
      }
    }
  }

  @media (max-width: 767px) {
    width: 100%;
    height: 60px;
    position: fixed;
    top: unset;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    border: 0;
    border-top: 1px solid ${secondColor};
    z-index: 100;

    nav {
      flex-direction: row;
      justify-content: space-evenly;
      > div:first-of-type {
        display: none;
      }
    }

    a,
    button {
      li {
        border: none;
      }
      &:hover li:hover,
      &:active li:active {
        border: none;
      }
    }
  }
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
    box-shadow: 0px 6px 0 -2px ${(props) => props.color}, 0px 6px #222222;
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
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
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

  @media (max-width: 767px) {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    /* border: 2px solid #fff; */
  }
`;
