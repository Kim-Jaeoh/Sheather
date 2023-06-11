import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { updateDoc, doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { currentUser } from "../../app/user";
import { dbService } from "../../fbase";
import { CurrentUserType, FeedType } from "../../types/type";
import useSendNoticeMessage from "./useSendNoticeMessage";
import useThrottle from "../useThrottle";

type props = {
  user: CurrentUserType;
};

interface LikeType {
  id: string;
  like: {
    displayName: string;
    time: number;
    postId: string;
    email: string;
  }[];
}

const useToggleLike = ({ user }: props) => {
  const { isLoggedIn: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { getToken, sendActions } = useSendNoticeMessage(user);
  const { throttle } = useThrottle();

  // firebase 계정에 추가
  const fbLike = async (feed: FeedType) => {
    const likeCopy = [...userObj.like];
    const likeFilter = likeCopy.filter((id) => id !== feed.id);
    const noticeCopy = [...user?.notice];
    const noticeFilter = noticeCopy.filter(
      (notice) => notice.postId !== feed.id && notice.type !== "like"
    );

    if (!userLogin) {
      return alert("로그인을 해주세요.");
    }

    if (userObj.like?.includes(feed.id)) {
      await updateDoc(doc(dbService, "users", userObj.email), {
        like: likeFilter,
      });

      // 상대 알림에서 제거
      if (userObj.displayName !== feed.displayName) {
        await updateDoc(doc(dbService, "users", user?.email), {
          notice: noticeFilter,
        });
      }
    } else {
      await updateDoc(doc(dbService, "users", userObj.email), {
        like: [...likeCopy, feed.id],
      });

      // 상대 알림에 추가
      if (userObj.displayName !== feed.displayName) {
        await updateDoc(doc(dbService, "users", user?.email), {
          notice: [
            ...noticeCopy,
            {
              type: "like",
              noticeId: `notice_${+new Date()}`,
              postId: feed.id,
              commentId: null,
              replyId: null,
              replyTagEmail: null,
              postImgUrl: feed.url[0],
              text: null,
              displayName: userObj.displayName,
              email: userObj.email,
              time: +new Date(),
              isRead: false,
            },
          ],
        });
      }
    }
  };

  // 좋아요 api mutate
  const { mutate } = useMutation(
    (response: LikeType) =>
      axios.post(`${process.env.REACT_APP_SERVER_PORT}/api/like`, response),
    {
      onMutate: async (res) => {
        await queryClient.cancelQueries(["feed"]);

        const previousResponse = queryClient.getQueryData(["feed"]);

        queryClient.setQueryData(["feed"], (old: FeedType[]) => {
          if (!old) {
            return [];
          }
          const filter = old.filter((oldRes) => oldRes.id === res.id);
          filter[0].like = res.like;
        });

        return { previousResponse };
      },
      onError: (err, res, context) => {
        queryClient.setQueryData(["feed"], context?.previousResponse);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  const toggleLike = (feed: FeedType) => {
    const copy = [...feed?.like];
    const findEmail = copy.filter(
      (res) => res.displayName === userObj.displayName
    );
    const filter = copy.filter(
      (res) => res.displayName !== userObj.displayName
    );
    const likeCopy = [...userObj.like];
    const likeFilter = likeCopy.filter((id) => id !== feed?.id);

    if (!userObj.displayName) {
      return alert("로그인을 해주세요.");
    }
    if (findEmail.length === 0) {
      mutate({
        id: feed?.id,
        like: [
          {
            displayName: userObj.displayName,
            time: +new Date(),
            postId: feed?.id,
            email: userObj.email,
          },
          ...copy,
        ],
      });

      dispatch(
        currentUser({
          ...userObj,
          like: [...likeCopy, feed?.id],
        })
      );

      // 알림 보내기
      if (getToken && user?.displayName !== userObj.displayName) {
        throttle(() => {
          sendActions(
            `like`,
            null,
            `${process.env.REACT_APP_PUBLIC_URL}/feed/detail/${feed?.id}`
          );
        }, 5000);
      }
    } else {
      mutate({
        id: feed?.id,
        like: filter,
      });

      dispatch(
        currentUser({
          ...userObj,
          like: likeFilter,
        })
      );
    }
    fbLike(feed);
  };

  return { toggleLike };
};

export default useToggleLike;
