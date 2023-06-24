import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../app/store";
import { Spinner } from "../../../assets/spinner/Spinner";
import { dbService } from "../../../fbase";
import useToggleFollow from "../../../hooks/actions/useToggleFollow";
import {
  CurrentUserType,
  FollowListCategoryType,
  FollowerType,
  FollowingType,
} from "../../../types/type";

type Props = {
  accountName: string;
  modalOpen: boolean;
  followInfo: FollowListCategoryType;
  followLength: number;
  modalClose: () => void;
};

const ProfileFollowModal = ({
  accountName,
  modalOpen,
  followInfo,
  followLength,
  modalClose,
}: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [account, setAccount] = useState<CurrentUserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFollow } = useToggleFollow();

  // 계정 정보 가져오기 (병렬 처리 = 한 번에 가져오기 위함)
  useEffect(() => {
    const getList = async (res: FollowerType | FollowingType) => {
      const docSnap = await getDoc(doc(dbService, "users", res.email));
      return docSnap.data();
    };

    const promiseList = async () => {
      const list = await Promise.all(
        followInfo.info.map((res) => {
          return getList(res);
        })
      );
      setAccount(list as CurrentUserType[]);
    };

    promiseList().then(() => setIsLoading(true));
  }, [followInfo]);

  const onFollowClick = (user: CurrentUserType, index: number) => {
    toggleFollow(user);
  };

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={true}>
      <Container>
        <Header>
          <Category>
            {followInfo.category === "팔로워" ? "팔로워" : "팔로잉"}
          </Category>
          <CloseBox onClick={modalClose}>
            <IoMdClose />
          </CloseBox>
        </Header>
        <UserListBox>
          {followLength ? (
            <>
              {isLoading ? (
                account?.map((res, index) => {
                  return (
                    <UserList key={index}>
                      <ProfileImageBox
                        to={`/profile/${res.displayName}/post`}
                        onClick={modalClose}
                      >
                        <ProfileImage
                          onContextMenu={(e) => e.preventDefault()}
                          src={
                            res.profileURL
                              ? res.profileURL
                              : res.defaultProfileUrl
                          }
                          alt="profile image"
                        />
                      </ProfileImageBox>
                      <ProfileInfoBox
                        to={`/profile/${res.displayName}/post`}
                        onClick={modalClose}
                      >
                        <ProfileDsName>{res.displayName}</ProfileDsName>
                        {res.name && <ProfileName>{res.name}</ProfileName>}
                      </ProfileInfoBox>
                      {res?.email !== userObj.email && (
                        <FollowBtnBox onClick={() => onFollowClick(res, index)}>
                          {userObj.following.filter((obj) =>
                            obj?.displayName?.includes(res?.displayName)
                          ).length !== 0 ? (
                            <FollowingBtn>팔로잉</FollowingBtn>
                          ) : (
                            <FollowBtn>팔로우</FollowBtn>
                          )}
                        </FollowBtnBox>
                      )}
                    </UserList>
                  );
                })
              ) : (
                <Spinner />
              )}
            </>
          ) : (
            <NotInfoBox>
              <NotInfo>
                <IconBox>
                  <Icon>
                    <BsPersonPlusFill />
                  </Icon>
                </IconBox>
                <NotInfoCategory>
                  {followInfo.category === "팔로워" ? "팔로워" : "팔로잉"}
                </NotInfoCategory>
                <NotInfoText>
                  {followInfo.category === "팔로워" ? (
                    <>
                      <em>
                        {accountName !== userObj.displayName
                          ? accountName
                          : "회원"}
                      </em>
                      님을 팔로우하는 모든 사람이 여기에 표시됩니다.
                    </>
                  ) : (
                    <>
                      <em>
                        {accountName !== userObj.displayName
                          ? accountName
                          : "회원"}
                      </em>
                      님이 팔로우하는 모든 사람이 여기에 표시됩니다.
                    </>
                  )}
                </NotInfoText>
              </NotInfo>
            </NotInfoBox>
          )}
        </UserListBox>
      </Container>
    </Modal>
  );
};

export default ProfileFollowModal;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
  box-sizing: border-box;
  position: absolute;
  color: var(--second-color);
  outline: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  border: 2px solid var(--second-color);
  box-shadow: 12px 12px 0 -2px var(--profile-color),
    12px 12px var(--second-color);

  @media (max-width: 767px) {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    transform: translate(0, 0);
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
`;

const Header = styled.header`
  width: 100%;
  min-height: 52px;
  display: flex;
  overflow: hidden;
  border-bottom: 1px solid var(--third-color);
  position: relative;
`;

const Category = styled.div`
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
`;

const CloseBox = styled.button`
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
`;

const UserListBox = styled.ul`
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const UserList = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  width: 100%;
  gap: 12px;
`;

const ProfileImageBox = styled(Link)`
  width: 44px;
  height: 44px;
  border: 1px solid var(--fourth-color);
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const ProfileInfoBox = styled(Link)`
  cursor: pointer;
  flex: 1;
  padding-right: 20px;
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const ProfileName = styled.p`
  font-size: 14px;
  margin-top: 4px;
  color: var(--third-color);
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
  border: 1px solid var(--second-color);
  background: var(--second-color);
  cursor: pointer;
  transition: all 0.1s linear;
  &:hover,
  &:active {
    background: #000;
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

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
`;

const NotInfo = styled.div`
  text-align: center;
`;

const NotInfoCategory = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
`;

const IconBox = styled.div`
  border: 2px solid var(--second-color);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 6px;

    path:not(:first-of-type) {
      color: var(--profile-color);
    }
  }
`;

const NotInfoText = styled.p`
  font-size: 14px;

  em {
    font-weight: 500;
  }
`;
