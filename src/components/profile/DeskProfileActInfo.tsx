import React, { useState } from "react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useCreateChat from "../../hooks/actions/useCreateChat";
import useToggleFollow from "../../hooks/actions/useToggleFollow";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { CurrentUserType, FollowerType, FollowingType } from "../../types/type";
import ProfileSettingModal from "../modal/profile/ProfileSettingModal";

type Props = {
  myPost: number;
  account: CurrentUserType;
  onModalClick: () => void;
  setFollowInfo: (value: FollowerType[] | FollowingType[]) => void;
  setFollowCategory: (value: React.SetStateAction<string>) => void;
  onEditModalClick: () => void;
  onIsLogin: (callback: () => void) => void;
  onLogOutClick: () => void;
};

const DeskProfileActInfo = ({
  myPost,
  account,
  onModalClick,
  setFollowInfo,
  setFollowCategory,
  onEditModalClick,
  onIsLogin,
  onLogOutClick,
}: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [isSet, setIsSet] = useState(false);
  const { toggleFollow } = useToggleFollow();
  const { onCreateChatClick } = useCreateChat();

  const onMessageClick = (res: CurrentUserType) => {
    onIsLogin(() => onCreateChatClick(res));
  };

  const onClickFollow = (
    res: FollowerType[] | FollowingType[],
    type: string
  ) => {
    onIsLogin(() => {
      onModalClick();
      setFollowInfo(res);
      setFollowCategory(type);
    });
  };

  const onFollowClick = (user: CurrentUserType) => {
    onIsLogin(() => toggleFollow(user));
  };

  const onSettingClick = () => {
    setIsSet((prev) => !prev);
  };

  return (
    <>
      {isSet && (
        <ProfileSettingModal modalOpen={isSet} modalClose={onSettingClick} />
      )}
      <ProfileBox>
        <ProfileImageBox>
          <ProfileImage
            onContextMenu={(e) => e.preventDefault()}
            src={
              account?.profileURL !== ""
                ? account?.profileURL
                : account?.defaultProfileUrl
            }
            alt="profile image"
          />
        </ProfileImageBox>
        <ProfileDetailBox>
          <ProfileDetail>
            <ProfileInfoBox>
              <ProfileDsName>{account?.displayName}</ProfileDsName>
              <ProfileActBox>
                <ProfileAct>
                  게시글 <em>{myPost}</em>
                </ProfileAct>
                <ProfileAct
                  onClick={() => {
                    onClickFollow(account?.follower, "팔로워");
                  }}
                >
                  팔로워 <em>{account?.follower.length}</em>
                </ProfileAct>
                <ProfileAct
                  onClick={() => {
                    onClickFollow(account?.following, "팔로잉");
                  }}
                >
                  팔로잉 <em>{account?.following.length}</em>
                </ProfileAct>
              </ProfileActBox>
            </ProfileInfoBox>
            {account?.email === userObj.email ? (
              <ProfileBtnBox>
                <ProfileEditBtn onClick={onEditModalClick}>
                  프로필 수정
                </ProfileEditBtn>
                <SetBtn onClick={onSettingClick}>
                  <FiSettings />
                </SetBtn>
                <LogoutBtn onClick={onLogOutClick}>
                  <FiLogOut />
                </LogoutBtn>
              </ProfileBtnBox>
            ) : (
              <ActBtnBox>
                <FollowBtnBox onClick={() => onFollowClick(account)}>
                  {userObj?.following.filter((obj) =>
                    obj.displayName.includes(account.displayName)
                  ).length !== 0 ? (
                    <BtnBox>
                      <FollowingBtn>팔로잉</FollowingBtn>
                    </BtnBox>
                  ) : (
                    <BtnBox>
                      <FollowBtn>팔로우</FollowBtn>
                    </BtnBox>
                  )}
                </FollowBtnBox>
                <MessageBtnBox onClick={() => onMessageClick(account)}>
                  <MessageBtn>메시지 보내기</MessageBtn>
                </MessageBtnBox>
              </ActBtnBox>
            )}
          </ProfileDetail>
          <ProfileIntroBox>
            {account?.name && <ProfileName>{account.name}</ProfileName>}
            {account?.description && (
              <ProfileDesc>{account.description}</ProfileDesc>
            )}
          </ProfileIntroBox>
        </ProfileDetailBox>
      </ProfileBox>
    </>
  );
};

export default DeskProfileActInfo;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  height: 126px;
  position: relative;
`;

const ProfileImageBox = styled.div`
  width: 126px;
  height: 126px;
  border: 2px solid var(--fourth-color);
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  gap: 14px;
  flex: 1;
  height: 100%;
`;

const ProfileDetail = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`;

const ProfileInfoBox = styled.div`
  flex: 1;
  /* padding-right: 20px; */
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProfileIntroBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileDsName = styled.p`
  font-size: 18px;
  line-height: 34px;
  font-weight: 500;
`;

const ProfileName = styled.p`
  font-size: 14px;
`;

const ProfileDesc = styled.p`
  font-size: 12px;
  white-space: pre-wrap;
  color: var(--third-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
  padding-right: 20px;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  white-space: pre;
  gap: 10px;
`;

const ProfileEditBtn = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid var(--profile-color);
  color: var(--profile-color);
  white-space: pre;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover,
  &:active {
    background-color: var(--profile-color);
    color: #fff;
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 8px;
  border: 1px solid var(--third-color);
  color: var(--third-color);
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover,
  &:active {
    border: 1px solid var(--second-color);
    background-color: var(--second-color);
    color: #fff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SetBtn = styled(LogoutBtn)``;

const ActBtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  right: 0;
`;

const FollowBtnBox = styled.div``;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 8px 16px;
  color: #fff;
  border-radius: 8px;
  border: 1px solid var(--second-color);
  background: var(--second-color);
  cursor: pointer;
  transition: all 0.1s linear;
  white-space: pre;

  &:hover,
  &:active {
    background: var(--main-color);
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

const MessageBtnBox = styled.div``;

const MessageBtn = styled(FollowBtn)`
  border: 1px solid var(--third-color);
  background: #fff;
  color: var(--second-color);
  &:hover,
  &:active {
    background: var(--fourth-color);
  }
`;

const ProfileActBox = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const ProfileAct = styled.div`
  font-size: 14px;
  cursor: default;
  color: var(--third-color);
  white-space: pre;
  &:not(:first-of-type) {
    cursor: pointer;
  }
  em {
    margin-left: 4px;
    color: var(--second-color);
    font-weight: 500;
  }
`;

const ProfileBtnBox = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  white-space: pre;
  gap: 14px;
`;
