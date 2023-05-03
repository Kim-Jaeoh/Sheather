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
  feed: FeedType;
  userObj: CurrentUserType;
  userAccount: CurrentUserType;
  textRef: React.MutableRefObject<HTMLTextAreaElement>;
  getToken: string;
};

export type CommentPayload = {
  id?: string;
  comment?: CommentType[];
};

const useComment = ({
  feed,
  userObj,
  userAccount,
  textRef,
  getToken,
}: Props) => {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const { sendActions } = useSendNoticeMessage(feed);

  const noticeCopy = useMemo(() => {
    if (userAccount) {
      return [...userAccount?.notice];
    }
  }, [userAccount]);

  // 댓글 업로드
  const { mutate } = useMutation(
    (response: CommentPayload) =>
      axios.post(`${process.env.REACT_APP_SERVER_PORT}/api/comment`, response),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["feed"]);
        setCommentText("");
        textRef.current.style.height = "24px";
      },
    }
  );

  // 댓글 업로드
  const onComment = async (feed: FeedType) => {
    const commentId = `${feed.id}_${+new Date()}`; // 고유 값
    const noticeId = `notice_${+new Date()}`; // 고유 값
    const copy = [...feed.comment];

    mutate({
      id: feed.id,
      comment: [
        ...copy,
        {
          postId: feed.id,
          postImgUrl: feed.url[0],
          commentId: commentId,
          noticeId: noticeId,
          email: userObj.email,
          displayName: userObj.displayName,
          text: commentText,
          time: +new Date(),
          reply: [],
        },
      ],
    });

    if (userObj.displayName !== feed.displayName) {
      await updateDoc(doc(dbService, "users", userAccount.email), {
        notice: [
          ...noticeCopy,
          {
            type: "comment",
            noticeId: noticeId,
            postId: feed.id,
            commentId: commentId,
            imgUrl: feed.url[0],
            text: commentText,
            displayName: userObj.displayName,
            email: userObj.email,
            time: +new Date(),
            isRead: false,
          },
        ],
      });
    }

    // 알림 보내기
    if (getToken && feed.displayName !== userObj.displayName) {
      sendActions(`comment`, commentText);
    }
  };

  // 댓글 삭제
  const { mutate: mutateCommentDelete } = useMutation(
    (response: CommentPayload) =>
      axios.delete(
        `${process.env.REACT_APP_SERVER_PORT}/api/comment/${response.id}`,
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
  const onCommentDelete = async (commentData: CommentType) => {
    const ok = window.confirm("댓글을 삭제하시겠어요?");
    if (ok) {
      const filter = feed.comment.filter(
        (info) => info.text !== commentData.text
      );
      const noticeFilter = noticeCopy.filter(
        (notice) =>
          notice.commentId !== commentData.commentId ||
          (notice.type !== "comment" && notice.type !== "reply")
      );

      mutateCommentDelete({
        id: commentData.postId,
        comment: [...filter],
      });

      // 상대 알림에서 답글 및 댓글 제거
      if (userObj.displayName !== feed.displayName) {
        await updateDoc(doc(dbService, "users", userAccount.email), {
          notice: noticeFilter,
        });
      }

      // 본인 댓글 알림 중 상대 답글 제거
      if (userObj.displayName !== feed.displayName) {
        await updateDoc(doc(dbService, "users", userObj.email), {
          notice: noticeFilter,
        });
      }
    }
  };

  return { commentText, setCommentText, onComment, onCommentDelete };
};

export default useComment;