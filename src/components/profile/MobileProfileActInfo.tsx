import React, { useState } from "react";
import styled from "@emotion/styled";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useCreateChat from "../../hooks/actions/useCreateChat";
import useToggleFollow from "../../hooks/actions/useToggleFollow";
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

const MobileProfileActInfo = ({
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
            src={account?.profileURL}
            alt="profile image"
          />
        </ProfileImageBox>
        <ProfileDetailBox>
          <ProfileDetail>
            <ProfileInfoBox>
              <ProfileDsName>{account?.displayName}</ProfileDsName>
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
                  <BtnBox>
                    {userObj?.following.filter((obj) =>
                      obj?.displayName.includes(account.displayName)
                    ).length !== 0 ? (
                      <FollowingBtn>팔로잉</FollowingBtn>
                    ) : (
                      <FollowBtn>팔로우</FollowBtn>
                    )}
                  </BtnBox>
                </FollowBtnBox>
                <MessageBtnBox onClick={() => onMessageClick(account)}>
                  <MessageBtn>메시지 보내기</MessageBtn>
                </MessageBtnBox>
              </ActBtnBox>
            )}
          </ProfileDetail>
        </ProfileDetailBox>
      </ProfileBox>
      {(account?.name || account?.description) && (
        <ProfileIntroBox>
          {account?.name && <ProfileName>{account.name}</ProfileName>}
          {account?.description && (
            <ProfileDesc>{account.description}</ProfileDesc>
          )}
        </ProfileIntroBox>
      )}
      <ProfileActBox>
        <ProfileAct>
          게시글 <em>{myPost ? myPost : 0}</em>
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
    </>
  );
};

export default MobileProfileActInfo;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 120px;
  position: relative;
  padding: 16px;
`;

const ProfileImageBox = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid var(--fourth-color);
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const ProfileDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
`;

const ProfileDetail = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProfileInfoBox = styled.div`
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ProfileIntroBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px 16px;
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  line-height: 34px;
  font-weight: 500;
`;

const ProfileName = styled.p`
  font-size: 12px;
  font-weight: 500;
`;

const ProfileDesc = styled.p`
  font-size: 12px;
  white-space: pre-wrap;
  color: var(--third-color);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-break: keep-all;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const ProfileBtnBox = styled.div`
  display: flex;
  align-items: center;
  white-space: pre;
  gap: 10px;
`;

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  white-space: pre;
  gap: 10px;
`;

const ProfileEditBtn = styled.button`
  padding: 8px 10px;
  border: 1px solid var(--profile-color);
  color: var(--profile-color);
  font-size: 14px;
  white-space: pre;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;
  flex: 1;

  &:hover,
  &:active {
    background-color: var(--profile-color);
    color: #fff;
  }

  @media screen and (max-width: 767px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 6px;
  border: 1px solid var(--third-color);
  color: var(--third-color);
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

const ActBtnBox = styled(ProfileBtnBox)``;

const FollowBtnBox = styled.div`
  flex: 1;
  width: 100%;
`;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--second-color);
  background: var(--second-color);
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;
  white-space: pre;

  &:hover,
  &:active {
    background: #000;
  }

  @media screen and (max-width: 767px) {
    font-size: 12px;
    padding: 6px 8px;
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
  justify-content: space-evenly;
  border-top: 1px solid var(--fourth-color);
  padding: 8px 0;
`;

const ProfileAct = styled.div`
  font-size: 12px;
  width: 33.33%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  color: var(--third-color);
  white-space: pre;

  &:not(:first-of-type) {
    cursor: pointer;
  }
  em {
    color: var(--second-color);
    font-weight: 500;
  }
`;
