import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import SearchModal from "./modal/search/SearchModal";
import NoticeModal from "./modal/notice/NoticeModal";
import { NoticeArrType } from "../types/type";
import { onSnapshot, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { dbService } from "../fbase";
import { ReactComponent as SheatherLogo } from "../assets/image/sheather_logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VscBell } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";

type Props = {
  onIsLogin: (callback: () => void) => void;
};

const MobileHeader = ({ onIsLogin }: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isNoticeModal, setIsNoticeModal] = useState(false);
  const [myAccount, setMyAccount] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 본인 계정 정보 가져오기
  useEffect(() => {
    if (userLogin) {
      const unsubscribe = onSnapshot(
        doc(dbService, "users", userObj?.email),
        (doc) => {
          setMyAccount(doc.data());
        }
      );

      return () => unsubscribe();
    }
  }, [userLogin, userObj?.email]);

  const onSearchModal = () => {
    setIsSearchModal((prev) => !prev);
  };

  const onNoticeModal = () => {
    onIsLogin(() => {
      setIsNoticeModal((prev) => !prev);
    });
  };

  const onBackClick = () => {
    navigate(-1);
  };

  const history = pathname.includes("detail") || pathname.includes("explore?q");

  return (
    <>
      {isSearchModal && (
        <SearchModal modalOpen={isSearchModal} modalClose={onSearchModal} />
      )}
      {isNoticeModal && (
        <NoticeModal modalOpen={isNoticeModal} modalClose={onNoticeModal} />
      )}
      <Header>
        {history ? (
          <IconBox>
            <Icon type="button" onClick={onBackClick}>
              <IoIosArrowBack />
            </Icon>
          </IconBox>
        ) : (
          <LogoBox to="/feed/following">
            <SheatherLogo width="100%" height="100%" />
          </LogoBox>
        )}
        <IconBox>
          <Icon type="button" onClick={onSearchModal}>
            <CiSearch />
          </Icon>
          <Icon type="button" onClick={onNoticeModal}>
            <VscBell />
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
  border-bottom: 1px solid var(--second-color);
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
  color: var(--second-color);
`;

const Icon = styled.button`
  position: relative;
  padding: 0;
  cursor: pointer;

  &:first-of-type {
    svg {
      stroke-width: 0.6;
    }
  }

  svg {
    color: var(--second-color);
    width: 24px;
    height: 24px;
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
    left: 10px;
    width: 12px;
    height: 12px;
    border: 2px solid #fff;
  }
`;
