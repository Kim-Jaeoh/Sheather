import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { onSnapshot, doc } from "firebase/firestore";
import { dbService } from "../../../fbase";
import { CurrentUserType, FeedType } from "../../../types/type";
import { FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom";
import useToggleFollow from "../../../hooks/useToggleFollow";
import useTimeFormat from "../../../hooks/useTimeFormat";
import { Skeleton } from "@mui/material";

type Props = {
  userObj: CurrentUserType;
  feed: FeedType;
  onMoreClick: () => void;
};

const DetailFeedHeader = ({ userObj, feed, onMoreClick }: Props) => {
  const [userAccount, setUserAccount] = useState(null);
  const { toggleFollow } = useToggleFollow({
    user: userAccount,
  });
  const { timeToString2 } = useTimeFormat();

  // 계정 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", feed.email), (doc) =>
      setUserAccount(doc.data())
    );
  }, [feed]);

  return (
    <Header>
      <UserInfoBox>
        <UserImageBox to={`/profile/${feed.displayName}/post`}>
          {userAccount ? (
            <UserImage
              onContextMenu={(e) => e.preventDefault()}
              src={userAccount?.profileURL}
              alt=""
            />
          ) : (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"100%"}
              sx={{ position: "absolute", top: 0, left: 0 }}
            />
          )}
        </UserImageBox>
        <UserWriteInfo>
          <UserNameBox
            to={`/profile/${feed.displayName}/post`}
            state={feed.email}
          >
            {userAccount ? (
              <UserName>{userAccount?.displayName}</UserName>
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
          <WriteDate>{timeToString2(Number(feed.createdAt))}</WriteDate>
        </UserWriteInfo>
        {feed.email !== userObj.email ? (
          <FollowBtnBox onClick={() => toggleFollow(feed.displayName)}>
            {userObj?.following.filter((obj) =>
              obj?.displayName?.includes(feed.displayName)
            ).length !== 0 ? (
              <FollowingBtn>팔로잉</FollowingBtn>
            ) : (
              <FollowBtn>팔로우</FollowBtn>
            )}
          </FollowBtnBox>
        ) : (
          <MoreBtn type="button" onClick={onMoreClick}>
            <FiMoreHorizontal />
          </MoreBtn>
        )}
      </UserInfoBox>
    </Header>
  );
};

export default DetailFeedHeader;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--fourth-color);

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const UserInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserImageBox = styled(Link)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--fourth-color);
  object-fit: cover;
  cursor: pointer;
  position: relative;
`;

const UserImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  image-rendering: auto;
`;

const UserWriteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
  color: var(--third-color);
`;

const WriteDate = styled.span`
  font-size: 12px;
  @media (max-width: 767px) {
    font-size: 10px;
  }
`;

const UserNameBox = styled(Link)`
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: var(--second-color);
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const SkeletonBox = styled.div`
  padding: 8px;
  position: relative;
`;

const UserName = styled.p``;

const FollowBtnBox = styled.div`
  margin-left: auto;
`;

const MoreBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fff;
  padding: 0;
  margin-right: -6px;
  border-radius: 50%;
  transition: all 0.15s linear;
  cursor: pointer;
  &:hover,
  &:active {
    background: var(--fourth-color);
  }
  svg {
    font-size: 20px;
  }
`;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 16px;
  color: #fff;
  border-radius: 8px;
  border: 1px solid var(--second-color);
  background: var(--second-color);
  cursor: pointer;

  &:hover,
  &:active {
    background: #000;
  }

  @media (max-width: 767px) {
    font-size: 12px;
    padding: 10px 12px;
  }
`;

const FollowingBtn = styled(FollowBtn)`
  border: 1px solid var(--third-color);
  background: #fff;
  color: var(--second-color);

  &:hover,
  &:active {
    background: var(--fourth-color);
  }
`;
