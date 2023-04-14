import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginToken, currentUser } from "../app/user";
import { authService } from "../fbase";
import { RootState } from "../app/store";
import { toast } from "react-hot-toast";

const useUserAccount = () => {
  const { loginToken: userLogin } = useSelector((state: RootState) => {
    return state.user;
  });
  const [isAuthModal, setIsAuthModal] = useState(false);
  const dispatch = useDispatch();

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
      toast.success("로그아웃 되었습니다.");
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
