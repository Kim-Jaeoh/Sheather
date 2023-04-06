import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import { FiSearch } from "react-icons/fi";
import SearchModal from "./modal/search/SearchModal";
import { SlBell } from "react-icons/sl";
import NoticeModal from "./modal/notice/NoticeModal";
import { NoticeArrType } from "../types/type";
import { onSnapshot, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { dbService } from "../fbase";
import { ReactComponent as SheatherLogo } from "../assets/sheather_logo.svg";
import { Link } from "react-router-dom";

type Props = {};

const MobileHeader = (props: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isNoticeModal, setIsNoticeModal] = useState(false);
  const [myAccount, setMyAccount] = useState(null);

  // 본인 계정 정보 가져오기
  useEffect(() => {
    if (userLogin) {
      const unsubscribe = onSnapshot(
        doc(dbService, "users", userObj?.displayName),
        (doc) => {
          setMyAccount(doc.data());
        }
      );

      return () => unsubscribe();
    }
  }, [userLogin, userObj?.displayName]);

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
        <LogoBox to="/">
          {/* SHEATHER */}
          <SheatherLogo width="100%" height="100%" />
        </LogoBox>
        <IconBox>
          <Icon type="button" onClick={onSearchModal}>
            <FiSearch />
          </Icon>
          <Icon type="button" onClick={onNoticeModal}>
            <SlBell />
            {myAccount?.notice?.some((res: NoticeArrType) => !res.isRead) && (
              <NoticeBox />
            )}
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

const LogoBox = styled(Link)`
  display: flex;
  align-items: center;
  width: 110px;
  overflow: hidden;
  cursor: pointer;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${secondColor};
`;

const Icon = styled.button`
  position: relative;
  padding: 0;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NoticeBox = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5c1b;

  @media (max-width: 767px) {
    position: absolute;
    top: -2px;
    left: 9px;
    width: 10px;
    height: 10px;
    border: 2px solid #fff;
  }
`;