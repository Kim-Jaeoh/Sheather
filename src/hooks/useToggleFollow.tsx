import { updateDoc, doc } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";

const useToggleFollow = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  const dispatch = useDispatch();

  const toggleFollow = async (resDpName: string) => {
    const followingCopy = [...userObj.following];
    const followerCopy = [...userObj.follower];
    const followingFilter = followingCopy.filter(
      (res) => res.displayName !== resDpName
    );
    const followerFilter = followerCopy.filter(
      (res) => res.displayName !== userObj.displayName
    );
    if (!userLogin) {
      return alert("로그인하기~~");
    }
    if (
      userObj.following.filter((res) => res.displayName === resDpName)
        .length !== 0
    ) {
      // 본인 팔로잉에 상대방 이름 제거
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        following: followingFilter,
      });
      // 상대방 팔로워에 본인 이름 제거
      await updateDoc(doc(dbService, "users", resDpName), {
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
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        following: [
          { displayName: resDpName, time: +new Date() },
          ...followingCopy,
        ],
      });
      // 상대방 팔로워에 본인 이름 추가
      await updateDoc(doc(dbService, "users", resDpName), {
        follower: [
          { displayName: userObj.displayName, time: +new Date() },
          ...followerCopy,
        ],
      });
      dispatch(
        currentUser({
          ...userObj,
          following: [
            { displayName: resDpName, time: +new Date() },
            ...followingCopy,
          ],
        })
      );
    }
  };

  return { toggleFollow };
};

export default useToggleFollow;
