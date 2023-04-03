import React, { Suspense, lazy, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LeftBar from "./pages/LeftBar";
import RightBar from "./pages/RightBar";
import Footer from "./pages/Footer";
import Message from "./pages/Message";
import Explore from "./pages/Explore";
import { Spinner } from "./assets/Spinner";
import DetailFeed from "./components/feed/DetailFeed";
// import Weather from "./pages/Weather";
import SrollToTop from "./hooks/useScrollToTop";
import { authService } from "./fbase";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { SuspenseSpinner } from "./assets/SuspenseSpinner";
import TagCategoryList from "./components/explore/TagCategoryList";
import FollowCategoryList from "./components/explore/FollowCategoryList";
import useMediaScreen from "./hooks/useMediaScreen";
import MobileHeader from "./components/MobileHeader";
import InfoCategory from "./components/explore/InfoCategory";
const Weather = lazy(() => import("./pages/Weather"));

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const { isDesktop, isTablet, isMobile, isMobileBefore, RightBarNone } =
    useMediaScreen();

  useEffect(() => {
    console.log(`
    ╭ ◜◝ ͡ ◜◝ ͡ ◜◝ ͡ ◜◝  ◜◝╮
   💗 이 토이프로젝트 재밌다  💗
    ╰ ◟◞ ͜ ◟ ͜ ◟◞ ͜ ◟ ͜ ◟◞◟◞╯
    　ｏ
    　　 。
    　　　｡
    　　∧＿∧
    　 (*　･ω･)
    ＿(__つ/￣￣￣/_
    　　＼/　　　/
    `);

    // 유저 상태 변화 추적(로그인, 로그아웃, 어플리케이션 초기화 시)
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true); // 어플리케이션이 언제 시작해도 onAuthStateChanged가 실행돼야 하기 때문에 true
    });
  }, []);

  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <SrollToTop />
      <Wrapper>
        <LeftBar />
        {isMobile && <MobileHeader />}
        <Main>
          <Toaster position="bottom-center" reverseOrder={false} />
          <Container>
            <Routes>
              <>
                <Route path="/feed/*" element={<Home />} />
                <Route path="/feed/detail/:id" element={<DetailFeed />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/message/*" element={<Message />} />
                <Route path="/explore/*" element={<InfoCategory />} />
                <Route path="/explore/tag" element={<TagCategoryList />} />
                <Route
                  path="/explore/people"
                  element={<FollowCategoryList />}
                />
                <Route path="/profile/:id/*" element={<Profile />} />
                <Route
                  path="/explore"
                  element={<Navigate replace to="/feed/recent" />}
                />
                {/* <Route
                  path="/explore"
                  element={<Navigate replace to="/explore/outer?detail=0" />}
                /> */}
                <Route
                  path="*"
                  element={<Navigate replace to="/feed/recent" />}
                />
              </>
            </Routes>
          </Container>
          {!isMobile && <Footer />}
        </Main>
        {!RightBarNone && <RightBar />}
      </Wrapper>
    </Suspense>
  );
};

export default App;

const Wrapper = styled.div`
  display: flex;
  position: relative;
  max-width: 1280px;
  min-width: 320px;
  height: 100%;
  margin: 0 auto;

  @media (max-width: 767px) {
    display: block;
    width: 100%;
    max-width: auto;
    min-width: auto;
  }
`;

const Main = styled.main`
  flex: 1;
  max-width: 760px;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) and (max-width: 1059px) {
    max-width: calc(100% - 70px);
  }
  @media (max-width: 767px) {
    margin-top: 52px;
    /* height: 100vh; */
    height: calc(100vh - 52px);
  }
`;

const Container = styled.section`
  flex: 1;
  width: 100%;
  border-left: 2px solid #222;
  border-right: 2px solid #222;
  border-bottom: 2px solid #222;

  @media (max-width: 767px) {
    padding-bottom: 60px;
    border: none;
  }
`;
