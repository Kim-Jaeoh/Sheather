import React, { Suspense, lazy } from "react";
import styled from "@emotion/styled";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LeftBar from "./pages/LeftBar";
import RightBar from "./pages/RightBar";
import Header from "./components/header/Header";
import Footer from "./pages/Footer";
import Message from "./pages/Message";
import Explore from "./pages/Explore";
import { Spinner } from "./assets/Spinner";
import DetailFeed from "./components/feed/DetailFeed";
import Weather from "./pages/Weather";
import SrollToTop from "./hooks/useScrollToTop";
// const Weather = lazy(() => import("./pages/Weather"));

const App = () => {
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

  return (
    <Suspense fallback={<Spinner />}>
      <SrollToTop />
      <Background>
        <Wrapper>
          <LeftBar />
          <Main>
            <Header />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detail" element={<DetailFeed />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/message" element={<Message />} />
                <Route path="/explore" element={<Explore />} />
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
  height: auto;
  padding: 0 20px;
`;

const Container = styled.div`
  width: 100%;
  border-left: 2px solid #222222;
  border-right: 2px solid #222222;
`;
