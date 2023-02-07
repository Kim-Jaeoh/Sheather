import React from "react";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import ColorList from "../../../assets/ColorList";

type Props = {
  openModal: boolean;
  closeModal: () => void;
};

const FeedModal = ({ openModal, closeModal }: Props) => {
  return (
    <Modal open={openModal} onClose={closeModal} disableScrollLock={false}>
      <Container>
        <Header>하이</Header>
      </Container>
    </Modal>
  );
};

export default FeedModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  width: 480px;
  height: 700px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  /* overflow: auto; */
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${mainColor}, 12px 12px ${secondColor};
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.header`
  height: 52px;
  display: flex;
  align-items: center;
  border-radius: 12px 12px 0 0;
  border-bottom: 2px solid ${thirdColor};
  padding: 0 12px;
  position: sticky;
  background: rgba(255, 255, 255, 0.808);
  top: 0px;
  z-index: 10;
`;
