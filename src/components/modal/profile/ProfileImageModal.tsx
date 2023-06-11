import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import useMediaScreen from "../../../hooks/useMediaScreen";
import toast from "react-hot-toast";
import useGetMyAccount from "../../../hooks/useGetMyAccount";
import { updateDoc, doc } from "firebase/firestore";
import { dbService } from "../../../fbase";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../../../app/user";
import { RootState } from "../../../app/store";
import { VscBell } from "react-icons/vsc";

type Props = {
  modalOpen: boolean;
  // isChangeImage: boolean;
  modalClose: () => void;
  // changeImage: () => void;
  deleteImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const ProfileImageModal = (props: Props) => {
  const {
    modalOpen,
    // isChangeImage,
    modalClose,
    // changeImage,
    deleteImage,
    onFileChange,
  } = props;
  const { isMobile } = useMediaScreen();
  const [isChangeImage, setisChangeImage] = useState(false);

  const changeImage = () => {
    setisChangeImage(true);
  };

  return (
    <Modal
      open={modalOpen}
      onClose={modalClose}
      disableScrollLock={false}
      // BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <RangeBox isMobile={isMobile}>
        <Header>
          <p>프로필 사진 바꾸기</p>
          <IconBox onClick={modalClose} style={{ marginLeft: "auto" }}>
            <IoMdClose />
          </IconBox>
        </Header>

        <Container>
          <ChangeLabel
            htmlFor="attach-file"
            style={{ color: `var(--profile-color)` }}
            onClick={changeImage}
          >
            사진 변경
          </ChangeLabel>
          {isChangeImage && (
            <InputImage
              id="attach-file"
              accept="image/*"
              type="file"
              onChange={onFileChange}
            />
          )}
          <Btn style={{ color: `#ff4141` }} onClick={deleteImage}>
            사진 삭제
          </Btn>
        </Container>
      </RangeBox>
    </Modal>
  );
};

export default ProfileImageModal;

const RangeBox = styled.div<{ isMobile: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 20px;
  border: 2px solid var(--second-color);
  width: 300px;
  background: #fff;
  box-shadow: 8px 8px 0 -2px var(--profile-color), 8px 8px var(--second-color);
  overflow: hidden;
  outline: none;

  @media (max-width: 767px) {
    width: 300px;
    border-width: 1px;
    box-shadow: 6px 6px 0 -1px var(--profile-color), 6px 6px var(--second-color);
  }
`;

const Header = styled.header`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  position: relative;
  p {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    font-size: 14px;
    user-select: none;
  }

  overflow: hidden;
  border-bottom: 1px solid var(--third-color);

  @media (max-width: 767px) {
    p {
      font-size: 14px;
    }
  }
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ChangeLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 54px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  border-bottom: 1px solid var(--fourth-color);
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const Btn = styled.button`
  width: 100%;
  height: 50px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const InputImage = styled.input`
  display: none;
  opacity: 0;
`;
