import React from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

type Props = {};

const Home = (props: Props) => {
  return (
    <Container>
      <Header>헤헤</Header>
    </Container>
  );
};

export default Home;

const Container = styled.main`
  height: 100%;
  /* height: 2000px; */
  background: #00000039;
`;

const Header = styled.nav``;

const MenuBox = styled.ul`
  /* display: flex; */
`;

const MenuList = styled.li``;
