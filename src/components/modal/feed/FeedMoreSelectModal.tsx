import React, { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import { Modal, Backdrop } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FeedType, replyType } from "../../../types/type";

type Props = {
  bgColor: string;
  modalOpen: boolean;
  modalClose: () => void;
  onFeedEditClick: () => void;
  onFeedDelete: () => void;
};

const FeedMoreSelectModal = (props: Props) => {
  const { bgColor, modalOpen, modalClose, onFeedEditClick, onFeedDelete } =
    props;

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={false}>
      <RangeBox bgColor={bgColor}>
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

const RangeBox = styled.div<{ bgColor: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 8px;
  border: 2px solid ${secondColor};
  width: 300px;
  background: #fff;
  box-shadow: 8px 8px 0 -2px ${(props) => props.bgColor}, 8px 8px ${secondColor};

  button:first-of-type {
    color: ${(props) => props.bgColor};
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
