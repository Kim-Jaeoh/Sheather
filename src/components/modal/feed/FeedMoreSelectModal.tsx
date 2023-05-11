import styled from "@emotion/styled";
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

const RangeBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 20px;
  border: 2px solid var(--second-color);
  width: 300px;
  background: #fff;
  box-shadow: 8px 8px 0 -2px var(--feed-color), 8px 8px var(--second-color);

  button:first-of-type {
    color: var(--feed-color);
  }

  @media (max-width: 767px) {
    width: 180px;
    border-width: 1px;
    box-shadow: 6px 6px 0 -1px var(--feed-color), 6px 6px var(--second-color);
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
  height: 60px;
  padding: 4px 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  &:not(:last-of-type) {
    border-bottom: 1px solid var(--third-color);
  }
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const DoneBtn = styled(ResetBtn)`
  color: var(--second-color);
  font-weight: 400;
`;
