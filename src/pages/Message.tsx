import styled from "@emotion/styled";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BiMessageAltAdd } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import { CurrentUserType } from "../app/user";
import ColorList from "../assets/ColorList";
import MessageUserSkeleton from "../assets/skeleton/MessageUserSkeleton";
import Chat from "../components/message/Chat";
import AddChatUserModal from "../components/modal/message/AddChatUserModal";
import { dbService } from "../fbase";
import useCreateChat from "../hooks/useCreateChat";
import useMediaScreen from "../hooks/useMediaScreen";

type Props = {};

interface LocationType {
  state: CurrentUserType;
}

const Message = (props: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [users, setUsers] = useState([]);
  const [addUserModal, setAddUserMOdal] = useState(false);
  const { clickInfo, setClickInfo } = useCreateChat();
  const { state } = useLocation() as LocationType;
  const navigate = useNavigate();
  const { isDesktop, isTablet, isMobile, isMobileBefore } = useMediaScreen();

  // 상대 계정 정보 가져오기
  useEffect(() => {
    const getList = async (res: { user: string }) => {
      const docSnap = await getDoc(doc(dbService, "users", res.user));
      return docSnap.data();
    };

    const promiseList = async () => {
      const list = await Promise.all(
        userObj.message.map(async (res) => {
          return getList(res);
        })
      );
      setUsers(list);
    };

    promiseList();
  }, [userObj]);

  // 채팅방 클릭
  const onListClick = (user: CurrentUserType) => {
    setClickInfo(user);
    navigate(`/message/${user.displayName}`);
  };

  // 채팅방 생성
  const onAddChatClick = () => {
    setAddUserMOdal((prev) => !prev);
  };

  return (
    <>
      {addUserModal && (
        <AddChatUserModal
          userObj={userObj}
          modalOpen={addUserModal}
          modalClose={onAddChatClick}
        />
      )}
      <Wrapper>
        <Container>
          <ChatRoomList isMobile={isMobile} state={state ? state : clickInfo}>
            <Category>
              <CategoryText>메시지</CategoryText>
              <AddChatBtn onClick={onAddChatClick}>
                <BiMessageAltAdd />
              </AddChatBtn>
            </Category>
            {users?.length > 0 ? (
              <ChatRoomBox>
                {users?.map((res: CurrentUserType, index: number) => {
                  return (
                    <User
                      onClick={() => onListClick(res)}
                      key={res?.displayName}
                    >
                      <ProfileImageBox>
                        <ProfileImage
                          src={res?.profileURL}
                          alt="profile image"
                        />
                      </ProfileImageBox>
                      <ProfileInfoBox>
                        <ProfileDsName>{res?.displayName}</ProfileDsName>
                        <ProfileName>{res?.name}</ProfileName>
                      </ProfileInfoBox>
                      {userObj?.message?.some(
                        (e) => !e.isRead && e.user === res?.displayName
                      ) && <NoticeBox />}
                    </User>
                  );
                })}
              </ChatRoomBox>
            ) : (
              <MessageUserSkeleton />
            )}
          </ChatRoomList>
          {(isTablet || isDesktop || state || clickInfo) && (
            <ChatRoom>
              {state || clickInfo ? (
                <Chat
                  userObj={userObj}
                  users={state ? state : clickInfo}
                  setClickInfo={setClickInfo}
                />
              ) : (
                <NotInfoBox>
                  <IconBox>
                    <Icon>
                      <BsChatDots />
                    </Icon>
                  </IconBox>
                  <NotInfoCategory>메시지</NotInfoCategory>
                  <NotInfoText>친구에게 메시지를 보내보세요.</NotInfoText>
                </NotInfoBox>
              )}
            </ChatRoom>
          )}
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
  overflow: hidden;
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
    width: 24px;
    height: 24px;
    > path:last-of-type {
      color: #ff5c1b;
    }
  }
`;

const ChatRoomList = styled.div<{ isMobile: boolean; state: CurrentUserType }>`
  display: ${(props) => (props.isMobile && props.state ? `none` : `block`)};
  width: ${(props) => (props.isMobile ? `100%` : `240px`)};
  height: 100%;
  flex: 0 1 auto;
  border-right: 1px solid ${thirdColor};
`;

const ChatRoom = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 250px;
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

    > path:first-of-type {
      color: #ff5c1b;
    }
  }
`;

const NotInfoText = styled.p`
  font-size: 14px;
`;
