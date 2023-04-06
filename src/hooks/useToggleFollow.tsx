import { updateDoc, doc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import { dbService } from "../fbase";
import { CurrentUserType } from "../types/type";

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
      return alert("로그인하기~~");
    }
    if (
      userObj.following.filter((res) => res.displayName === resDpName)
        .length !== 0
    ) {
      // 본인 팔로잉에 상대방 이름 제거
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        following: followingFilter,
      });

      // 상대방 팔로워에 본인 이름 제거
      await updateDoc(doc(dbService, "users", resDpName), {
        follower: followerFilter,
      });

      // 상대 알림에서 제거
      await updateDoc(doc(dbService, "users", resDpName), {
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
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        following: [
          ...followingCopy,
          { displayName: resDpName, time: +new Date() },
        ],
      });

      // 상대방 팔로워에 본인 이름 추가
      await updateDoc(doc(dbService, "users", resDpName), {
        follower: [
          {
            displayName: userObj.displayName,
            time: +new Date(),
          },
        ],
      });

      // 상대 알림에 추가
      await updateDoc(doc(dbService, "users", resDpName), {
        notice: [
          ...noticeCopy,
          {
            type: "follower",
            postId: false,
            imgUrl: null,
            text: null,
            displayName: userObj.displayName,
            time: +new Date(),
            isRead: false,
          },
        ],
      });

      dispatch(
        currentUser({
          ...userObj,
          following: [
            { displayName: resDpName, time: +new Date() },
            ...followingCopy,
          ],
        })
      );
    }
  };

  return { toggleFollow };
};

export default useToggleFollow;
