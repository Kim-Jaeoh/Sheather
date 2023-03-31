import React, { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import { Modal, Backdrop } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FeedType, replyType } from "../../../types/type";

type Props = {
  modalOpen: boolean;
  selectCategory: number;
  isDate: boolean;
  modalClose: () => void;
  setSelectCategory: React.Dispatch<React.SetStateAction<number>>;
  onSelectCategory2: () => void;
};

const MobileFeedCategoryModal = (props: Props) => {
  const {
    modalOpen,
    selectCategory,
    isDate,
    modalClose,
    setSelectCategory,
    onSelectCategory2,
  } = props;

  return (
    <Modal
      open={modalOpen}
      onClose={modalClose}
      disableScrollLock={false}
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <RangeBox>
        <Container>
          <Btn
            select={selectCategory}
            num={0}
            onClick={() => setSelectCategory(0)}
          >
            팔로잉
          </Btn>
          <Btn
            select={selectCategory}
            num={1}
            onClick={() => setSelectCategory(1)}
          >
            탐색
          </Btn>
          {/* <Btn select={isDate ? 2 : null} num={2} onClick={onSelectCategory2}>
            날짜별
          </Btn> */}
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
  top: 100px;
  /* top: 50%; */
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
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

const Btn = styled.button<{ num: number; select: number }>`
  width: 100%;
  height: 40px;
  padding: 4px 8px;
  font-size: 14px;
  color: ${secondColor};
  font-weight: ${(props) => (props.num === props.select ? `700` : `400`)};
  cursor: pointer;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${thirdColor};
  }
`;
