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
import Weather from "./pages/Weather";
import SrollToTop from "./hooks/useScrollToTop";
import { authService } from "./fbase";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
// const Weather = lazy(() => import("./pages/Weather"));

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

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
    <Suspense fallback={<Spinner />}>
      <SrollToTop />
      <Toaster position="bottom-left" reverseOrder={false} />
      <Background>
        <Wrapper>
          <LeftBar />
          <Main>
            <Container>
              <Routes>
                <Route path="/feed/*" element={<Home />} />
                <Route path="/feed/detail" element={<DetailFeed />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/message" element={<Message />} />
                <Route path="/explore/*" element={<Explore />} />
                <Route path="/profile/:id/*" element={<Profile />} />
                <Route path="/profile/detail" element={<DetailFeed />} />
                <Route
                  path="/"
                  element={<Navigate replace to="/feed/recent" />}
                />
              </Routes>
            </Container>
            <Footer />
          </Main>
          <RightBar />
        </Wrapper>
      </Background>
    </Suspense>
  );
};

export default App;

const Background = styled.div`
  background: #fafafa;
  color: #222;
  font-variant-numeric: tabular-nums;
`;

const Wrapper = styled.div`
  display: flex;
  max-width: 1280px;
  min-width: 320px;
  height: 100%;
  margin: 0 auto;
`;

const Main = styled.main`
  /* flex: 1 1 auto; */
  width: 700px;
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 0 20px;
`;

const Container = styled.div`
  flex: 1;
  width: 100%;
  /* border-top: 2px solid #222; */
  border-left: 2px solid #222;
  border-right: 2px solid #222;
`;
