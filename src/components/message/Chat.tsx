import React, { useEffect, useState, useRef, useMemo } from "react";
import styled from "@emotion/styled";
import useFirestoreQuery from "../../hooks/useFirestoreQuery";
import { dbService } from "../../fbase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import ColorList from "../../assets/ColorList";
import uuid from "react-uuid";
import { BiSend } from "react-icons/bi";
import Message from "../../pages/Message";
import moment from "moment";
import { CurrentUserType } from "../../app/user";
import { Link } from "react-router-dom";
import { useHandleResizeTextArea } from "../../hooks/useHandleResizeTextArea";
import Emoji from "../../assets/Emoji";

interface Props {
  users: CurrentUserType;
  myAccount: CurrentUserType;
}

interface MessageType {
  text: string;
  createdAt: number;
  uid: string;
  displayName: string;
  profileURL: string;
  isRead: boolean;
}

interface listType {
  id: string;
  member?: string;
  message?: MessageType[];
}

const Chat = ({ myAccount, users }: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [messages, setMessages] = useState(null);
  const [text, setText] = useState("");
  const [messageCollection, setMessageCollection] = useState(null);
  const containerRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLTextAreaElement>();
  const bottomListRef = useRef(null);
  const { handleResizeHeight } = useHandleResizeTextArea(textRef);

  // 첫 화면 하단 스크롤
  useEffect(() => {
    bottomListRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. 문서 id값 가져오기
  useEffect(() => {
    const getCollectionId = async () => {
      const q = query(collection(dbService, `messages`));
      const getdoc = await getDocs(q);
      const list: listType[] = getdoc.docs.map((res) => ({
        id: res.id,
        ...res.data(),
      }));
      const getId = list.filter(
        (res) =>
          res.member.includes(userObj.displayName) &&
          res.member.includes(users?.displayName)
      );
      return setMessageCollection(getId[0]);
    };

    getCollectionId();
  }, [userObj.displayName, users?.displayName]);

  // 2. 채팅 목록 불러오기
  useEffect(() => {
    if (messageCollection?.id) {
      onSnapshot(doc(dbService, "messages", messageCollection?.id), (doc) => {
        setMessages(doc.data());
      });
    }
  }, [messageCollection?.id]);

  // 계정 정보에 message id값 넣기
  useEffect(() => {
    // 중복 체크
    const checkMyInfo = myAccount?.message?.some(
      (res: { id: string }) => res.id === messageCollection?.id
    );
    const checkUserInfo = users?.message?.some(
      (res: { id: string }) => res.id === messageCollection?.id
    );

    // 채팅 개설 시 본인 계정 message에 id값 추가
    if (messageCollection && myAccount && !checkMyInfo) {
      const myAccountPushId = async () => {
        await updateDoc(doc(dbService, "users", userObj.displayName), {
          message: [
            ...myAccount?.message,
            { user: users?.displayName, id: messageCollection?.id },
          ],
        });
      };
      myAccountPushId();
    }

    // 채팅 개설 시 상대 계정 message에 id값 추가
    if (messageCollection && users && !checkUserInfo) {
      const myAccountPushId = async () => {
        await updateDoc(doc(dbService, "users", users.displayName), {
          message: [
            ...users?.message,
            { user: userObj.displayName, id: messageCollection?.id },
          ],
        });
      };
      myAccountPushId();
    }
  }, [messageCollection, myAccount, userObj.displayName, users]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 입력한 채팅 공백 제거
    const trimmedMessage = text.trim();

    // 채팅 새로 만들기
    if (trimmedMessage && !messageCollection?.id) {
      await addDoc(collection(dbService, `messages`), {
        member: [userObj.displayName, "5dong2"],
        message: [
          {
            text: trimmedMessage,
            createdAt: +Date.now(),
            uid: userObj.uid,
            displayName: userObj.displayName,
            isRead: false,
          },
        ],
      });
    }

    // 채팅방에 글 보내기
    if (trimmedMessage && messageCollection?.id) {
      const messageCopy = [...messages?.message];
      await updateDoc(doc(dbService, "messages", messageCollection?.id), {
        message: [
          ...messageCopy,
          {
            text: trimmedMessage,
            createdAt: +Date.now(),
            uid: userObj.uid,
            displayName: userObj.displayName,
            isRead: false,
          },
        ],
      });
    }

    setText("");
  };

  // 메세지 읽음 확인
  const onReadMessage = async () => {
    if (messages) {
      const messageCopy = [...messages?.message];
      await updateDoc(doc(dbService, "messages", messageCollection?.id), {
        message: messageCopy.map((res) => {
          if (res?.displayName === users?.displayName) {
            return { ...res, isRead: (res.isRead = true) };
          } else {
            return { ...res };
          }
        }),
      });
    }
  };

  return (
    <>
      <Category>
        <ProfileImageBox to={`/profile/${users?.displayName}/post`}>
          <ProfileImage src={users?.profileURL} alt="profile image" />
        </ProfileImageBox>
        <ProfileInfoBox>
          <ProfileDsName>{users?.displayName}</ProfileDsName>
          <ProfileName>{users?.name}</ProfileName>
        </ProfileInfoBox>
      </Category>
      <Conatiner ref={containerRef}>
        <MessageBox>
          {messages?.message?.map((res: MessageType, index: number) => {
            const isMine = res?.displayName === userObj.displayName;
            return (
              <User key={index} isMine={isMine}>
                {!isMine && users && (
                  <ProfileImageBox to={`/profile/${res?.displayName}/post`}>
                    <ProfileImage src={users?.profileURL} alt="profile image" />
                  </ProfileImageBox>
                )}
                <SendMessageBox>
                  <SendMessage isMine={isMine}>{res?.text}</SendMessage>
                </SendMessageBox>
                <SeneMessageAt isMine={isMine}>
                  <Read>{res?.isRead ? null : 1}</Read>
                  {moment(res?.createdAt).format(`HH:mm`)}
                </SeneMessageAt>
              </User>
            );
          })}
          <div ref={bottomListRef} />
        </MessageBox>
        <ChatBox>
          <Form onSubmit={handleOnSubmit}>
            <Emoji
              setText={setText}
              textRef={textRef}
              right={-270}
              bottom={40}
            />
            <TextArea
              spellCheck="false"
              maxLength={120}
              value={text}
              onClick={onReadMessage}
              ref={textRef}
              onChange={handleOnChange}
              // onKeyDown={onKeyPress}
              onInput={handleResizeHeight}
              placeholder="메시지 입력..."
            />
            {text.length > 0 && (
              <SendBtn type="submit" disabled={!text}>
                보내기
              </SendBtn>
            )}
          </Form>
        </ChatBox>
      </Conatiner>
    </>
  );
};

export default Chat;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Category = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  gap: 12px;
  border-bottom: 1px solid ${thirdColor};
`;

const Conatiner = styled.section`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  height: 100;
`;

const User = styled.div<{ isMine: boolean }>`
  display: block;
  margin: 0;
  transition: all 0.15s linear;
  /* gap: 12px; */
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.isMine ? `row-reverse` : `row`)};
  /* justify-content: ${(props) =>
    props.isMine ? `flex-end` : `flex-start`}; */
  &:not(:last-of-type) {
    margin-bottom: 14px;
  }
`;

const ProfileImageBox = styled(Link)`
  display: block;
  padding: 0;
  margin: 0;
  width: 32px;
  height: 32px;
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
  /* flex: 1; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2px;
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  font-weight: 500;
  /* width: 120px; */
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 12px;
  color: ${thirdColor};
  /* width: 120px; */
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SendMessageBox = styled.div`
  margin: 0 10px;
`;

const SendMessage = styled.p<{ isMine: boolean }>`
  border: 1px solid ${fourthColor};
  background: ${(props) => (props.isMine ? fourthColor : `#fff`)};
  padding: 8px 12px;
  border-radius: 20px;
  max-width: 230px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 16px;
`;

const SeneMessageAt = styled.span<{ isMine: boolean }>`
  font-size: 10px;
  color: ${thirdColor};
  display: flex;
  gap: 2px;
  flex-direction: column;
  align-items: ${(props) => (props.isMine ? `flex-end` : `flex-start`)};
  /* margin-left: 0 8px; */
  transition: all 0.15s linear;
`;

const Read = styled.em`
  color: #ff5c1b;
`;

const ChatBox = styled.div`
  width: 100%;
  position: relative;
  border-top: 1px solid ${thirdColor};
  display: flex;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  border: 1px solid ${thirdColor};
  border-radius: 22px;
  display: flex;
  align-items: center;
  min-height: 44px;
  width: 100%;
  padding: 0 10px;
  position: relative;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 24px;
  max-height: 60px;
  border-radius: 22px;
  padding: 0 10px;
  resize: none;
  border: none;
  outline: none;
  line-height: 24px;
`;

const SendBtn = styled.button`
  display: flex;
  flex: 1 0 auto;
  padding: 0;
  /* margin: 0 12px; */
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  outline: none;
  font-weight: 500;
  color: #ff5c1b;
  font-size: 14px;
  cursor: pointer;
`;
