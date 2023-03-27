import React from "react";
import { useDispatch } from "react-redux";
import { loginToken, currentUser } from "../app/user";
import { authService } from "../fbase";

const useLogout = () => {
  const dispatch = useDispatch();

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
          follower: [],
          following: [],
        })
      );
      window.location.reload();
    }
  };

  return { onLogOutClick };
};

export default useLogout;
