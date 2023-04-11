import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { updateDoc, doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";
import { CurrentUserType, FeedType } from "../types/type";

type props = {
  user: CurrentUserType;
};

const useToggleLike = ({ user }: props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // firebase 계정에 추가
  const fbLike = async (res: FeedType) => {
    const likeCopy = [...userObj.like];
    const likeFilter = likeCopy.filter((id) => id !== res.id);
    const noticeCopy = [...user?.notice];
    const noticeFilter = noticeCopy.filter(
      (notice) => notice.postId !== res.id && notice.type !== "like"
    );

    if (!userLogin) {
      return alert("로그인을 해주세요");
    }

    if (userObj.like?.includes(res.id)) {
      await updateDoc(doc(dbService, "users", userObj.email), {
        like: likeFilter,
      });

      // 상대 알림에서 제거
      if (userObj.displayName !== res.displayName) {
        await updateDoc(doc(dbService, "users", user.email), {
          notice: noticeFilter,
        });
      }

      dispatch(
        currentUser({
          ...userObj,
          like: likeFilter,
        })
      );
    } else {
      await updateDoc(doc(dbService, "users", userObj.email), {
        like: [...likeCopy, res.id],
      });

      // 상대 알림에 추가
      if (userObj.displayName !== res.displayName) {
        await updateDoc(doc(dbService, "users", user.email), {
          notice: [
            ...noticeCopy,
            {
              type: "like",
              postId: res.id,
              imgUrl: res.url[0],
              text: null,
              displayName: userObj.displayName,
              time: +new Date(),
              isRead: false,
            },
          ],
        });
      }

      dispatch(
        currentUser({
          ...userObj,
          like: [...likeCopy, res.id],
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
      return alert("로그인을 해주세요.");
    }
    if (findEmail.length === 0) {
      mutate({
        id: res.id,
        like: [
          {
            displayName: userObj.displayName,
            time: +new Date(),
            postId: res.id,
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
  };

  return { toggleLike };
};

export default useToggleLike;
