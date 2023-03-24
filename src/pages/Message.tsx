import styled from "@emotion/styled";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { BiMessageAdd, BiMessageDots } from "react-icons/bi";
import { BsChatText } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import { currentUser, CurrentUserType } from "../app/user";
import ColorList from "../assets/ColorList";
import MessageUserSkeleton from "../assets/skeleton/MessageUserSkeleton";
import Chat from "../components/message/Chat";
import AddChatUserModal from "../components/modal/message/AddChatUserModal";
import { dbService } from "../fbase";
import useCreateChat from "../hooks/useCreateChat";
import { listType } from "../types/type";

type Props = {};

interface LocationType {
  state: CurrentUserType;
}

const Message = (props: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [myAccount, setMyAccount] = useState(null);
  const [users, setUsers] = useState([]);
  const [addUserModal, setAddUserMOdal] = useState(false);
  // const [clickInfo, setClickInfo] = useState<CurrentUserType>(null);
  const { clickInfo, setClickInfo } = useCreateChat();

  // 본인 계정 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", userObj?.displayName),
      (doc) => {
        setMyAccount(doc.data());
      }
    );

    return () => unsubscribe();
  }, [userObj.displayName]);

  // 상대 계정 정보 가져오기
  useEffect(() => {
    let unsubscribe: any;
    if (myAccount) {
      myAccount?.message?.map(async (res: { user: string }) => {
        unsubscribe = onSnapshot(doc(dbService, "users", res.user), (doc) => {
          setUsers((prev: CurrentUserType[]) => {
            // 중복 체크
            if (!prev.some((user) => user.uid === doc.data().uid)) {
              return [...prev, doc.data()];
            } else {
              return prev;
            }
          });
        });
      });
      return () => unsubscribe();
    }
  }, [myAccount]);

  const navigate = useNavigate();

  // 채팅방 클릭
  const onListClick = (user: CurrentUserType) => {
    setClickInfo(user);
    navigate(`/message/${user.displayName}`);
  };

  // 채팅방 생성
  const onAddChatClick = () => {
    setAddUserMOdal((prev) => !prev);
  };

  const { state } = useLocation() as LocationType;

  return (
    <>
      {addUserModal && (
        <AddChatUserModal
          myAccount={myAccount}
          modalOpen={addUserModal}
          modalClose={onAddChatClick}
          setClickInfo={setClickInfo}
        />
      )}
      <Wrapper>
        <Container>
          <ChatRoomList>
            <Category>
              <CategoryText>메시지</CategoryText>
              <AddChatBtn onClick={onAddChatClick}>
                <BsChatText />
              </AddChatBtn>
            </Category>
            {users.length > 0 ? (
              <ChatRoomBox>
                {users?.map((res: CurrentUserType, index: number) => {
                  return (
                    <User
                      onClick={() => onListClick(res)}
                      key={res.displayName}
                    >
                      <ProfileImageBox>
                        <ProfileImage
                          src={res.profileURL}
                          alt="profile image"
                        />
                      </ProfileImageBox>
                      <ProfileInfoBox>
                        <ProfileDsName>{res.displayName}</ProfileDsName>
                        <ProfileName>{res.name}</ProfileName>
                      </ProfileInfoBox>
                      {userObj?.message?.some(
                        (e) => !e.isRead && e.user === res.displayName
                      ) && <NoticeBox />}
                    </User>
                  );
                })}
              </ChatRoomBox>
            ) : (
              <MessageUserSkeleton />
            )}
          </ChatRoomList>
          <ChatRoom>
            {state || clickInfo ? (
              <Chat myAccount={myAccount} users={state ? state : clickInfo} />
            ) : (
              <NotInfoBox>
                <IconBox>
                  <Icon>
                    <BiMessageDots />
                  </Icon>
                </IconBox>
                <NotInfoCategory>메시지</NotInfoCategory>
                <NotInfoText>친구에게 메시지를 보내보세요.</NotInfoText>
              </NotInfoBox>
            )}
          </ChatRoom>
        </Container>
      </Wrapper>
    </>
  );
};

export default Message;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding: 40px;
  height: 100%;
  border-top: 2px solid ${secondColor};
  background: #ff5c1b;
`;

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 40px;
  right: 40px;
  bottom: 40px;
  left: 40px;
  border: 2px solid ${secondColor};
  border-radius: 20px;
  background: #fff;
  box-shadow: ${(props) => {
    let shadow = "";
    for (let i = 1; i < 63; i++) {
      shadow += `#a84017 ${i}px ${i}px,`;
    }
    shadow += `#a84017 63px 63px`;
    return shadow;
  }};
`;

const Category = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-weight: 700;
  position: relative;
  font-weight: 500;
  border-bottom: 1px solid ${thirdColor};
`;

const CategoryText = styled.span`
  font-weight: 700;
`;

const AddChatBtn = styled.button`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ChatRoomList = styled.div`
  width: 240px;
  height: 100%;
  border-right: 1px solid ${thirdColor};
`;

const ChatRoom = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const ChatRoomBox = styled.div``;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 14px 16px;
  height: 100%;
  transition: all 0.15s linear;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }
`;

const ProfileImageBox = styled.div`
  width: 42px;
  height: 42px;
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

const ProfileInfoBox = styled.div`
  cursor: pointer;
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  font-weight: 500;
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 12px;
  color: ${thirdColor};
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NoticeBox = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5c1b;
`;

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 30px;
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
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NotInfoText = styled.p`
  font-size: 14px;
`;
