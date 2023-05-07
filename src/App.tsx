import React, { Suspense, lazy, useEffect } from "react";
import styled from "@emotion/styled";
import { Navigate, Route, Routes } from "react-router-dom";
import SrollToTop from "./hooks/useScrollToTop";
import { Toaster } from "react-hot-toast";
import useMediaScreen from "./hooks/useMediaScreen";
import useUserAccount from "./hooks/useUserAccount";
import { SuspenseSpinner } from "./assets/spinner/SuspenseSpinner";
import AppDeco from "./components/AppDeco";
import Footer from "./components/footer/Footer";
const Home = lazy(() => import("./pages/Home"));
const Message = lazy(() => import("./pages/Message"));
const Profile = lazy(() => import("./pages/Profile"));
const DetailFeed = lazy(() => import("./components/feed/detail/DetailFeed"));
const InfoCategory = lazy(() => import("./components/explore/InfoCategory"));
const TagCategoryList = lazy(
  () => import("./components/explore/TagCategoryList")
);
const FollowCategoryList = lazy(
  () => import("./components/explore/FollowCategoryList")
);
const Weather = lazy(() => import("./pages/Weather"));
const MobileHeader = lazy(() => import("./components/MobileHeader"));
const LeftBar = lazy(() => import("./components/leftBar/LeftBar"));
const RightBar = lazy(() => import("./components/rightBar/RightBar"));
const AuthFormModal = lazy(
  () => import("./components/modal/auth/AuthFormModal")
);

const App = () => {
  // const [init, setInit] = useState(false);
  // const [userObj, setUserObj] = useState(null);
  const { isMobile, isDesktop, RightBarNone } = useMediaScreen();
  const { isAuthModal, onAuthModal, onIsLogin } = useUserAccount();

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

  let vh: number = 0;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <SrollToTop />
      <Box>
        {isAuthModal && (
          <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
        )}
        {isDesktop && <AppDeco />}
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
      </Box>
    </Suspense>
  );
};

export default App;

const Box = styled.div`
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
