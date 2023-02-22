import { updateDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";

const useToggleBookmark = () => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });

  const dispatch = useDispatch();

  const toggleBookmark = async (resId: string) => {
    if (!userObj.email) {
      return alert("로그인하기~~");
    }
    if (userObj.bookmark?.includes(resId)) {
      const copy = [...userObj.bookmark];
      const filter = copy.filter((id) => id !== resId);
      await updateDoc(doc(dbService, "users", userObj.email), {
        bookmark: filter,
      });
      dispatch(
        currentUser({
          ...userObj,
          bookmark: filter,
        })
      );
    } else {
      const copy = [...userObj.bookmark];
      copy.push(resId);
      await updateDoc(doc(dbService, "users", userObj.email), {
        bookmark: copy,
      });
      dispatch(
        currentUser({
          ...userObj,
          bookmark: copy,
        })
      );
    }
  };
  return { toggleBookmark };
};

export default useToggleBookmark;
