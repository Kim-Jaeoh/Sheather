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
    const followingFilter = followingCopy.filter(
      (res) => res.followingId !== resEmail
    );
    const followerFilter = followerCopy.filter(
      (res) => res.followerId !== userObj.email
    );
    if (!userObj.email) {
      return alert("로그인하기~~");
    }
    if (
      userObj?.following.filter((res) => res.followingId === resEmail)
        .length !== 0
    ) {
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
        following: [
          ...followingCopy,
          { followingId: resEmail, followingAt: +new Date() },
        ],
      });
      // 상대방 팔로워에 본인 이름 추가
      await updateDoc(doc(dbService, "users", resEmail), {
        follower: [
          ...followerCopy,
          { followerId: resEmail, followerAt: +new Date() },
        ],
      });
      dispatch(
        currentUser({
          ...userObj,
          following: [
            ...followingCopy,
            { followingId: resEmail, followingAt: +new Date() },
          ],
        })
      );
    }
  };
  return { toggleFollow };
};

export default useToggleFollow;
