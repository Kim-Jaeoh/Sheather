import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import LeftBar from "./pages/LeftBar";
import RightBar from "./pages/RightBar";
import Header from "./pages/Header";
import Footer from "./pages/Footer";

const App = () => {
  return (
    <Wrapper>
      <LeftBar />
      <Main>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<Weather />} />
          </Routes>
        </Container>
        <Footer />
      </Main>
      <RightBar />
    </Wrapper>
  );
};

export default App;

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #fff;
  max-width: 1200px;
  min-width: 320px;
  /* border: 2px solid #222222; */
  margin: 0 auto;
  padding: 0 20px 0;
`;

const Main = styled.div`
  flex: 1 1 auto;
  width: 100%;
  height: auto;
  background-color: #fafafa;
  padding: 0 20px 0;
`;

const Container = styled.div`
  border-left: 2px solid #222222;
  border-right: 2px solid #222222;
  margin: 0 auto;
  /* max-width: 1100px;
  min-width: 320px; */
`;
