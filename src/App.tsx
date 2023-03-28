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
import SearchBox from "./components/search/SearchBox";
import SearchResult from "./components/search/SearchResult";
import TagCategoryList from "./components/explore/TagCategoryList";
import FollowCategoryList from "./components/explore/FollowCategoryList";
import useMediaScreen from "./hooks/useMediaScreen";
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

  console.log(init);

  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <SrollToTop />
      <Background>
        <Wrapper isMobile={isMobile}>
          <LeftBar />
          <Main isDesktop={isDesktop} isMobile={isMobile}>
            <Toaster position="bottom-center" reverseOrder={false} />
            <Container isMobile={isMobile}>
              <Routes>
                <Route path="/feed/*" element={<Home />} />
                <Route path="/feed/detail" element={<DetailFeed />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/message/*" element={<Message />} />
                <Route path="/explore/*" element={<Explore />} />
                <Route path="/explore/search" element={<SearchResult />} />
                <Route path="/explore/tag" element={<TagCategoryList />} />
                <Route
                  path="/explore/people"
                  element={<FollowCategoryList />}
                />
                <Route path="/profile/:id/*" element={<Profile />} />
                <Route path="/profile/detail" element={<DetailFeed />} />
                <Route
                  path="/explore"
                  element={<Navigate replace to="/explore/outer?detail=0" />}
                />
                <Route
                  path="/"
                  element={<Navigate replace to="/feed/recent" />}
                />
              </Routes>
            </Container>
            {!isMobile && <Footer />}
          </Main>
          {!RightBarNone && <RightBar />}
        </Wrapper>
      </Background>
    </Suspense>
  );
};

export default App;

const Background = styled.div`
  /* background: #fafafa;
  color: #222;
  font-variant-numeric: tabular-nums; */
`;

const Wrapper = styled.div<{ isMobile: boolean }>`
  display: ${(props) => (props.isMobile ? `block` : `flex`)};
  position: relative;
  max-width: 1280px;
  min-width: 320px;
  height: 100%;
  margin: 0 auto;
`;

const Main = styled.main<{ isDesktop: boolean; isMobile: boolean }>`
  flex: 1;
  max-width: ${(props) => (props.isDesktop ? "760px" : "auto")};
  display: flex;
  flex-direction: column;
  height: ${(props) => (props.isMobile ? "100vh" : "auto")};
`;

const Container = styled.section<{ isMobile: boolean }>`
  flex: 1;
  width: 100%;
  /* border-top: 2px solid #222; */
  padding-bottom: ${(props) => props.isMobile && `60px`};
  border-left: ${(props) => !props.isMobile && `2px solid #222`};
  border-right: ${(props) => !props.isMobile && `2px solid #222`};
  border-bottom: ${(props) => !props.isMobile && `2px solid #222`};
`;
