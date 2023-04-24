import React from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/data/ColorList";
import Modal from "@mui/material/Modal";
import MobileSearchBox from "../../rightBar/search/MobileSearchBox";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

const SearchModal = ({ modalOpen, modalClose }: Props) => {
  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={false}>
      <Container>
        <MobileSearchBox modalOpen={modalOpen} modalClose={modalClose} />
      </Container>
    </Modal>
  );
};

export default SearchModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  transform: translate(0, 0);
  color: ${secondColor};
  background: #fff;
  outline: none;
  overflow-y: auto;
`;
