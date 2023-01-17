import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

type Props = {};

const Footer = (props: Props) => {
  return (
    <Container>
      <InfoBox>푸터</InfoBox>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  /* max-width: 1100px; */
  width: 100%;
  height: 80px;
  border: 2px solid #222222;
`;

const InfoBox = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const MenuList = styled.li``;
