import React from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import Modal from "@mui/material/Modal";
import { IoMdClose } from "react-icons/io";
import MobileSearchBox from "../../rightBar/search/MobileSearchBox";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

const SearchModal = ({ modalOpen, modalClose }: Props) => {
  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={false}>
      <Container>
        <MobileSearchBox modalClose={modalClose} />
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
  overflow: hidden;
`;

const Header = styled.header`
  width: 100%;
  padding: 12px 16px;
  min-height: 52px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid ${thirdColor};
  position: relative;
`;

const Category = styled.div`
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
`;

const CloseBox = styled.button`
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: -12px;
  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
`;
