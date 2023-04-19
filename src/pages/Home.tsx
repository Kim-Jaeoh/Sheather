import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import FeedPost from "../components/feed/FeedPost";
import SortFeedCategory from "../components/feed/SortFeedCategory";
import AuthFormModal from "../components/modal/auth/AuthFormModal";
import useUserAccount from "../hooks/useUserAccount";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import ColorList from "../assets/data/ColorList";
import FollowCategoryList from "../components/explore/FollowCategoryList";

declare global {
  interface Window {
    registration: any;
  }
}
const Home = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const { isAuthModal, onAuthModal, setIsAuthModal, onIsLogin, onLogOutClick } =
    useUserAccount();

  // 팔로잉 목록 담기
  const followArr = useMemo(() => {
    let arr: string[] = [];
    userObj.following.forEach((res) => arr.push(res.displayName));
    return arr;
  }, [userObj.following]);

  const [url, setUrl] = useState(
    `${process.env.REACT_APP_SERVER_PORT}/api/feed/following/recent?users=${followArr}&`
  );

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      <Container>
        <Box>
          <SortFeedCategory url={url} setUrl={setUrl} />
          {userObj?.displayName || userObj?.following?.length !== 0 ? (
            <FeedPost url={url} onIsLogin={onIsLogin} />
          ) : (
            <NotInfoBox>
              <FollowCategoryList />
            </NotInfoBox>
          )}
        </Box>
      </Container>
    </>
  );
};
export default Home;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ff5673;
  overflow: hidden;

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 767px) {
    background: #fff;
    padding: 16px;
    border: 1px solid #222;
    border-radius: 20px;
    box-shadow: ${(props) => {
      let shadow = "";
      for (let i = 1; i < 63; i++) {
        shadow += `#be374e ${i}px ${i}px,`;
      }
      shadow += `#be374e 63px 63px`;
      return shadow;
    }};
  }
`;

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  animation-name: slideDown;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const NotInfo = styled.span`
  color: ${secondColor};
`;
