import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { FeedType } from "../types/type";

const useToggleLike = () => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const queryClient = useQueryClient();

  // 좋아요
  const { mutate } = useMutation(
    (response: { id: string; like: { email: string; likedAt: number }[] }) =>
      axios.post("http://localhost:4000/api/like", response),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  const toggleLike = (res: FeedType) => {
    console.log(res);
    const copy = [...res.like];
    const findEmail = copy.filter((res) => res.email === userObj.email);
    const filter = copy.filter((res) => res.email !== userObj.email);
    if (!userObj.email) {
      return alert("로그인하기~~");
    }
    if (findEmail.length === 0) {
      mutate({
        id: res.id,
        like: [...copy, { email: userObj.email, likedAt: +new Date() }],
      });
    } else {
      mutate({
        id: res.id,
        like: filter,
      });
    }
  };

  return { toggleLike };
};

export default useToggleLike;
