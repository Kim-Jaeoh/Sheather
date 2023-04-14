import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import ColorList from "../../assets/data/ColorList";
import useToggleLike from "../../hooks/useToggleLike";
import { onSnapshot, doc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { FeedType } from "../../types/type";
import useToggleBookmark from "../../hooks/useToggleBookmark";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Skeleton } from "@mui/material";
import useSendNoticeMessage from "../../hooks/useSendNoticeMessage";

type Props = {
  feed: FeedType;
};

const FeedProfileInfo = ({ feed }: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [account, setAccount] = useState(null);
  const { toggleBookmark } = useToggleBookmark(); // 북마크 커스텀 훅
  const { toggleLike } = useToggleLike({ user: account }); // 좋아요 커스텀 훅

  // 계정 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(dbService, "users", feed.email), (doc) =>
      setAccount(doc.data())
    );
    return () => unsubscribe();
  }, [feed]);

  return (
    <UserInfoBox>
      <UserImageBox
        to={userLogin && `/profile/${feed.displayName}/post`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {account ? (
          <UserImage src={account?.profileURL} alt="" />
        ) : (
          <Skeleton
            variant="rounded"
            width={"100%"}
            height={"100%"}
            sx={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
      </UserImageBox>
      <UserNameBox to={userLogin && `/profile/${feed.displayName}/post`}>
        {account ? (
          <UserName>{account?.displayName}</UserName>
        ) : (
          <SkeletonBox>
            <Skeleton
              variant="rectangular"
              width={"90%"}
              height={"100%"}
              sx={{ position: "absolute", top: 0, left: 0 }}
            />
          </SkeletonBox>
        )}
      </UserNameBox>
      <UserReactBox>
        <UserIconBox>
          <UserIcon onClick={() => toggleLike(feed)}>
            {userObj?.like?.filter((id) => id === feed.id).length > 0 ? (
              <FaHeart style={{ color: "#FF5673" }} />
            ) : (
              <FaRegHeart />
            )}
          </UserIcon>
          {feed.like.length > 0 && (
            <UserReactNum>{feed.like.length}</UserReactNum>
          )}
        </UserIconBox>
        <UserIcon onClick={() => toggleBookmark(feed.id)}>
          {userObj?.bookmark?.filter((id) => id === feed.id).length > 0 ? (
            <FaBookmark style={{ color: "#FF5673" }} />
          ) : (
            <FaRegBookmark />
          )}
        </UserIcon>
      </UserReactBox>
    </UserInfoBox>
  );
};

export default FeedProfileInfo;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const SkeletonBox = styled.div`
  padding: 8px;
  position: relative;
`;

const UserInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserImageBox = styled(Link)`
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${fourthColor};
  object-fit: cover;
  cursor: pointer;
  position: relative;

  @media (max-width: 767px) {
    width: 26px;
    height: 26px;
  }
`;

const UserImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  image-rendering: auto;
`;

const UserNameBox = styled(Link)`
  display: block;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  font-size: 14px;
  flex: 1;
  padding: 8px;
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: ${secondColor};

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

const UserName = styled.p``;

const UserReactBox = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
  gap: 10px;
`;

const UserIconBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserIcon = styled.div<{ isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${thirdColor};
  svg {
    font-size: 16px;
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const UserReactNum = styled.p`
  font-size: 14px;
  margin-left: 4px;
  color: ${thirdColor};

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;
