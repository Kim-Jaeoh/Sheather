import React, { useEffect, useState } from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import axios from "axios";
import useNationalWeather from "../hooks/useNationalWeather";

const Home = () => {
  const { weather } = useNationalWeather();

  useEffect(() => {
    const filterA = weather?.item?.filter(
      (res: { category: string }) => res.category === "TMP"
    );
    const filterB = weather?.item?.filter(
      (res: { category: string }) => res.category === "SKY"
    );
  }, [weather?.item]);

  return (
    <Container>
      <>
        {/* {weather?.item?.map(
        (res: {
          fcstTime: string;
          category: string;
          fcstDate: string;
          fcstValue: string;
        }) => {
          const TMP = res?.category.includes("TMP");
          return (
            <>
              <MenuBox>{res.fcstValue}</MenuBox>
            </>
          );
        }
        )} */}
      </>
    </Container>
  );
};

export default Home;

const Container = styled.main`
  height: 100%;
  height: 2000px;
  background: #00000039;
  display: flex;
  overflow: hidden;
`;

const Header = styled.nav``;

const MenuBox = styled.ul``;

const MenuList = styled.li``;
