import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import LeftBar from "./pages/LeftBar";
import RightBar from "./pages/RightBar";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Message from "./pages/Message";
import Explore from "./pages/Explore";

const App = () => {
  return (
    <Background>
      <Wrapper>
        <LeftBar />
        <Main>
          <Header />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
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
  );
};

export default App;

const Background = styled.div`
  background: #fafafa;
`;

const Wrapper = styled.main`
  display: flex;
  /* background-color: #fff; */
  max-width: 1300px;
  min-width: 320px;
  height: 100%;
  margin: 0 auto;
`;

const Main = styled.div`
  flex: 1 1 auto;
  width: 800px;
  height: auto;
  /* background-color: #fafafa; */
  padding: 0 20px;
`;

const Container = styled.div`
  border-left: 2px solid #222222;
  border-right: 2px solid #222222;
  width: 100%;
`;
