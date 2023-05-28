import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  CurrentUserType,
  CommentType,
  replyType,
  NoticeArrType,
} from "../types/type";
import { dbService } from "../fbase";
import { updateDoc, doc } from "firebase/firestore";
import useSendNoticeMessage from "./useSendNoticeMessage";
import { toast } from "react-hot-toast";
import useThrottle from "./useThrottle";
import { useNavigate } from "react-router-dom";

type Props = {
  userObj: CurrentUserType;
  userAccount: CurrentUserType;
  commentData: CommentType;
  textRef: React.MutableRefObject<HTMLTextAreaElement>;
  getToken: string;
};

export type ReplyPayload = {
  commentId: string;
  reply: replyType;
};

const useReply = ({
  userObj,
  userAccount,
  commentData,
  textRef,
  getToken,
}: Props) => {
  const [replyText, setReplyText] = useState("");
  const [noticeCopy, setNoticeCopy] = useState<NoticeArrType[]>([]);
  const queryClient = useQueryClient();
  const { sendActions } = useSendNoticeMessage(commentData);
  const { throttle } = useThrottle();
  const navigate = useNavigate();

  useEffect(() => {
    if (userAccount) {
      setNoticeCopy([...userAccount?.notice]);
    }
  }, [userAccount]);

  // 답글 업로드
  const { mutate } = useMutation(
    (response: ReplyPayload) =>
      axios.post(`${process.env.REACT_APP_SERVER_PORT}/api/reply`, response),
    {
      onSuccess: async () => {
        setReplyText("");
        textRef.current.style.height = "24px";
        queryClient.invalidateQueries(["feed"]);
      },
      onError: () => {
        toast.error("댓글이 삭제되었거나 찾을 수 없습니다.");
        navigate("/");
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
      throttle(
        () =>
          sendActions(
            `reply`,
            replyText,
            `${process.env.REACT_APP_PUBLIC_URL}/feed/detail/${comment.postId}`
          ),
        5000
      );
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
        toast.success("답글이 삭제되었습니다.");
      },
    }
  );

  // 댓글 삭제
  const onReplyDelete = async (replyData: replyType) => {
    const ok = window.confirm("답글을 삭제하시겠어요?");
    if (ok) {
      const noticeFilter = noticeCopy.filter(
        (notice) =>
          notice.replyId !== replyData.replyId && notice.type !== "reply"
      );
      mutateReplyDelete({
        commentId: replyData.commentId,
        reply: replyData,
      });

      await updateDoc(doc(dbService, "users", replyData.replyTagEmail), {
        notice: noticeFilter,
      });
    }
  };

  return { replyText, setReplyText, onReply, onReplyDelete };
};

export default useReply;
