import { updateDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";

const useToggleFollow = () => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });

  const dispatch = useDispatch();

  const toggleFollow = async (resEmail: string) => {
    const followingCopy = [...userObj.following];
    const followerCopy = [...userObj.follower];
    const followingFilter = followingCopy.filter((res) => res.id !== resEmail);
    const followerFilter = followerCopy.filter(
      (res) => res.id !== userObj.email
    );
    if (!userObj.email) {
      return alert("로그인하기~~");
    }
    if (userObj?.following.filter((res) => res.id === resEmail).length !== 0) {
      // 본인 팔로잉에 상대방 이름 제거
      await updateDoc(doc(dbService, "users", userObj.email), {
        following: followingFilter,
      });
      // 상대방 팔로워에 본인 이름 제거
      await updateDoc(doc(dbService, "users", resEmail), {
        follower: followerFilter,
      });
      dispatch(
        currentUser({
          ...userObj,
          following: followingFilter,
        })
      );
    } else {
      // 본인 팔로잉에 상대방 이름 추가
      await updateDoc(doc(dbService, "users", userObj.email), {
        following: [{ id: resEmail, time: +new Date() }, ...followingCopy],
      });
      // 상대방 팔로워에 본인 이름 추가
      await updateDoc(doc(dbService, "users", resEmail), {
        follower: [{ id: userObj.email, time: +new Date() }, ...followerCopy],
      });
      dispatch(
        currentUser({
          ...userObj,
          following: [{ id: resEmail, time: +new Date() }, ...followingCopy],
        })
      );
    }
  };
  return { toggleFollow };
};

export default useToggleFollow;
