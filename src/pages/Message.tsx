import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { BiMessageAltAdd } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import ColorList from "../assets/data/ColorList";
import MessageUserSkeleton from "../assets/skeleton/MessageUserSkeleton";
import Chat from "../components/message/Chat";
import AddChatUserModal from "../components/modal/message/AddChatUserModal";
import useCreateChat from "../hooks/useCreateChat";
import useMediaScreen from "../hooks/useMediaScreen";
import { CurrentUserType, MessageReadType } from "../types/type";
import useGetMyAccount from "../hooks/useGetMyAccount";
import ChatList from "../components/message/ChatList";
import { onSnapshot, doc } from "firebase/firestore";
import { dbService } from "../fbase";
import BottomButton from "../components/scrollButton/BottomButton";
import { Spinner } from "../assets/spinner/Spinner";

type Props = {};

interface LocationType {
  state: CurrentUserType;
}

const Message = (props: Props) => {
  const [addUserModal, setAddUserMOdal] = useState(false);
  const [users, setUsers] = useState(null);
  const { clickInfo, setClickInfo } = useCreateChat();
  const { state } = useLocation() as LocationType;
  const { userLogin, userObj, myAccount } = useGetMyAccount();
  const { isDesktop, isTablet, isMobile, isMobileBefore } = useMediaScreen();
  const navigate = useNavigate();

  // 상대 계정 정보 가져오기
  useEffect(() => {
    if (myAccount && (state || clickInfo)) {
      const unsubscribe = onSnapshot(
        doc(dbService, "users", state ? state : clickInfo),
        (doc) => {
          setUsers(doc.data());
        }
      );

      return () => unsubscribe();
    }
  }, [clickInfo, myAccount, state]);

  // 채팅방 생성
  const onAddChatClick = () => {
    setAddUserMOdal((prev) => !prev);
  };

  // 채팅방 클릭
  const onListClick = (userEmail: string, userDsname: string) => {
    setClickInfo(userEmail);
    navigate(`/message/${userDsname}`);
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
            {myAccount?.message?.length > 0 ? (
              <ChatRoomBox>
                {myAccount?.message.map(
                  (data: MessageReadType, index: number) => {
                    return (
                      <ChatList
                        key={data.user}
                        data={data}
                        onListClick={onListClick}
                      />
                    );
                  }
                )}
              </ChatRoomBox>
            ) : (
              <MessageUserSkeleton />
            )}
          </ChatRoomList>
          {(isTablet || isDesktop || state || clickInfo) && (
            <ChatRoom>
              {state || clickInfo ? (
                <Chat
                  users={users}
                  myAccount={myAccount}
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
  width: 100%;
  /* height: 100%; */
  height: calc(100vh - 52px);
  border-top: 2px solid ${secondColor};
  background: #ff5c1b;

  @media (max-width: 767px) {
    padding: 16px;
    border: none;
    height: calc(100vh - 112px);
  }
`;

const Container = styled.div`
  display: flex;

  height: 100%;
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

  @media (max-width: 767px) {
    border: 1px solid ${secondColor};
    box-shadow: none;
  }
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

  @media (max-width: 767px) {
    padding: 0 16px;
  }
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
    color: ${secondColor};

    > path:last-of-type {
      color: #ff5c1b;
    }
  }
  @media (max-width: 767px) {
    right: 16px;
  }
`;

const ChatRoomList = styled.article<{
  isMobile: boolean;
  state: CurrentUserType;
}>`
  display: ${(props) => (props.isMobile && props.state ? `none` : `block`)};
  width: ${(props) => (props.isMobile ? `100%` : `240px`)};
  height: 100%;
  flex: 0 1 auto;
  border-right: 1px solid ${thirdColor};

  @media (max-width: 767px) {
    border: none;
  }
`;

const ChatRoom = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 0 250px;
  height: 100%;
`;

const ChatRoomBox = styled.div``;

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
