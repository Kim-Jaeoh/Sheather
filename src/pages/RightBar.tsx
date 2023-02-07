import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

type Props = {};

const RightBar = (props: Props) => {
  return (
    <Container>
      <MenuBox>
        <MenuList>Expected</MenuList>
      </MenuBox>
    </Container>
  );
};

export default RightBar;

const Container = styled.section`
  flex: 0 1 auto;
  max-height: 100%;
  position: relative;
  width: 290px;
  background: #fff;
`;

const MenuBox = styled.ul`
  padding: 0 16px;
  width: 100%;
  height: 100vh;
  position: sticky;
  top: 0;
  border: 2px solid #222222;
`;

const MenuList = styled.li`
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
`;
