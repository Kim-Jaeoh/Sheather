import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import TagListBox from "../components/rightBar/TagListBox";
import SearchBox from "../components/rightBar/search/SearchBox";
import FollowListBox from "../components/rightBar/FollowListBox";
import useMediaScreen from "../hooks/useMediaScreen";

const RightBar = () => {
  const { isDesktop, isTablet, isMobile, isMobileBefore, RightBarNone } =
    useMediaScreen();

  return (
    <Container isDesktop={isDesktop} RightBarNone={RightBarNone}>
      <SearchBox />
      <TagListBox />
      <FollowListBox />
    </Container>
  );
};

export default RightBar;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.section<{
  isDesktop: boolean;
  RightBarNone: boolean;
}>`
  flex: 0 1 auto;
  width: ${(props) => (props.isDesktop ? `300px` : `250px`)};
  /* width: 300px; */
  height: 100vh;
  background: #fff;
  position: sticky;
  top: 0;
  border: 2px solid ${secondColor};
  border-left: none;
  padding: 20px;
  overflow: hidden;
  border-radius: 0 40px 40px 0;

  display: ${(props) => props.RightBarNone && `none`};
`;
