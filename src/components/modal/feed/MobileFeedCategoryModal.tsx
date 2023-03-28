import React, { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import { Modal, Backdrop } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FeedType, replyType } from "../../../types/type";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
  setSelectCategory: React.Dispatch<React.SetStateAction<number>>;
  onSelectCategory2: () => void;
};

const MobileFeedCategoryModal = (props: Props) => {
  const { modalOpen, modalClose, setSelectCategory, onSelectCategory2 } = props;

  return (
    <Modal
      open={modalOpen}
      onClose={modalClose}
      disableScrollLock={false}
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <RangeBox>
        <Container>
          <ResetBtn onClick={() => setSelectCategory(0)}>최신</ResetBtn>
          <DoneBtn onClick={() => setSelectCategory(1)}>인기</DoneBtn>
          <DoneBtn onClick={onSelectCategory2}>날짜별</DoneBtn>
        </Container>
      </RangeBox>
    </Modal>
  );
};

export default MobileFeedCategoryModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const RangeBox = styled.div`
  position: absolute;
  width: 100px;
  right: 16px;
  top: 90px;
  z-index: 100;
  border-radius: 20px;
  border: 1px solid ${thirdColor};
  background: #fff;
  outline: none;
  filter: drop-shadow(0px 0px 4px #22222222);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResetBtn = styled.button`
  width: 100%;
  height: 40px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${thirdColor};
  }
`;

const DoneBtn = styled(ResetBtn)`
  color: ${secondColor};
  font-weight: 400;
`;
