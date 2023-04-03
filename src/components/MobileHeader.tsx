import React, { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import { FiSearch } from "react-icons/fi";
import SearchModal from "./modal/search/SearchModal";
import { SlBell } from "react-icons/sl";
import NoticeModal from "./modal/notice/NoticeModal";

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
      {isNoticeModal && (
        <NoticeModal modalOpen={isNoticeModal} modalClose={onNoticeModal} />
      )}
      <Header>
        <LogoBox>SHEATHER</LogoBox>
        <IconBox>
          <Icon type="button" onClick={onSearchModal}>
            <FiSearch />
          </Icon>
          <Icon type="button" onClick={onNoticeModal}>
            <SlBell />
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
