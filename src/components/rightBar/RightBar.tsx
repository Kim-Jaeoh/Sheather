import styled from "@emotion/styled";
import FollowListBox from "./FollowListBox";
import TagListBox from "./TagListBox";
import SearchBox from "./search/SearchBox";
import AuthFormModal from "../modal/auth/AuthFormModal";
import useUserAccount from "../../hooks/useUserAccount";

const RightBar = () => {
  const { isAuthModal, setIsAuthModal, onAuthModal, onIsLogin, onLogOutClick } =
    useUserAccount();

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      <Container>
        <SearchBox />
        <TagListBox />
        <FollowListBox onIsLogin={onIsLogin} />
      </Container>
    </>
  );
};

export default RightBar;

const Container = styled.section`
  flex: 0 1 auto;
  width: 300px;
  height: 100vh;
  background: #fff;
  position: sticky;
  top: 0;
  border: 2px solid var(--second-color);
  border-left: none;
  padding: 20px;
  overflow: hidden;
  border-radius: 0 40px 40px 0;

  @media (max-width: 956px) {
    display: none;
  }

  @media (max-width: 767px) {
    width: 250px;
  }
`;

const CircleBox = styled.div`
  position: absolute;
  bottom: -120px;
  right: -400px;
  width: 300px;
  height: 300px;
  background: #222;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Circle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyCircle = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;

  background-color: #ddd;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E");
`;

const Text = styled.p`
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  font-weight: bold;
  font-size: 28px;

  animation: rotate 15s linear infinite;

  @keyframes rotate {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
