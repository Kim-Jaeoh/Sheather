import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { dbService } from "../../fbase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import ColorList from "../../assets/ColorList";
import moment from "moment";
import { currentUser, CurrentUserType } from "../../app/user";
import { Link, useLocation } from "react-router-dom";
import { useHandleResizeTextArea } from "../../hooks/useHandleResizeTextArea";
import Emoji from "../../assets/Emoji";
import { listType, MessageType } from "../../types/type";
import { useDispatch } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import useCreateChat from "../../hooks/useCreateChat";

interface Props {
  users: CurrentUserType;
  myAccount: CurrentUserType;
}

interface SortMessageType {
  [key: string]: MessageType[];
}

const Chat = ({ myAccount, users }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [messages, setMessages] = useState(null);
  // const [sortMessages, setSortMessages] = useState<SortMessageType>({});
  const [sortMessages, setSortMessages] = useState<
    Array<[string, MessageType[]]>
  >([]);
  const [day, setDay] = useState([]);
  const [text, setText] = useState("");
  const [messageCollection, setMessageCollection] = useState(null);
  const containerRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLTextAreaElement>();
  const bottomListRef = useRef(null);
  const dispatch = useDispatch();
  const { handleResizeHeight } = useHandleResizeTextArea(textRef);

  const dayArr: { [key: number]: string } = {
    0: `일`,
    1: `월`,
    2: `화`,
    3: `수`,
    4: `목`,
    5: `금`,
    6: `토`,
  };

  // 화면 하단 스크롤
  useEffect(() => {
    bottomListRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. 채팅방 목록 및 정보 불러오기
  useEffect(() => {
    // 채팅방 입장 시 대화 내역 초기화 (렌더링 하는 순간에 다른 채팅방 유저 프로필이 보이기 때문)
    setMessages(null);

    const q = query(collection(dbService, `messages`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list: listType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const getInfo = list.filter(
        (res) =>
          res.member.includes(userObj.displayName) &&
          res.member.includes(users?.displayName)
      );
      setMessageCollection(getInfo[0]);
    });
    return () => unsubscribe();
  }, [userObj.displayName, users]);

  // 2. 채팅 내역 불러오기
  useEffect(() => {
    if (messageCollection?.id) {
      const unsubscribe = onSnapshot(
        doc(dbService, "messages", messageCollection?.id),
        (doc) => {
          setMessages(doc.data()); // 메세지 통으로 정리

          // 메세지 날짜별로 정리
          // 1. 객체로 생성 방법
          // const sections: { [key: string]: MessageType[] } = {};
          // doc.data().message?.forEach((chat: MessageType) => {
          //   const monthDate = moment(chat.createdAt).format("YYYY-MM-DD");
          //   if (Array.isArray(sections[monthDate])) {
          //     sections[monthDate].push(chat);
          //   } else {
          //     sections[monthDate] = [chat];
          //   }
          // });
          // setSortMessages(sections);

          // 2. Map으로 생성 방법
          const sections = new Map<string, MessageType[]>();
          doc?.data()?.message?.forEach((chat: MessageType) => {
            const monthDate = moment(chat.createdAt).format("YYYY년 M월 D일");
            const section = sections.get(monthDate);
            if (section) {
              section.push(chat);
            } else {
              sections.set(monthDate, [chat]);
            }

            // 요일 구하기
            const transDay = moment(chat.createdAt).format("YYYY-MM-DD");
            const getDay = dayArr[moment(transDay).day()];
            // 중복 체크
            setDay((prev: string[]) => {
              if (!prev.some((asd) => asd === getDay)) {
                return [...prev, getDay];
              } else {
                return prev;
              }
            });
          });

          setSortMessages(Array.from(sections));
        }
      );
      return () => unsubscribe();
    }
  }, [messageCollection?.id]);

  // 텍스트 입력
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // 메시지 전송
  const onSubmit = async () => {
    // 입력한 채팅 공백 제거
    const trimmedMessage = text.trim();

    // console.log(trimmedMessage);
    // 채팅 새로 만들기
    if (!messageCollection?.id) {
      await addDoc(collection(dbService, `sections`), {
        member: [userObj.displayName, users?.displayName],
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
    if (messages && messageCollection?.id) {
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
    textRef.current.style.height = "24px";
  };

  const onSendMessage = () => {
    onSubmit();
  };

  // Enter 전송 / Shift + Enter 줄바꿈
  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (text !== "" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === "Enter" && e.shiftKey) {
      setText((value) => value + "\n"); // 줄바꿈 문자열 추가
    }
  };

  // 메세지 읽음 확인
  const onReadMessage = useCallback(async () => {
    if (messages) {
      // 채팅 정보 값 변경
      const messageCopy = [...messages?.message];
      await updateDoc(doc(dbService, "messages", messageCollection?.id), {
        message: messageCopy.map((res) => {
          if (res?.displayName === users?.displayName) {
            return { ...res, isRead: true };
          } else {
            return { ...res };
          }
        }),
      });

      // 계정 메시지 정보 값 변경
      const copy = [...myAccount?.message];
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        message: copy.map((res) => {
          if (users.displayName === res.user) {
            return { ...res, isRead: true };
          } else {
            return { ...res };
          }
        }),
      });

      // store 메시지 정보 값 변경
      dispatch(
        currentUser({
          ...userObj,
          message: copy.map((res) => {
            if (users.displayName === res.user) {
              return { ...res, isRead: true };
            } else {
              return { ...res };
            }
          }),
        })
      );
    }
  }, [
    dispatch,
    messageCollection?.id,
    messages,
    myAccount?.message,
    userObj,
    users.displayName,
  ]);

  return (
    <>
      <Category>
        <ProfileInfoBox>
          <ProfileImageBox to={`/profile/${users?.displayName}/post`}>
            <ProfileImage src={users?.profileURL} alt="profile image" />
          </ProfileImageBox>
          <ProfileInfo>
            <ProfileDsName>{users?.displayName}</ProfileDsName>
            <ProfileName>{users?.name}</ProfileName>
          </ProfileInfo>
        </ProfileInfoBox>
        <DeleteChatBtn>
          <AiOutlineDelete />
        </DeleteChatBtn>
      </Category>
      <Conatiner ref={containerRef}>
        <MessageBox>
          {sortMessages?.map((arr: [string, MessageType[]], index: number) => {
            return (
              <GroupMessage key={arr[0]}>
                <GroupDateBox>
                  <GroupDate>{`${arr[0]} ${day[index]}요일`}</GroupDate>
                </GroupDateBox>
                {arr[1]?.map((res: MessageType, index: number) => {
                  const isMine = res?.displayName === userObj.displayName;
                  return (
                    <User key={res.createdAt} isMine={isMine}>
                      {!isMine && users && (
                        <ProfileImageBox
                          to={`/profile/${res?.displayName}/post`}
                        >
                          <ProfileImage
                            src={users?.profileURL}
                            alt="profile image"
                          />
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
              </GroupMessage>
            );
          })}
          <div ref={bottomListRef} />
        </MessageBox>
        <ChatBox>
          <TextAreaBox onSubmit={onSubmit}>
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
              onChange={onChange}
              onKeyDown={onKeyPress}
              // onKeyUp={onKeyPress}
              onInput={handleResizeHeight}
              placeholder="메시지 입력..."
            />
            {text.length > 0 && (
              <SendBtn type="button" onClick={onSendMessage} disabled={!text}>
                보내기
              </SendBtn>
            )}
          </TextAreaBox>
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
  justify-content: space-between;
  padding: 0 20px;
  gap: 12px;
  border-bottom: 1px solid ${thirdColor};
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
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const ProfileInfo = styled.div`
  cursor: pointer;
  /* flex: 1; */
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  gap: 2px;
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 12px;
  color: ${thirdColor};
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeleteChatBtn = styled.button`
  width: 24px;
  height: 24px;
  /* position: absolute; */
  /* right: 20px; */
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
  position: relative;
  padding: 0 20px 20px;
  height: 100;
`;

const GroupMessage = styled.div``;

const GroupDateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const GroupDate = styled.span`
  padding: 10px 20px;
  border: 1px solid #f3f3f3;
  background: #f3f3f3;
  border-radius: 20px;
  font-size: 12px;
  text-align: center;
`;

const User = styled.div<{ isMine: boolean }>`
  display: block;
  margin: 0;
  transition: all 0.15s linear;
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.isMine ? `row-reverse` : `row`)};
  &:not(:last-of-type) {
    margin-bottom: 14px;
  }
`;

const SendMessageBox = styled.div`
  margin: 0 10px;
`;

const SendMessage = styled.p<{ isMine: boolean }>`
  /* border: 1px solid #efefef; */
  border: 1px solid ${(props) => (props.isMine ? `#ffeee8` : `#efefef`)};
  background: ${(props) => (props.isMine ? `#ffeee8` : `#fff`)};
  padding: 8px 12px;
  border-radius: 20px;
  max-width: 230px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 16px;
  white-space: pre;
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

const TextAreaBox = styled.form`
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
