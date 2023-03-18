import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";
import TagListBox from "../components/rightBar/TagListBox";
import SearchBox from "../components/search/SearchBox";
import FollowListBox from "../components/rightBar/FollowListBox";

const RightBar = () => {
  return (
    <Container>
      <SearchBox />
      <TagListBox />
      <FollowListBox />
    </Container>
  );
};

export default RightBar;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.section`
  flex: 0 1 auto;
  width: 300px;
  height: 100vh;
  background: #fff;
  position: sticky;
  top: 0;
  border: 2px solid ${secondColor};
  padding: 20px;
  border-radius: 0 40px 40px 0;
`;
