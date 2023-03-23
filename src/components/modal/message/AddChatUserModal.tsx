import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { onSnapshot, doc, collection, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../app/store";
import { CurrentUserType } from "../../../app/user";
import ColorList from "../../../assets/ColorList";
import { Spinner } from "../../../assets/Spinner";
import { dbService } from "../../../fbase";

type Props = {
  modalOpen: boolean;
  myAccount: CurrentUserType;
  modalClose: () => void;
  setClickInfo: React.Dispatch<React.SetStateAction<CurrentUserType>>;
};

const AddChatUserModal = ({
  myAccount,
  modalOpen,
  modalClose,
  setClickInfo,
}: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 계정 정보 가져오기
  useEffect(() => {
    let unsubscribe: any;
    myAccount?.following?.forEach(async (res) => {
      unsubscribe = onSnapshot(
        doc(dbService, "users", res.displayName),
        (doc) => {
          setUsers((prev: CurrentUserType[]) => {
            // 중복 체크
            if (!prev.some((user) => user.uid === doc.data().uid)) {
              return [...prev, doc.data()];
            } else {
              return prev;
            }
          });
        }
      );
    });
    setIsLoading(true);
    return () => unsubscribe();
  }, [myAccount?.following]);

  // 채팅 생성
  const onCreateChatClick = async (user: CurrentUserType) => {
    const filter = myAccount.message.filter(
      (message) => message.user === user.displayName
    );

    if (!filter[0]?.id) {
      // 채팅 새로 만들기
      await addDoc(collection(dbService, `messages`), {
        member: [userObj.displayName, user.displayName],
        message: [],
      });
    }
    setClickInfo(user);
    modalClose();
  };

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={true}>
      <Container>
        <Header>
          <Category>새로운 메세지</Category>
          <CloseBox onClick={modalClose}>
            <IoMdClose />
          </CloseBox>
        </Header>
        <UserListBox>
          {myAccount?.following?.length !== 0 ? (
            <>
              {isLoading ? (
                users?.map((res, index) => {
                  return (
                    <UserList key={index}>
                      <ProfileImageBox
                        to={`/profile/${res.displayName}/post`}
                        state={res.displayName}
                        onClick={modalClose}
                      >
                        <ProfileImage
                          src={res.profileURL}
                          alt="profile image"
                        />
                      </ProfileImageBox>
                      <ProfileInfoBox
                        to={`/profile/${res.displayName}/post`}
                        state={res.displayName}
                        onClick={modalClose}
                      >
                        <ProfileDsName>{res.displayName}</ProfileDsName>
                        {res.name && <ProfileName>{res.name}</ProfileName>}
                      </ProfileInfoBox>
                      {res?.email !== userObj.email && (
                        <FollowBtnBox onClick={() => onCreateChatClick(res)}>
                          <FollowBtn>대화하기</FollowBtn>
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
                <NotInfoCategory>사람</NotInfoCategory>
                <NotInfoText>
                  팔로우하는 모든 사람이 여기에 표시됩니다
                </NotInfoText>
              </NotInfo>
            </NotInfoBox>
          )}
        </UserListBox>
      </Container>
    </Modal>
  );
};

export default AddChatUserModal;

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
  border-radius: 20px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px #ff5c1b, 12px 12px ${secondColor};
`;

const Header = styled.header`
  width: 100%;
  min-height: 52px;
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
  border: 1px solid ${fourthColor};
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
  font-weight: 500;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${thirdColor};
  background: #fff;
  color: ${secondColor};

  cursor: pointer;
  transition: all 0.1s linear;
  &:hover,
  &:active {
    background: ${fourthColor};
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
