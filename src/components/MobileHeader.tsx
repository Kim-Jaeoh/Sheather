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
  position: sticky;
  top: 0;
  padding: 0 16px;
  display: flex;
  background-color: #fff;
  z-index: 99;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${fourthColor};
`;

const LogoBox = styled.div``;

const Logo = styled.img``;
