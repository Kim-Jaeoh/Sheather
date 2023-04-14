import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { ReplyPayload } from "../components/feed/detail/DetailFeedReplyBox";
import { CurrentUserType, FeedType, replyType } from "../types/type";
import { dbService } from "../fbase";
import { updateDoc, doc } from "firebase/firestore";
import useSendNoticeMessage from "./useSendNoticeMessage";

type Props = {
  feed: FeedType;
  userObj: CurrentUserType;
  userAccount: CurrentUserType;
  textRef: React.MutableRefObject<HTMLTextAreaElement>;
  getToken: string;
};

const useReply = ({ feed, userObj, userAccount, textRef, getToken }: Props) => {
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const { sendActions } = useSendNoticeMessage(feed);

  const noticeCopy = useMemo(() => {
    if (userAccount) {
      return [...userAccount?.notice];
    }
  }, [userAccount]);

  // 댓글 업로드
  const { mutate } = useMutation(
    (response: ReplyPayload) =>
      axios.post(`${process.env.REACT_APP_SERVER_PORT}/api/reply`, response),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  // 댓글 업로드
  const onReply = async (feed: FeedType) => {
    const replyId = `${feed.id}_${+new Date()}`; // 고유 값
    const copy = [...feed.reply];

    mutate({
      id: feed.id,
      reply: [
        ...copy,
        {
          postId: feed.id,
          replyId: replyId,
          email: userObj.email,
          displayName: userObj.displayName,
          text: replyText,
          time: +new Date(),
        },
      ],
    });

    if (userObj.displayName !== feed.displayName) {
      await updateDoc(doc(dbService, "users", userAccount.email), {
        notice: [
          ...noticeCopy,
          {
            type: "reply",
            postId: feed.id,
            replyId: replyId,
            imgUrl: feed.url[0],
            text: replyText,
            displayName: userObj.displayName,
            time: +new Date(),
            isRead: false,
          },
        ],
      });
    }

    // 알림 보내기
    if (getToken) {
      sendActions(`reply`, replyText);
    }

    setReplyText("");
    textRef.current.style.height = "24px";
  };

  // 댓글 삭제
  const { mutate: mutateReplyDelete } = useMutation(
    (response: ReplyPayload) =>
      axios.delete(
        `${process.env.REACT_APP_SERVER_PORT}/api/reply/${response.id}`,
        {
          data: response,
        }
      ),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  // 댓글 삭제
  const onReplyDelete = async (replyData: replyType) => {
    const filter = feed.reply.filter((info) => info.text !== replyData.text);
    const noticeFilter = noticeCopy.filter(
      (notice) =>
        notice.replyId !== replyData.replyId || notice.type !== "reply"
    );

    mutateReplyDelete({
      id: replyData.postId,
      reply: [...filter],
    });

    // 상대 알림에서 제거
    if (userObj.displayName !== feed.displayName) {
      console.log("제거");
      await updateDoc(doc(dbService, "users", userAccount.email), {
        notice: noticeFilter,
      });
    }
  };

  return { replyText, setReplyText, onReply, onReplyDelete };
};

export default useReply;
