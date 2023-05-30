import { updateDoc, doc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { currentUser } from "../../app/user";
import { dbService } from "../../fbase";
import { CurrentUserType, FollowingType } from "../../types/type";
import { useEffect, useState } from "react";
import useGetMyAccount from "../useGetMyAccount";
import useThrottle from "../useThrottle";
import useSendNoticeMessage from "./useSendNoticeMessage";

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
  const { myAccount } = useGetMyAccount();
  const { throttle } = useThrottle();

  useEffect(() => {
    // 알림 보내기
    if (getToken && isSend) {
      throttle(
        () =>
          sendActions(
            `follower`,
            null,
            `${process.env.REACT_APP_PUBLIC_URL}/profile/${user?.displayName}/post`
          ),
        5000
      );
    }
  }, [getToken, isSend, user?.displayName]);

  const toggleFollow = async (userInfo: CurrentUserType) => {
    setUser((prev: CurrentUserType) => (prev = userInfo));

    const followingCopy = [...myAccount.following];
    const followingFilter = followingCopy.filter(
      (res) => res.displayName !== userInfo.displayName
    );
    const followerCopy = [...userInfo?.follower];
    const followerFilter = followerCopy.filter(
      (res) => res.displayName !== myAccount.displayName
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
      myAccount.following.some(
        (res: FollowingType) => res.displayName === userInfo.displayName
      )
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
      const updateFollower = updateDoc(
        doc(dbService, "users", myAccount.email),
        {
          following: [
            ...followingCopy,
            {
              displayName: userInfo.displayName,
              email: userInfo.email,
              time: +new Date(),
            },
          ],
        }
      );

      const updateNotice = updateDoc(doc(dbService, "users", userInfo.email), {
        // 상대방 팔로워에 본인 이름 추가
        follower: [
          ...followerCopy,
          {
            displayName: myAccount.displayName,
            email: myAccount.email,
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
            displayName: myAccount.displayName,
            email: myAccount.email,
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
