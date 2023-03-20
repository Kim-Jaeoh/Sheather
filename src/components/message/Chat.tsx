import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import useFirestoreQuery from "../../hooks/useFirestoreQuery";
import { dbService } from "../../fbase";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

interface messageType {
  text: string;
  createdAt: number;
  uid: string;
  displayName: string;
  profileURL: string;
  isRead: boolean;
}

const Chat = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState(null);
  const inputRef = useRef(null);
  const bottomListRef = useRef(null);

  // // firestore 에서 해당 채널 id의 컬렉션 가져옴. 없으면 새로 생성됨. (여기서 채널은 채팅방을 의미)
  const messagesRef = collection(dbService, `messages-123`);
  // // const messagesRef = collection(dbService, `messages-${uuid()}`);

  // // 0. 에서 작성한 useFirestoreQuery 로 도큐먼트 가져옴
  // const messages: messageType[] = useFirestoreQuery(
  //   query(messagesRef, orderBy(`createdAt`, `asc`), limit(1000))
  // );

  const [messages, setMessages] = useState(null);
  useEffect(() => {
    const q = query(messagesRef, orderBy(`createdAt`, `asc`), limit(1000));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMessages(data);
    });
  }, []);

  console.log(messages);

  // 상대 계정 정보 가져오기
  useEffect(() => {
    if (messages) {
      const querySnapshot = async () => {
        const filter = messages?.filter(
          (res: messageType) => res?.displayName !== userObj.displayName
        );
        const docRef = doc(dbService, "users", filter[0]?.displayName);
        const docSnap = await getDoc(docRef);
        return setUsers(docSnap.data());
      };

      querySnapshot();
    }
  }, [messages, userObj.displayName]);

  // 인풋 포커싱
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  // 첫 화면 하단 스크롤
  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // messagesRef 업데이트가 될 때 마다 읽음/안읽음 표시 업데이트를 할 수도 있습니다.
  }, [messagesRef]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력한 채팅 공백 제거
    const trimmedMessage = newMessage.trim();

    if (trimmedMessage) {
      addDoc(messagesRef, {
        text: trimmedMessage,
        createdAt: +Date.now(),
        uid: userObj.uid,
        displayName: userObj.displayName,
        profileURL: userObj.profileURL,
        isRead: false,
      });

      setNewMessage("");

      // 메세지 전송 후 하단으로 이동
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Conatiner>
        <MessageBox>
          {messages?.map((res: messageType, index: number) => {
            const isMine = res?.displayName === userObj.displayName;
            return (
              <User key={index} isMine={isMine}>
                {!isMine && users && (
                  <ProfileImageBox to={`/profile/${res?.displayName}/post`}>
                    <ProfileImage src={users?.profileURL} alt="profile image" />
                  </ProfileImageBox>
                )}
                <SendMessageBox>
                  <SendMessage>{res?.text}</SendMessage>
                </SendMessageBox>
                <SeneMessageAt>
                  {moment(res?.createdAt).format(`HH:mm`)}
                </SeneMessageAt>
              </User>
            );
          })}
          <div ref={bottomListRef} />
        </MessageBox>
        <div style={{ height: `60px` }}>
          <div className="w-full z-20 pb-safe bottom-0 fixed md:max-w-xl p-4 bg-gray-50">
            <form onSubmit={handleOnSubmit} className="flex">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={handleOnChange}
                placeholder="메세지를 입력하세요"
                className="border rounded-full px-4 h-10 flex-1 mr-1 ml-1"
              />
              <button
                type="submit"
                disabled={!newMessage}
                className="rounded-full bg-red-400 h-10 w-10"
              >
                <BiSend className="text-white text-xl w-10" />
              </button>
            </form>
          </div>
        </div>
      </Conatiner>
    </>
  );
};

export default Chat;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

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
  padding: 20px;
  height: 100;
  overflow-y: auto;
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

const SendMessageBox = styled.div`
  margin: 0 10px;
`;

const SendMessage = styled.p`
  padding: 8px 12px;
  border: 1px solid ${thirdColor};
  border-radius: 20px;
  max-width: 230px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.2;
`;

const SeneMessageAt = styled.span`
  font-size: 12px;
  color: ${thirdColor};
  /* margin-left: 0 8px; */
`;
