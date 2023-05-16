import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import useMediaScreen from "../../../hooks/useMediaScreen";
import toast from "react-hot-toast";
import useGetMyAccount from "../../../hooks/useGetMyAccount";
import { CurrentUserType } from "../../../types/type";
import { updateDoc, doc } from "firebase/firestore";
import { dbService } from "../../../fbase";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../../../app/user";
import { RootState } from "../../../app/store";
import { VscBell } from "react-icons/vsc";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

const ProfileSettingModal = (props: Props) => {
  const { modalOpen, modalClose } = props;
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const { myAccount } = useGetMyAccount();
  const { isMobile } = useMediaScreen();
  const dispatch = useDispatch();

  const onToggleNotification = useCallback(async () => {
    // 알림 on
    if (!myAccount?.notification) {
      await updateDoc(doc(dbService, "users", myAccount?.email), {
        notification: true,
      }).then(() => {
        dispatch(
          currentUser({
            ...userObj,
            notification: true,
          })
        );

        toast.success("알림이 설정되었습니다.", {
          id: `setOn`, // 중복 방지
        });
      });
    } else {
      // 알림 off
      await updateDoc(doc(dbService, "users", myAccount?.email), {
        notification: false,
      }).then(() => {
        dispatch(
          currentUser({
            ...userObj,
            notification: false,
          })
        );

        toast.success("알림이 해제되었습니다.", {
          id: `setOff`,
        });
      });
    }
  }, [dispatch, myAccount?.email, myAccount?.notification, userObj]);

  return (
    <Modal
      open={modalOpen}
      onClose={modalClose}
      disableScrollLock={false}
      // BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <RangeBox isMobile={isMobile}>
        <Header>
          <p>설정</p>
          <IconBox onClick={modalClose} style={{ marginLeft: "auto" }}>
            <IoMdClose />
          </IconBox>
        </Header>

        <Container>
          <Icon>
            <VscBell />
            <span>알림</span>
          </Icon>
          <SwitchBox>
            <Switch
              onClick={onToggleNotification}
              IsNotification={myAccount?.notification}
            >
              <SwitchCircle IsNotification={myAccount?.notification} />
              <SwitchBar IsNotification={myAccount?.notification} />
            </Switch>
          </SwitchBox>
        </Container>
      </RangeBox>
    </Modal>
  );
};

export default ProfileSettingModal;

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
    font-size: 16px;
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
    /* padding: 8px; */
  }
`;

const Container = styled.div`
  padding: 20px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const SwitchBox = styled.div`
  width: 46px;
  height: 26px;
  position: absolute;
  right: 20px;
`;

const SwitchInput = styled.input`
  /* display: none; */
`;

const Switch = styled.div<{ IsNotification: boolean }>`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  height: 100%;
  /* padding: 12px 10px; */
  cursor: pointer;
`;

const SwitchCircle = styled.span<{ IsNotification: boolean }>`
  display: inline-block;
  position: absolute;
  left: ${(props) => (props.IsNotification ? `26px` : `4px`)};
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background-color: ${(props) =>
    props.IsNotification ? `var(--profile-color)` : `rgb(34 34 34 / 50%)`};
  border: ${(props) =>
    !props.IsNotification && "1px solid var(--fourth-color)"};
  /* box-shadow: 0px 0px 5px -1px #4d4d4d; */
  transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover::before {
    display: block;
    content: "";
    width: 22px;
    height: 22px;
    opacity: 0.2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    border-radius: 999px;
    background-color: ${(props) =>
      props.IsNotification ? `var(--profile-color)` : `var(--third-color)`};
  }
`;

const SwitchBar = styled.span<{ IsNotification: boolean }>`
  display: inline-block;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  border: 2px solid
    ${(props) =>
      props.IsNotification ? `var(--profile-color)` : `var(--third-color)`};
  z-index: -1;
  opacity: 0.5;
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const Icon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:first-of-type {
  }

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--third-color);
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
`;
