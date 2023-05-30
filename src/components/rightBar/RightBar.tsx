import styled from "@emotion/styled";
import FollowListBox from "./FollowListBox";
import TagListBox from "./TagListBox";
import SearchBox from "./search/SearchBox";
import AuthFormModal from "../modal/auth/AuthFormModal";
import useUserAccount from "../../hooks/useUserAccount";

const RightBar = () => {
  const { isAuthModal, onAuthModal, onIsLogin } = useUserAccount();

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
