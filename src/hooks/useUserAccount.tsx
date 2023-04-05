import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginToken, currentUser } from "../app/user";
import { authService } from "../fbase";
import { RootState } from "../app/store";

const useUserAccount = () => {
  const { loginToken: userLogin } = useSelector((state: RootState) => {
    return state.user;
  });
  const [isAuthModal, setIsAuthModal] = useState(false);
  const dispatch = useDispatch();

  const onLogInState = () => {
    if (!userLogin) {
      setIsAuthModal(true);
    }
  };

  // 로그인 유무
  const onIsLogin = (callback: () => void) => {
    if (!userLogin) {
      setIsAuthModal(true);
    } else {
      callback();
    }
  };

  const onAuthModal = () => {
    setIsAuthModal((prev) => !prev);
  };

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃 하시겠어요?");
    if (ok) {
      authService.signOut();
      dispatch(loginToken(false));
      dispatch(
        currentUser({
          uid: "",
          createdAt: "",
          profileURL: "",
          email: "",
          name: "",
          displayName: "",
          description: "",
          bookmark: [],
          like: [],
          message: [],
          notice: [],
          follower: [],
          following: [],
        })
      );
      window.location.reload();
    }
  };

  return {
    isAuthModal,
    setIsAuthModal,
    onAuthModal,
    onIsLogin,
    onLogOutClick,
  };
};

export default useUserAccount;
