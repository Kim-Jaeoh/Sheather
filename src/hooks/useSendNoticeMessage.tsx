import { useCallback, useEffect, useState } from "react";
import { CurrentUserType, FeedType, CommentType } from "../types/type";

import { doc, getDoc } from "firebase/firestore";
import { dbService, saveMessagingDeviceToken } from "../fbase";
import useThrottle from "./useThrottle";
import axios, { AxiosRequestConfig } from "axios";
import useGetMyAccount from "./useGetMyAccount";
import { debounce, throttle } from "lodash";

interface PostData {
  message: string;
  token: string;
  link?: string;
}

const useSendNoticeMessage = (
  users: CurrentUserType | FeedType | CommentType
) => {
  // const { throttle } = useThrottle();
  const [getToken, setGetToken] = useState(null);
  const { userObj } = useGetMyAccount();

  // 상대방 기기 토큰값 가져오기
  useEffect(() => {
    if (users?.email) {
      const querySnapshot = async () => {
        const getdoc = await getDoc(doc(dbService, "fcmTokens", users?.email));
        setGetToken(getdoc?.data()?.fcmToken);
      };
      querySnapshot();
    }
  }, [users?.email]);

  // 메세지 알림 보내기
  const sendMessage = async (text: string, link: string) => {
    if (getToken) {
      throttle(() => {
        saveMessagingDeviceToken(users?.email);
      }, 300);

      const config: AxiosRequestConfig<PostData> = {
        data: {
          message: `${userObj?.displayName}님이 메시지를 보냈습니다. : ${text}`,
          token: getToken,
          link,
        },
      };

      await axios
        .post(`${process.env.REACT_APP_SERVER_PORT}/api/push_send`, config)
        .then((e) => {
          console.log("성공 ", e);
        })
        .catch((e) => console.log("에러 ", e));
    }
  };

  // 팔로우, 좋아요, 댓글 알림 보내기
  const sendActions = throttle(
    async (type: string, text?: string, link?: string) => {
      if (getToken) {
        let noticeText: string = "";

        if (type === "like") {
          noticeText = `${userObj.displayName}님이 회원님의 게시물을 좋아합니다.`;
        }
        if (type === "comment") {
          noticeText = `${userObj.displayName}님이 회원님의 게시물에 댓글을 남겼습니다. : ${text}`;
        }
        if (type === "reply") {
          noticeText = `${userObj.displayName}님이 회원님의 게시물에 답글을 남겼습니다. : ${text}`;
        }
        if (type === "follower") {
          noticeText = `${userObj.displayName}님이 회원님을 팔로우하기 시작했습니다.`;
        }

        saveMessagingDeviceToken(users?.email);

        const config: AxiosRequestConfig<PostData> = {
          data: {
            message: noticeText,
            token: getToken,
            link: link,
          },
        };
        await axios
          .post(`${process.env.REACT_APP_SERVER_PORT}/api/push_send`, config)
          .then((e) => {
            console.log("성공 ", e);
          })
          .catch((e) => console.log("에러 ", e));
      }
    },
    300
  );

  return { getToken, sendMessage, sendActions };
};

export default useSendNoticeMessage;
