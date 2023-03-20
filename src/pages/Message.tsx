import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import { currentUser } from "../app/user";
import ColorList from "../assets/ColorList";
import Chat from "../components/message/Chat";
import MessageList from "../components/message/MessageList";

type Props = {};

const Message = (props: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  return (
    <Wrapper>
      <Container>
        <ChatRoomList>
          <Category>메시지</Category>
          <ChatRoomBox>
            <User to={``}>
              <ProfileImageBox>
                <ProfileImage src={``} alt="profile image" />
              </ProfileImageBox>
              <ProfileInfoBox>
                <ProfileDsName></ProfileDsName>
                <ProfileName>res.name</ProfileName>
                <ProfileName>res.description</ProfileName>
              </ProfileInfoBox>
            </User>
          </ChatRoomBox>
        </ChatRoomList>
        <ChatRoom>
          <Category>메시지</Category>
          <Chat />
          {/* <MessageList /> */}
          {/* {currentUser && <Chat />} */}
        </ChatRoom>
      </Container>
    </Wrapper>
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
  position: relative;
  position: absolute;
  /* height: 100%; */
  top: 40px;
  right: 40px;
  bottom: 40px;
  left: 40px;
  border: 2px solid ${secondColor};
  border-radius: 20px;
  overflow: hidden;
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
  font-weight: 500;
  border-bottom: 1px solid ${secondColor};
`;

const ChatRoomList = styled.div`
  width: 240px;
  height: 100%;
  border-right: 1px solid ${secondColor};
`;

const ChatRoom = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const ChatRoomBox = styled.div`
  /* padding: 20px; */
`;

const User = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 12px 16px;
  height: 100%;
  transition: all 0.15s linear;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }
`;

const ProfileImageBox = styled.div`
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

const ProfileInfoBox = styled.div`
  cursor: pointer;
  flex: 1;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  gap: 2px;
  /* padding-right: 20px; */
`;

const ProfileDsName = styled.p`
  font-size: 16px;
  font-weight: 500;
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 14px;
  color: ${thirdColor};
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
