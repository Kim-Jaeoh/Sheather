import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";
import { CurrentUserType, FeedType } from "../types/type";
import useSendNoticeMessage from "./useSendNoticeMessage";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce, throttle } from "lodash";

type props = {
  user: CurrentUserType;
};

const useToggleFollow = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [user, setUser] = useState(null);
  const [isSend, setIsSend] = useState(false);
  const dispatch = useDispatch();
  const { getToken, sendActions } = useSendNoticeMessage(user);

  useEffect(() => {
    // 알림 보내기
    if (getToken && isSend) {
      sendActions(
        `follower`,
        null,
        `${process.env.REACT_APP_PUBLIC_URL}/profile/${user?.displayName}/post`
      );
    }
  }, [getToken, isSend, user?.displayName]);

  const toggleFollow = async (userInfo: CurrentUserType) => {
    setUser((prev: CurrentUserType) => (prev = userInfo));

    const followingCopy = [...userObj.following];
    const followingFilter = followingCopy.filter(
      (res) => res.displayName !== userInfo.displayName
    );
    const followerCopy = [...userInfo?.follower];
    const followerFilter = followerCopy.filter(
      (res) => res.displayName !== userObj.displayName
    );
    const noticeCopy = [...userInfo?.notice];
    const noticeFilter = noticeCopy.filter(
      (notice) =>
        notice.displayName !== userInfo.displayName &&
        notice.type !== "follower"
    );

    if (!userLogin) {
      return alert("로그인을 해주세요.");
    }

    if (
      userObj.following.filter(
        (res) => res.displayName === userInfo.displayName
      ).length !== 0
    ) {
      setIsSend(false);
      // 본인 팔로잉에 상대방 이름 제거
      const updateFollowing = updateDoc(
        doc(dbService, "users", userObj.email),
        {
          following: followingFilter,
        }
      );

      // 상대방 팔로워에 본인 이름, 알림 제거
      const updateFollowerAndNotice = updateDoc(
        doc(dbService, "users", userInfo.email),
        {
          follower: followerFilter,
          notice: noticeFilter,
        }
      );

      // 병렬 처리
      await Promise.all([updateFollowing, updateFollowerAndNotice]);

      dispatch(
        currentUser({
          ...userObj,
          following: followingFilter,
        })
      );
    } else {
      setIsSend(true);

      // 본인 팔로잉에 상대방 이름 추가
      const updateFollower = updateDoc(doc(dbService, "users", userObj.email), {
        following: [
          ...followingCopy,
          {
            displayName: userInfo.displayName,
            email: userInfo.email,
            time: +new Date(),
          },
        ],
      });

      const updateNotice = updateDoc(doc(dbService, "users", userInfo.email), {
        // 상대방 팔로워에 본인 이름 추가
        follower: [
          {
            displayName: userObj.displayName,
            email: userObj.email,
            time: +new Date(),
          },
        ],
        // 상대 알림에 추가
        notice: [
          ...noticeCopy,
          {
            type: "follower",
            noticeId: `notice_${+new Date()}`,
            postId: null,
            commentId: null,
            imgUrl: null,
            replyId: null,
            replyTagEmail: null,
            postImgUrl: null,
            text: null,
            displayName: userObj.displayName,
            email: userObj.email,
            time: +new Date(),
            isRead: false,
          },
        ],
      });

      // 병렬 처리
      await Promise.all([updateFollower, updateNotice]);

      dispatch(
        currentUser({
          ...userObj,
          following: [
            {
              displayName: userInfo.displayName,
              time: +new Date(),
              email: userInfo.email,
            },
            ...followingCopy,
          ],
        })
      );
    }
  };

  return { toggleFollow };
};

export default useToggleFollow;
