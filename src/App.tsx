import React, { Suspense, lazy, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/footer/Footer";
import Message from "./pages/Message";
import DetailFeed from "./components/feed/detail/DetailFeed";
import SrollToTop from "./hooks/useScrollToTop";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import TagCategoryList from "./components/explore/TagCategoryList";
import FollowCategoryList from "./components/explore/FollowCategoryList";
import useMediaScreen from "./hooks/useMediaScreen";
import useUserAccount from "./hooks/useUserAccount";
import MobileHeader from "./components/MobileHeader";
import InfoCategory from "./components/explore/InfoCategory";
import AppDeco from "./components/AppDeco";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import { SuspenseSpinner } from "./assets/spinner/SuspenseSpinner";
import AuthFormModal from "./components/modal/auth/AuthFormModal";
const Weather = lazy(() => import("./pages/Weather"));

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const { isMobile, isDesktop, RightBarNone } = useMediaScreen();
  const { isAuthModal, setIsAuthModal, onAuthModal, onIsLogin, onLogOutClick } =
    useUserAccount();

  useEffect(() => {
    console.log(`
    。　♡ 。　 ♡。　　♡
    ♡。　＼　　｜　　／。　♡
    　      SHEATHER
    ♡。　／　　｜　　＼。　♡
    。　♡。 　　。　　♡。
    `);
    //   console.log(`
    //   ╭ ◜◝ ͡ ◜◝ ͡ ◜◝ ͡ ◜◝  ◜◝╮
    //  💗 이 토이프로젝트 재밌다  💗
    //   ╰ ◟◞ ͜ ◟ ͜ ◟◞ ͜ ◟ ͜ ◟◞◟◞╯
    //   　ｏ
    //   　　 。
    //   　　　｡
    //   　　∧＿∧
    //   　 (*　･ω･)
    //   ＿(__つ/￣￣￣/_
    //   　　＼/　　　/
    //   `);

    // // 유저 상태 변화 추적(로그인, 로그아웃, 어플리케이션 초기화 시)
    // authService.onAuthStateChanged(async (user) => {
    //   if (user) {
    //     setUserObj(user);
    //   } else {
    //     setUserObj(null);
    //   }
    //   setInit(true); // 어플리케이션이 언제 시작해도 onAuthStateChanged가 실행돼야 하기 때문에 true
    // });
  }, []);

  return (
    <Suspense fallback={<SuspenseSpinner />}>
      {/* <SrollToTop /> */}
      <Body>
        {isAuthModal && (
          <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
        )}
        {/* {isDesktop && <AppDeco />} */}
        <Wrapper>
          <LeftBar onIsLogin={onIsLogin} />
          {isMobile && <MobileHeader onIsLogin={onIsLogin} />}
          <Main>
            <Toaster position="bottom-center" reverseOrder={false} />
            <Container>
              <Routes>
                <Route path={`/feed/*`} element={<Home />} />
                <Route path={`/feed/detail/:id`} element={<DetailFeed />} />
                <Route path={`/weather`} element={<Weather />} />
                <Route path={`/message/*`} element={<Message />} />
                <Route path={`/explore/*`} element={<InfoCategory />} />
                <Route path={`/explore/tag`} element={<TagCategoryList />} />
                <Route
                  path={`/explore/people`}
                  element={<FollowCategoryList />}
                />
                <Route path={`/profile/:id/*`} element={<Profile />} />
                <Route
                  path="*"
                  element={<Navigate replace to="/feed/following" />}
                />
              </Routes>
            </Container>
            {!isMobile && <Footer />}
          </Main>
          {!RightBarNone && <RightBar />}
        </Wrapper>
      </Body>
    </Suspense>
  );
};

export default App;

const Body = styled.div`
  position: relative;
`;

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
    /* height: 100%; */
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
