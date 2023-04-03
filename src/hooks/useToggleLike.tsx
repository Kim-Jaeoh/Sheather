import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  updateDoc,
  doc,
  onSnapshot,
  getDocs,
  getDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { CurrentUserType, currentUser } from "../app/user";
import { dbService } from "../fbase";
import { FeedType, NoticeArrType } from "../types/type";

type props = {
  userAccount?: CurrentUserType;
};

const useToggleLike = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [userName, setUserName] = useState("");
  const [userAccount, setUserAccount] = useState<object>({});
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // // 계정 정보 가져오기
  // useEffect(() => {
  //   if (userName) {
  //     const unsubcribe = onSnapshot(
  //       doc(dbService, "users", userName),
  //       (doc) => {
  //         setUserAccount(doc.data() as any);
  //       }
  //     );
  //     return () => unsubcribe();
  //   }
  // }, [userName]);

  // // const querySnapshot = async (res: { displayName: string }) => {
  // //   const q = doc(dbService, "users", res.displayName);
  // //   const getdoc = await getDoc(q);
  // //   return setUserAccount(getdoc.data());
  // // };

  // firebase 계정에 추가
  const fbLike = async (res: FeedType) => {
    if (!userLogin) {
      return alert("로그인하기~~");
    }

    if (userObj.like?.includes(res.id)) {
      const copy = [...userObj.like];
      const filter = copy.filter((id) => id !== res.id);
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        like: filter,
      });

      // // 상대 알림에서 제거
      // await updateDoc(doc(dbService, "users", res.displayName), {
      //   notice: userAccount?.notice?.filter(
      //     (notice: NoticeArrType) => notice.postId !== res.id
      //   ),
      // });

      dispatch(
        currentUser({
          ...userObj,
          like: filter,
        })
      );
    } else {
      const copy = [res.id, ...userObj.like];
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        like: copy,
        // like: [...userObj.like, { postId: res.id, isRead: false }],
      });

      // // 상대 알림에 추가
      // const noticeCopy = [...userAccount?.notice];
      // await updateDoc(doc(dbService, "users", res.displayName), {
      //   notice: [
      //     ...noticeCopy,
      //     {
      //       type: "like",
      //       postId: res.id,
      //       displayName: userObj.displayName,
      //       time: +new Date(),
      //       profileURL: null,
      //       imgURL: res.url[0],
      //     },
      //   ],
      // });

      dispatch(
        currentUser({
          ...userObj,
          like: copy,
        })
      );
    }
  };

  // 좋아요 api mutate
  const { mutate } = useMutation(
    (response: {
      id: string;
      like: { displayName: string; time: number; postId: string }[];
    }) => axios.post("http://localhost:4000/api/like", response),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  const toggleLike = (res: FeedType) => {
    const copy = [...res.like];
    const findEmail = copy.filter(
      (res) => res.displayName === userObj.displayName
    );
    const filter = copy.filter(
      (res) => res.displayName !== userObj.displayName
    );
    if (!userObj.displayName) {
      return alert("로그인하기~~");
    }
    if (findEmail.length === 0) {
      mutate({
        id: res.id,
        like: [
          {
            displayName: userObj.displayName,
            time: +new Date(),
            postId: res.id,
            isRead: false,
          },
          ...copy,
        ],
      });
    } else {
      mutate({
        id: res.id,
        like: filter,
      });
    }
    fbLike(res);
    // setUserName(res.displayName);
  };

  return { toggleLike };
};

export default useToggleLike;
