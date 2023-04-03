import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import { Modal } from "@mui/material";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
  onFeedEditClick: () => void;
  onFeedDelete: () => void;
};

const FeedMoreSelectModal = (props: Props) => {
  const { modalOpen, modalClose, onFeedEditClick, onFeedDelete } = props;

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={false}>
      <RangeBox>
        <Container>
          <ResetBtn onClick={onFeedDelete}>삭제</ResetBtn>
          <DoneBtn onClick={onFeedEditClick}>수정</DoneBtn>
        </Container>
      </RangeBox>
    </Modal>
  );
};

export default FeedMoreSelectModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const RangeBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 20px;
  border: 2px solid ${secondColor};
  width: 300px;
  background: #fff;
  box-shadow: 8px 8px 0 -2px #ff5673, 8px 8px ${secondColor};

  button:first-of-type {
    color: #ff5673;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResetBtn = styled.button`
  width: 100%;
  min-height: 60px;
  padding: 4px 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${thirdColor};
  }
`;

const DoneBtn = styled(ResetBtn)`
  color: ${secondColor};
  font-weight: 400;
`;
