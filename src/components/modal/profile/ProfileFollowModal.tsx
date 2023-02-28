import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import imageCompression from "browser-image-compression";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import { Point } from "react-easy-crop";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../app/store";
import { UserType } from "../../../app/user";
import ColorList from "../../../assets/ColorList";
import { Spinner } from "../../../assets/Spinner";
import { dbService } from "../../../fbase";
import useToggleFollow from "../../../hooks/useToggleFollow";

type Props = {
  accountName: string;
  modalOpen: boolean;
  followCategory: string;
  followInfo: {
    id: string;
    time: number;
  }[];
  followLength: number;
  modalClose: () => void;
};

const ProfileFollowModal = ({
  accountName,
  modalOpen,
  followInfo,
  followCategory,
  followLength,
  modalClose,
}: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [account, setAccount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toggleFollow } = useToggleFollow();

  // 계정 정보 가져오기
  useEffect(() => {
    followInfo.map(async (res) => {
      const docSnap = await getDoc(doc(dbService, "users", res.id));
      setAccount((prev: UserType[]) => [...prev, docSnap.data()]);
      setIsLoading(true);
    });
    return () => setIsLoading(false);
  }, [followInfo]);

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={true}>
      <Container>
        <Header>
          <Category>
            {followCategory === "팔로워" ? "팔로워" : "팔로잉"}
          </Category>
          <CloseBox onClick={modalClose}>
            <IoMdClose />
          </CloseBox>
        </Header>
        <UserListBox>
          {followLength !== 0 ? (
            <>
              {isLoading ? (
                account?.map((res, index) => {
                  return (
                    <UserList key={index}>
                      <ProfileImageBox
                        to={`/profile/${res.displayName}/post`}
                        state={res.email}
                        onClick={modalClose}
                      >
                        <ProfileImage
                          src={res.profileURL}
                          alt="profile image"
                        />
                      </ProfileImageBox>
                      <ProfileInfoBox
                        to={`/profile/${res.displayName}/post`}
                        state={res.email}
                        onClick={modalClose}
                      >
                        <ProfileDsName>{res.displayName}</ProfileDsName>
                        {res.name && <ProfileName>{res.name}</ProfileName>}
                      </ProfileInfoBox>
                      {res?.email !== userObj.email && (
                        <FollowBtnBox onClick={() => toggleFollow(res.email)}>
                          {userObj?.following.filter((obj) =>
                            obj.id.includes(res.email)
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
                  {followCategory === "팔로워" ? "팔로워" : "팔로잉"}
                </NotInfoCategory>
                <NotInfoText>
                  {followCategory === "팔로워"
                    ? `${
                        accountName !== userObj.displayName
                          ? accountName
                          : "회원"
                      }님을 팔로우하는 모든 사람이 여기에 표시됩니다.`
                    : `${
                        accountName !== userObj.displayName
                          ? accountName
                          : "회원"
                      }님이 팔로우하는 모든 사람이 여기에 표시됩니다.`}
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

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
  box-sizing: border-box;
  position: absolute;
  color: ${secondColor};
  outline: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 8px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px #6f4ccf, 12px 12px ${secondColor};
`;

const Header = styled.header`
  width: 100%;
  min-height: 38px;
  display: flex;
  overflow: hidden;
  border-bottom: 1px solid ${thirdColor};
  position: relative;
`;

const Category = styled.div`
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
`;

const CloseBox = styled.button`
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 0;
  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 8px;
  }
`;

const UserListBox = styled.ul`
  overflow-y: auto;
  height: 100%;
`;

const UserList = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
`;

const ProfileImageBox = styled(Link)`
  width: 44px;
  height: 44px;
  border: 1px solid ${fourthColor};
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const ProfileInfoBox = styled(Link)`
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
  color: ${thirdColor};
`;

const ProfileDesc = styled.p`
  font-size: 14px;
  margin-top: 6px;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
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
  &:hover,
  &:active {
    background: #000;
  }
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

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;

  /* animation-name: slideDown;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out; */

  /* @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  } */
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
  border: 2px solid ${secondColor};
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
      color: #6f4ccf;
    }
  }
`;

const NotInfoText = styled.p`
  font-size: 14px;
`;
