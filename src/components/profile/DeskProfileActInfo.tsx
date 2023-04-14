import React from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/data/ColorList";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useCreateChat from "../../hooks/useCreateChat";
import useToggleFollow from "../../hooks/useToggleFollow";
import { FiLogOut } from "react-icons/fi";
import { CurrentUserType, FollowerType, FollowingType } from "../../types/type";
import useSendNoticeMessage from "../../hooks/useSendNoticeMessage";

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
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const { toggleFollow } = useToggleFollow({ user: account });
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

  const onFollowClick = (dpName: string) => {
    onIsLogin(() => toggleFollow(dpName));
  };

  return (
    <>
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
                <LogoutBtn onClick={onLogOutClick}>
                  <FiLogOut />
                </LogoutBtn>
              </ProfileBtnBox>
            ) : (
              <ActBtnBox>
                <FollowBtnBox
                  onClick={() => onFollowClick(account?.displayName)}
                >
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

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  height: 120px;
  position: relative;
  @media (max-width: 767px) {
    padding: 20px;
  }
`;

const ProfileImageBox = styled.div`
  width: 120px;
  height: 120px;
  border: 2px solid ${fourthColor};
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;

  @media (max-width: 767px) {
    width: 80px;
    height: 80px;
  }
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
  height: 100%;

  @media (max-width: 767px) {
    gap: 0;
  }
`;

const ProfileDetail = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;

  @media (max-width: 767px) {
    align-items: center;
  }
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
`;

const ProfileDsName = styled.p`
  font-size: 18px;
  line-height: 34px;
  font-weight: 500;

  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

const ProfileName = styled.p`
  font-size: 14px;
  /* margin-top: 4px; */
`;

const ProfileDesc = styled.p`
  /* margin-top: 8px; */
  font-size: 14px;
  white-space: pre-wrap;
  color: ${thirdColor};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
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
  padding: 8px 10px;
  border: 1px solid #6f4ccf;
  color: #6f4ccf;
  font-weight: bold;
  white-space: pre;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover,
  &:active {
    background-color: #6f4ccf;
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
  border: 1px solid ${thirdColor};
  color: ${thirdColor};
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover,
  &:active {
    border: 1px solid ${secondColor};
    background-color: ${secondColor};
    color: #fff;
  }
`;

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
  font-weight: bold;
  font-size: 14px;
  padding: 8px 16px;
  color: #fff;
  border-radius: 8px;
  border: 1px solid ${secondColor};
  background: ${secondColor};
  cursor: pointer;
  transition: all 0.1s linear;
  white-space: pre;

  &:hover,
  &:active {
    background: #000;
  }

  /* @media (max-width: 767px) {
    font-size: 12px;
    padding: 6px 14px;
  } */
`;

const FollowingBtn = styled(FollowBtn)`
  border: 1px solid ${thirdColor};
  background: #fff;
  color: ${secondColor};

  &:hover,
  &:active {
    background: ${fourthColor};
  }
`;

const MessageBtnBox = styled.div``;

const MessageBtn = styled(FollowBtn)`
  border: 1px solid ${thirdColor};
  background: #fff;
  color: ${secondColor};
  &:hover,
  &:active {
    background: ${fourthColor};
  }
`;

const CategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
  border-top: 1px solid ${fourthColor};

  @media (max-width: 767px) {
    gap: 30px;
    margin-top: 0;
    margin-bottom: 20px;
    justify-content: space-evenly;
    border-bottom: 1px solid ${fourthColor};
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
  color: ${thirdColor};
  white-space: pre;
  &:not(:first-of-type) {
    cursor: pointer;
  }
  em {
    margin-left: 4px;
    color: ${secondColor};
    font-weight: 500;
  }
`;

const ProfileBtnBox = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  white-space: pre;
  gap: 10px;
`;
