import React from "react";
import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";

type Props = {};

const MobileHeader = (props: Props) => {
  return <Header>SHEATHER</Header>;
};

export default MobileHeader;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Header = styled.header`
  width: 100%;
  height: 52px;
  position: fixed;
  top: 0;
  padding: 0 16px;
  background-color: #fff;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border-bottom: 2px solid ${fourthColor}; */
  border-bottom: 1px solid ${secondColor};
`;

const LogoBox = styled.div``;

const Logo = styled.img``;
