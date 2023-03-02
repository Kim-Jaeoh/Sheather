import styled from "@emotion/styled";
import ColorList from "../assets/ColorList";

type Props = {};

const Message = (props: Props) => {
  return <Container>Message</Container>;
};

export default Message;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();
const Container = styled.div`
  border-top: 2px solid ${secondColor};
`;
