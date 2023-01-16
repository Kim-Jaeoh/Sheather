import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

type Props = {};

const Header = (props: Props) => {
  // const URL = `${process.env.REACT_APP_WEATHER_URL}/weather?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&lang=kr&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`;

  return (
    <Container>
      <MenuBox>날씨이이</MenuBox>
    </Container>
  );
};

export default Header;

const Container = styled.nav`
  position: sticky;
  top: 0;
  max-width: 1100px;
  margin: 0 auto;
  height: 80px;
  border: 2px solid #222222;
  background-color: #fff;
`;

const MenuBox = styled.ul`
  /* display: flex; */
`;

const MenuList = styled.li``;
