import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReplyPayload } from "../components/feed/detail/DetailFeedReplyBox";
import { FeedType, replyType } from "../types/type";
import { CurrentUserType } from "../app/user";
import { dbService } from "../fbase";
import { updateDoc, doc } from "firebase/firestore";

type Props = {
  res: FeedType;
  userObj: CurrentUserType;
  userAccount: CurrentUserType;
  textRef: React.MutableRefObject<HTMLTextAreaElement>;
};

const useReply = ({ res, userObj, userAccount, textRef }: Props) => {
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();

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
  const onReply = async (res: FeedType) => {
    const replyId = `${res.id}_${+new Date()}`; // 고유 값
    const copy = [...res.reply];

    mutate({
      id: res.id,
      reply: [
        ...copy,
        {
          postId: res.id,
          replyId: replyId,
          email: userObj.email,
          displayName: userObj.displayName,
          text: replyText,
          time: +new Date(),
        },
      ],
    });

    if (userObj.displayName !== res.displayName) {
      await updateDoc(doc(dbService, "users", res.displayName), {
        notice: [
          ...noticeCopy,
          {
            type: "reply",
            postId: res.id,
            replyId: replyId,
            imgUrl: res.url[0],
            text: replyText,
            displayName: userObj.displayName,
            time: +new Date(),
            isRead: false,
          },
        ],
      });
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
    const filter = res.reply.filter((info) => info.text !== replyData.text);
    const noticeFilter = noticeCopy.filter(
      (notice) =>
        notice.replyId !== replyData.replyId || notice.type !== "reply"
    );

    mutateReplyDelete({
      id: replyData.postId,
      reply: [...filter],
    });

    // 상대 알림에서 제거
    if (userObj.displayName !== res.displayName) {
      console.log("제거");
      await updateDoc(doc(dbService, "users", res.displayName), {
        notice: noticeFilter,
      });
    }
  };

  return { replyText, setReplyText, onReply, onReplyDelete };
};

export default useReply;
