import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";
import { CurrentUserType } from "../types/type";
import useSendNoticeMessage from "./useSendNoticeMessage";

type props = {
  user: CurrentUserType;
};

const useToggleFollow = ({ user }: props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const dispatch = useDispatch();
  const { getToken, sendActions } = useSendNoticeMessage(user);

  const toggleFollow = async (resDpName: string) => {
    const followingCopy = [...userObj.following];
    const followingFilter = followingCopy.filter(
      (res) => res.displayName !== resDpName
    );
    const followerCopy = [...user?.follower];
    const followerFilter = followerCopy.filter(
      (res) => res.displayName !== userObj.displayName
    );
    const noticeCopy = [...user?.notice];
    const noticeFilter = noticeCopy.filter(
      (notice) =>
        notice.displayName !== user.displayName && notice.type !== "follower"
    );

    if (!userLogin) {
      return alert("로그인을 해주세요.");
    }
    if (
      userObj.following.filter((res) => res.displayName === resDpName)
        .length !== 0
    ) {
      // 본인 팔로잉에 상대방 이름 제거
      await updateDoc(doc(dbService, "users", userObj.email), {
        following: followingFilter,
      });

      // 상대방 팔로워에 본인 이름 제거
      await updateDoc(doc(dbService, "users", user.email), {
        follower: followerFilter,
      });

      // 상대 알림에서 제거
      await updateDoc(doc(dbService, "users", user.email), {
        notice: noticeFilter,
      });

      dispatch(
        currentUser({
          ...userObj,
          following: followingFilter,
        })
      );
    } else {
      // 본인 팔로잉에 상대방 이름 추가
      await updateDoc(doc(dbService, "users", userObj.email), {
        following: [
          ...followingCopy,
          { displayName: resDpName, email: user.email, time: +new Date() },
        ],
      });

      // 상대방 팔로워에 본인 이름 추가
      await updateDoc(doc(dbService, "users", user.email), {
        follower: [
          {
            displayName: userObj.displayName,
            email: userObj.email,
            time: +new Date(),
          },
        ],
      });

      // 상대 알림에 추가
      await updateDoc(doc(dbService, "users", user.email), {
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
            { displayName: resDpName, time: +new Date(), email: user.email },
            ...followingCopy,
          ],
        })
      );

      // 알림 보내기
      if (getToken && user.displayName !== userObj.displayName) {
        sendActions(
          `follower`,
          null,
          `${process.env.REACT_APP_PUBLIC_URL}/profile/${user.displayName}/post`
        );
      }
    }
  };

  return { toggleFollow };
};

export default useToggleFollow;
