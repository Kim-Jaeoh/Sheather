import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  CurrentUserType,
  FeedType,
  CommentType,
  replyType,
} from "../types/type";
import { dbService } from "../fbase";
import { updateDoc, doc } from "firebase/firestore";
import useSendNoticeMessage from "./useSendNoticeMessage";
import { toast } from "react-hot-toast";

type Props = {
  userObj: CurrentUserType;
  userAccount: CurrentUserType;
  commentData: CommentType;
  textRef: React.MutableRefObject<HTMLTextAreaElement>;
  getToken: string;
};

export type ReplyPayload = {
  commentId?: string;
  reply?: replyType;
};

const useReply = ({
  userObj,
  userAccount,
  commentData,
  textRef,
  getToken,
}: Props) => {
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const { sendActions } = useSendNoticeMessage(commentData);

  const noticeCopy = useMemo(() => {
    if (userAccount) {
      return [...userAccount?.notice];
    }
  }, [userAccount]);

  // 댓글 업로드
  const { mutate } = useMutation(
    (response: ReplyPayload) =>
      axios.patch(`${process.env.REACT_APP_SERVER_PORT}/api/reply`, response),
    {
      onSuccess: async () => {
        setReplyText("");
        textRef.current.style.height = "24px";
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  // 답글 업로드
  const onReply = async (comment: CommentType) => {
    const replyId = `${comment.commentId}_${+new Date()}`; // 고유 값
    const noticeId = `notice_${+new Date()}`; // 고유 값

    mutate({
      commentId: comment.commentId,

      reply: {
        postId: comment.postId,
        noticeId: noticeId,
        postImgUrl: comment.postImgUrl,
        commentId: comment.commentId,
        replyId: replyId,
        replyTagEmail: comment.email,
        email: userObj.email,
        displayName: userObj.displayName,
        text: replyText,
        time: +new Date(),
      },
    });
    console.log(comment);
    if (userObj.displayName !== comment.displayName) {
      await updateDoc(doc(dbService, "users", comment.email), {
        notice: [
          ...noticeCopy,
          {
            type: "reply",
            noticeId: noticeId,
            postId: comment.postId,
            commentId: comment.commentId,
            replyId: replyId,
            replyTagEmail: comment.email,
            postImgUrl: comment.postImgUrl,
            text: replyText,
            displayName: userObj.displayName,
            email: userObj.email,
            time: +new Date(),
            isRead: false,
          },
        ],
      });
    }

    // 알림 보내기
    if (getToken && commentData.displayName !== userObj.displayName) {
      sendActions(`reply`, replyText);
    }
  };

  // 댓글 삭제
  const { mutate: mutateReplyDelete } = useMutation(
    (response: ReplyPayload) =>
      axios.delete(
        `${process.env.REACT_APP_SERVER_PORT}/api/reply/${response.commentId}`,
        {
          data: response,
        }
      ),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["feed"]);
        toast.success("댓글이 삭제되었습니다.");
      },
    }
  );

  // 댓글 삭제
  const onReplyDelete = async (replyData: replyType) => {
    const ok = window.confirm("댓글을 삭제하시겠어요?");
    if (ok) {
      const noticeFilter = noticeCopy.filter(
        (notice) =>
          notice.replyId !== replyData.replyId || notice.type !== "reply"
      );
      console.log(replyData);
      mutateReplyDelete({
        commentId: replyData.commentId,
        reply: replyData,
      });

      // 상대 알림에서 제거
      if (userObj.displayName !== replyData?.displayName) {
        await updateDoc(doc(dbService, "users", replyData.replyTagEmail), {
          notice: noticeFilter,
        });
      }
    }
  };

  return { replyText, setReplyText, onReply, onReplyDelete };
};

export default useReply;
