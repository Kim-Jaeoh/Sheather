import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { dbService } from "../../fbase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import ColorList from "../../assets/data/ColorList";
import moment from "moment";
import { currentUser } from "../../app/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useHandleResizeTextArea } from "../../hooks/useHandleResizeTextArea";
import Emoji from "../emoji/Emoji";
import { CurrentUserType, listType, MessageType } from "../../types/type";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import useMediaScreen from "../../hooks/useMediaScreen";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Props {
  userObj: CurrentUserType;
  users: CurrentUserType;
  setClickInfo: React.Dispatch<React.SetStateAction<CurrentUserType>>;
}

interface DayType {
  createdAt: number;
  day: string;
}

const Chat = ({ userObj, users, setClickInfo }: Props) => {
  const [messages, setMessages] = useState(null);
  const [sortMessages, setSortMessages] = useState<
    Array<[string, MessageType[]]>
  >([]);
  const [day, setDay] = useState<DayType[]>([]);
  const [text, setText] = useState("");
  const [messageCollection, setMessageCollection] = useState(null);
  const containerRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLTextAreaElement>();
  const bottomListRef = useRef(null);
  const dispatch = useDispatch();
  const { handleResizeHeight } = useHandleResizeTextArea(textRef);
  const navigate = useNavigate();
  const { isMobile } = useMediaScreen();

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
      const getInfo = list?.filter(
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
            const getDay = dayArr[moment(chat.createdAt).day()];

            // 중복 체크
            setDay((prev) => {
              if (!prev.some((res) => res.createdAt === chat.createdAt)) {
                return [...prev, { createdAt: chat.createdAt, day: getDay }];
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

    // 채팅 새로 만들기
    if (!messageCollection?.id) {
      await addDoc(collection(dbService, `messages`), {
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

      // 글 보낼 시 상대가 본인 메시지 안 읽은 것으로 변경
      const copy = [...users?.message];
      await updateDoc(doc(dbService, "users", users.displayName), {
        message: copy.map((res) => {
          if (userObj.displayName === res.user) {
            return { ...res, isRead: false };
          } else {
            return { ...res };
          }
        }),
      });
    }

    setText("");
    textRef.current.style.height = "24px";
  };

  const onClickSendMessage = () => {
    onSubmit();
  };

  // Enter 전송 / Shift + Enter 줄바꿈
  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (text !== "" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
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
      const copy = [...userObj?.message];
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
  }, [dispatch, messageCollection?.id, messages, userObj, users.displayName]);

  // 채팅방 나가기
  const onChatDelete = async () => {
    const filter = userObj?.message.filter(
      (res) => res.user !== users.displayName
    );

    navigate(`/message`);

    dispatch(
      currentUser({
        ...userObj,
        message: filter,
      })
    );

    await updateDoc(doc(dbService, "users", userObj.displayName), {
      message: filter,
    }).then(() => {
      setClickInfo(null);
      return toast.success("대화방이 삭제되었습니다.");
    });

    deleteDocument();
  };

  // 본인, 상대방 둘 다 채팅방 없을 때 문서 삭제
  const deleteDocument = async () => {
    const myFilter = userObj?.message.filter(
      (res) => res.user === users.displayName
    );
    const userFilter = users?.message.filter(
      (res) => res.user === userObj.displayName
    );
    const collectionRef = doc(dbService, "messages", myFilter[0].id);

    if (myFilter.length !== userFilter.length) {
      // 컬렉션 삭제
      await deleteDoc(collectionRef)
        .then(() => {
          console.log("document delete success");
        })
        .catch((error) => {
          console.error("document delete fail: ", error);
        });
    }
  };

  const onBackClick = () => {
    setClickInfo(null);
    navigate(`/message`);
  };

  return (
    <>
      <Category>
        <IconBox onClick={onBackClick}>
          <IoIosArrowBack />
        </IconBox>
        <ProfileInfoBox>
          <ProfileImageBox to={`/profile/${users?.displayName}/post`}>
            <ProfileImage
              onContextMenu={(e) => e.preventDefault()}
              src={users?.profileURL}
              alt="profile image"
            />
          </ProfileImageBox>
          <ProfileInfo>
            <ProfileDsName>{users?.displayName}</ProfileDsName>
            <ProfileName>{users?.name}</ProfileName>
          </ProfileInfo>
        </ProfileInfoBox>
        <DeleteChatBtn type="button" onClick={onChatDelete}>
          <RiDeleteBin6Line />
        </DeleteChatBtn>
      </Category>
      <Conatiner ref={containerRef}>
        <MessageBox>
          {sortMessages?.map((arr: [string, MessageType[]], index: number) => {
            return (
              <GroupMessage key={arr[0]}>
                <GroupDateBox>
                  <GroupDate>{`${arr[0]} ${day[index].day}요일`}</GroupDate>
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
                            onContextMenu={(e) => e.preventDefault()}
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
            {!isMobile && (
              <Emoji
                setText={setText}
                textRef={textRef}
                right={-270}
                bottom={40}
              />
            )}
            <TextArea
              spellCheck="false"
              maxLength={120}
              value={text}
              ref={textRef}
              onClick={onReadMessage}
              onChange={onChange}
              onKeyDown={onKeyPress}
              onInput={handleResizeHeight}
              placeholder="메시지 입력..."
            />
            {text.length > 0 && (
              <SendBtn
                type="button"
                onClick={onClickSendMessage}
                disabled={!text}
              >
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
  gap: 20px;
  border-bottom: 1px solid ${thirdColor};
  @media (max-width: 767px) {
    padding: 0 16px;
  }
`;

const IconBox = styled.button`
  width: 24px;
  height: 24px;
  margin-left: -4px;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;

    /* path:last-of-type {
      color: #ff5c1b;
    } */
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
  line-height: 20px;
  white-space: pre-line;
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
  margin-right: 10px;
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
