import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";
import { CurrentUserType, FeedType } from "../types/type";
import useSendNoticeMessage from "./useSendNoticeMessage";
import { useCallback, useEffect, useState } from "react";

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
  const dispatch = useDispatch();
  const { getToken, sendActions } = useSendNoticeMessage(user);

  const toggleFollow = useCallback(
    async (userInfo: CurrentUserType) => {
      setUser(userInfo);

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
        // 본인 팔로잉에 상대방 이름 제거
        await updateDoc(doc(dbService, "users", userObj.email), {
          following: followingFilter,
        });

        // 상대방 팔로워에 본인 이름 제거
        await updateDoc(doc(dbService, "users", userInfo.email), {
          follower: followerFilter,
        });

        // 상대 알림에서 제거
        await updateDoc(doc(dbService, "users", userInfo.email), {
          notice: noticeFilter,
        });

        dispatch(
          currentUser({
            ...userObj,
            following: followingFilter,
          })
        );
      } else {
        // 알림 보내기
        if (getToken && userInfo.displayName !== userObj.displayName) {
          sendActions(
            `follower`,
            null,
            `${process.env.REACT_APP_PUBLIC_URL}/profile/${userInfo.displayName}/post`
          );
        }

        // 본인 팔로잉에 상대방 이름 추가
        await updateDoc(doc(dbService, "users", userObj.email), {
          following: [
            ...followingCopy,
            {
              displayName: userInfo.displayName,
              email: userInfo.email,
              time: +new Date(),
            },
          ],
        });

        await updateDoc(doc(dbService, "users", userInfo.email), {
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
    },
    [dispatch, getToken, sendActions, userLogin, userObj]
  );

  return { toggleFollow };
};

export default useToggleFollow;
