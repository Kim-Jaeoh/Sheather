import React, { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import { FiBell, FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import SearchModal from "./modal/search/SearchModal";
import { TbBell } from "react-icons/tb";

type Props = {};

const MobileHeader = (props: Props) => {
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isNoticeModal, setIsNoticeModal] = useState(false);

  const onSearchModal = () => {
    setIsSearchModal((prev) => !prev);
  };

  const onNoticeModal = () => {
    setIsNoticeModal((prev) => !prev);
  };

  return (
    <>
      {isSearchModal && (
        <SearchModal modalOpen={isSearchModal} modalClose={onSearchModal} />
      )}
      <Header>
        <LogoBox>SHEATHER</LogoBox>
        <IconBox>
          <Icon type="button" onClick={onSearchModal}>
            <FiSearch />
          </Icon>
          <Icon type="button">
            <TbBell />
            {/* <IoNotificationsOutline /> */}
          </Icon>
        </IconBox>
      </Header>
    </>
  );
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

const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${secondColor};
`;

const Icon = styled.button`
  padding: 0;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;
