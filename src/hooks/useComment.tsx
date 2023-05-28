import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  CurrentUserType,
  FeedType,
  CommentType,
  NoticeArrType,
} from "../types/type";
import { dbService } from "../fbase";
import { updateDoc, doc } from "firebase/firestore";
import useSendNoticeMessage from "./useSendNoticeMessage";
import { toast } from "react-hot-toast";
import useThrottle from "./useThrottle";
import useGetMyAccount from "./useGetMyAccount";
import { useNavigate } from "react-router-dom";

type Props = {
  feed: FeedType;
  userAccount: CurrentUserType;
  textRef: React.MutableRefObject<HTMLTextAreaElement>;
  getToken: string;
};

export type CommentPayload = {
  id: string;
  comment: CommentType;
};

const useComment = ({ feed, userAccount, textRef, getToken }: Props) => {
  const [commentText, setCommentText] = useState("");
  const [noticeCopy, setNoticeCopy] = useState<NoticeArrType[]>([]);
  const { myAccount, userObj } = useGetMyAccount();
  const queryClient = useQueryClient();
  const { sendActions } = useSendNoticeMessage(feed);
  const { throttle } = useThrottle();
  const navigate = useNavigate();

  useEffect(() => {
    if (userAccount) {
      setNoticeCopy([...userAccount?.notice]);
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
      onError: () => {
        toast.error("피드가 삭제되었거나 찾을 수 없습니다.");
        navigate("/");
      },
    }
  );

  // 댓글 업로드
  const onComment = async (feed: FeedType) => {
    const commentId = `${feed.id}_${+new Date()}`; // 고유 값
    const noticeId = `notice_${+new Date()}`; // 고유 값
    mutate({
      id: feed.id,
      comment: {
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
      throttle(
        () =>
          sendActions(
            `comment`,
            commentText,
            `${process.env.REACT_APP_PUBLIC_URL}/feed/detail/${feed.id}`
          ),
        5000
      );
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
        toast.success("댓글이 삭제되었습니다.", {
          id: `delete-comment`, // 중복 방지
        });
      },
      onError: () => {
        toast.error("댓글이 존재하지 않아 삭제할 수 없습니다.", {
          id: `not-delete`,
        });
      },
    }
  );

  // 댓글 삭제
  const onCommentDelete = async (commentData: CommentType) => {
    const ok = window.confirm("댓글을 삭제하시겠어요?");
    if (ok) {
      const feedUserNoticeFilter = noticeCopy.filter(
        (notice) => notice.commentId !== commentData.commentId
      );
      const myNoticeFilter = myAccount.notice.filter(
        (notice: NoticeArrType) => notice.commentId !== commentData.commentId
      );
      const replyUserFilter = myAccount.notice.filter(
        (notice: NoticeArrType) =>
          notice.commentId !== commentData.commentId && notice.type !== "reply"
      );

      mutateCommentDelete({
        id: commentData.postId,
        comment: commentData,
      });

      // 상대 알림에서 답글 및 댓글 제거
      const feedUser = updateDoc(doc(dbService, "users", userAccount.email), {
        notice: feedUserNoticeFilter,
      });

      // 본인 댓글 알림 중 상대 답글 제거
      const userFilter = updateDoc(doc(dbService, "users", userObj.email), {
        notice: myNoticeFilter,
      });

      // 답글 단 사람들 알림 제거
      const replyFilter = commentData.reply.map((replyUser) => {
        return updateDoc(doc(dbService, "users", replyUser.email), {
          notice: replyUserFilter,
        });
      });

      await Promise.all([feedUser, userFilter, ...replyFilter]); // 병렬 처리
    }
  };

  return { commentText, setCommentText, onComment, onCommentDelete };
};

export default useComment;
