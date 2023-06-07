import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import moment from "moment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Emoji from "../emoji/Emoji";
import {
  CurrentUserType,
  MessageListType,
  MessageReadType,
  MessageType,
} from "../../types/type";
import { toast } from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import useMediaScreen from "../../hooks/useMediaScreen";
import { RiDeleteBin6Line } from "react-icons/ri";
import useSendNoticeMessage from "../../hooks/actions/useSendNoticeMessage";
import BottomButton from "../scrollButton/BottomButton";
import { Spinner } from "../../assets/spinner/Spinner";
import { throttle as _throttle } from "lodash";
import useChatInfiniteScroll from "../../hooks/infinityScroll/useChatInfiniteScroll";
import useThrottle from "../../hooks/useThrottle";

interface Props {
  users: CurrentUserType;
  myAccount: CurrentUserType;
  messageCollection: MessageListType;
  setClickInfo: React.Dispatch<React.SetStateAction<CurrentUserType>>;
}

interface SubCollectionType extends MessageType {
  id: string;
}

const InfiniteChat = ({
  users,
  myAccount,
  messageCollection,
  setClickInfo,
}: Props) => {
  const [chatId, setChatId] = useState([]);
  const [text, setText] = useState("");
  const [btnStatus, setBtnStatus] = useState({
    show: false,
    toBottom: false,
  }); // 버튼 상태
  const [sendLoading, setSendLoading] = useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomListRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { isMobile } = useMediaScreen();
  const { throttle } = useThrottle();
  const { pathname } = useLocation();
  const {
    isLoading,
    day,
    sortMessages,
    detachListeners,
    ref: moreRef,
  } = useChatInfiniteScroll({
    chatId: messageCollection?.id,
    toBottom: btnStatus.toBottom,
    containerRef,
    setPrevScrollHeight,
  });
  const { sendMessage } = useSendNoticeMessage(users);

  // 채팅 불러올 때 이전 스크롤 값 위치 이동
  useEffect(() => {
    // prevScrollHeight 있을 시 현재 전체 스크롤 높이 값 - 과거 전체 스크롤 높이 값
    if (prevScrollHeight) {
      onScrollTo(containerRef?.current?.scrollHeight - prevScrollHeight);
      return setPrevScrollHeight(null);
    }
    // prevScrollHeight 없을 시 맨 아래로 이동
    bottomListRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortMessages]);

  // 채팅방 이탈 시 채팅 리스너 해제
  useEffect(() => {
    if (!pathname.split("/")[2]) {
      onBackClick();
    }
  }, [pathname]);

  const onScrollTo = (height: number) => {
    if (height) {
      containerRef.current.scrollTop = Number(height);
    }
  };

  const handleScroll = useMemo(
    () =>
      _throttle((e) => {
        e.preventDefault();
        const totalScrollHeight = containerRef?.current?.scrollHeight; // 전체 스크롤 높이 값
        const clientHeight = containerRef?.current?.clientHeight; // 클라이언트 높이
        const currentScrollPosition = containerRef?.current?.scrollTop; // 현재 스크롤 위치 값
        const scrollDifference = totalScrollHeight - currentScrollPosition; // 전체 스크롤 값 - 현재 스크롤 값

        // 스크롤 맨 아래 감지
        if (currentScrollPosition + clientHeight === totalScrollHeight) {
          setBtnStatus((prev) => ({ ...prev, toBottom: true }));
        }

        if (scrollDifference > 1500) {
          setBtnStatus((prev) => ({ ...prev, show: true }));
        } else {
          setBtnStatus((prev) => ({ ...prev, show: false }));
        }
      }, 200),
    []
  );

  // 스크롤 값 계산
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); //clean up
    };
  }, [handleScroll, setClickInfo]);

  // 1. 서브 컬렉션 ID값 가져오기
  useEffect(() => {
    if (messageCollection) {
      const docRef = doc(dbService, "messages", messageCollection?.id);
      const subCollectionRef = collection(docRef, "message");
      const q = query(subCollectionRef);
      // const q = query(subCollectionRef, where("email", "==", users?.email)); // 내꺼

      const unsubscribe = onSnapshot(q, (doc) => {
        const collectionId = doc.docs.map((res) => {
          return { id: res.id, ...res.data() };
        });
        setChatId(collectionId);
      });

      return () => unsubscribe();
    }
  }, [messageCollection, users?.email]);

  // 텍스트 입력
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    textRef.current.style.height = `auto`;
    textRef.current.style.height = textRef.current.scrollHeight + `px`;
  };

  // 메시지 전송
  const onSubmit = async () => {
    setSendLoading(true);

    // 입력한 채팅 공백 제거
    const trimmedMessage = text.trim();

    // 채팅방에 글 보내기
    if (messageCollection?.id) {
      const docRef = doc(dbService, "messages", messageCollection?.id);
      const subCollectionRef = collection(docRef, "message");
      const sendChat = addDoc(subCollectionRef, {
        text: trimmedMessage,
        createdAt: +Date.now(),
        uid: myAccount?.uid,
        displayName: myAccount?.displayName,
        email: myAccount?.email,
        isRead: false,
      });

      // 글 보낼 시 상대가 본인 메시지 안 읽은 것으로 변경
      const copy = [...users?.message];
      const editUserIsntRead = updateDoc(
        doc(dbService, "users", users?.email),
        {
          message: copy.map((res) => {
            if (myAccount?.displayName === res.user) {
              return { ...res, isRead: false };
            } else {
              return res;
            }
          }),
        }
      );

      setText("");
      textRef.current.style.height = `auto`;

      await Promise.all([sendChat, editUserIsntRead]).then(() => {
        // 스크롤 하단으로 이동
        if (containerRef.current) {
          containerRef.current.scrollTop = Number(
            containerRef.current?.scrollHeight
          );
        }
        setSendLoading(false);

        // 알림 보내기
        if (users?.email) {
          throttle(
            () =>
              sendMessage(
                trimmedMessage,
                `${process.env.REACT_APP_PUBLIC_URL}/message/${users?.displayName}`
              ),
            3000
          );
        }
      }); // 병렬 처리
    }
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
    if (myAccount?.message?.some((res) => !res.isRead)) {
      // 채팅 정보 값 변경
      const update = (sub: SubCollectionType) => {
        const docRef = doc(
          dbService,
          "messages",
          messageCollection?.id,
          "message",
          sub.id
        );
        updateDoc(docRef, {
          isRead: true,
        });
      };

      const chatInfoUpdate = () => {
        // 안 읽은 게 있을 때만 실행
        if (chatId.some((res) => !res.isRead)) {
          const filter = chatId.filter((res) => !res.isRead);
          filter.forEach((obj) => {
            update(obj);
          });
        }
      };

      // 계정 메시지 정보 값 변경
      const copy = [...myAccount?.message];
      const myInfoUpdate = updateDoc(
        doc(dbService, "users", myAccount?.email),
        {
          message: copy.map((res) => {
            if (users?.email === res.email) {
              return { ...res, isRead: true };
            } else {
              return { ...res };
            }
          }),
        }
      );

      await Promise.all([chatInfoUpdate(), myInfoUpdate]);
    }
  }, [
    chatId,
    messageCollection?.id,
    myAccount?.email,
    myAccount?.message,
    users?.email,
  ]);

  // 채팅방 나가기
  const onChatDelete = async () => {
    const filter = myAccount?.message.filter(
      (res) => res.email !== users?.email
    );

    navigate(`/message`);

    await updateDoc(doc(dbService, "users", myAccount?.email), {
      message: filter,
    }).then(() => {
      setClickInfo(null);
      return toast.success("대화방이 삭제되었습니다.");
    });

    deleteDocument();
  };

  // 본인, 상대방 둘 다 채팅방 없을 때 문서 삭제
  const deleteDocument = async () => {
    const myFilter = myAccount?.message.filter(
      (res) => res.email === users?.email
    );
    const userFilter = users?.message.filter(
      (res: MessageReadType) => res.email === myAccount?.email
    );

    if (myFilter.length !== userFilter.length) {
      // 하위 컬렉션 문서 삭제
      const deleteSubCollection = async (sub: SubCollectionType) => {
        const subCollectionRef = doc(
          dbService,
          "messages",
          messageCollection?.id,
          "message",
          sub.id
        );
        try {
          await deleteDoc(subCollectionRef);
        } catch (error) {
          console.log("error deleting sub-collection document:", error);
        }
      };
      // 상위 컬렉션 삭제
      const deleteCollection = async () => {
        const collectionRef = doc(dbService, "messages", myFilter[0].id);
        try {
          await deleteDoc(collectionRef);
          console.log("document delete success");
        } catch (error) {
          console.error("document delete fail: ", error);
        }
      };
      // 삭제 실행
      const deleteCollections = async () => {
        // 하위 컬렉션 문서들 삭제
        // forEach(비동기) 사용 시 원하지 않는 순서로 실행될 수 있어서 for문(동기)으로 실행
        // (for문 = 에러 시 이벤트 중단 / forEach = 에러 상관없이 실행, but 원치않는 순서로 실행할 수 있음)
        for (const obj of chatId) {
          await deleteSubCollection(obj);
        }
        // 서브 컬렉션 문서들 삭제 후 상위 컬렉션 삭제
        await deleteCollection();
      };
      deleteCollections().catch((error) => {
        console.error("deleteCollections failed:", error);
      });
    }
  };

  const onBackClick = () => {
    detachListeners();
    setClickInfo(null);
    navigate(`/message`);
  };

  return (
    <>
      {users && (
        <>
          {isLoading ? (
            <Wrapper>
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
              <Conatiner>
                <BottomButton
                  btnStatus={btnStatus.show}
                  bottomListRef={bottomListRef}
                />
                <MessageBox ref={containerRef} onScroll={handleScroll}>
                  <div
                    ref={moreRef}
                    style={{
                      position: "absolute",
                      top: "0",
                    }}
                  />
                  {sortMessages &&
                    sortMessages?.map(
                      (arr: [string, MessageType[]], index: number) => {
                        const monthDate = moment(arr[0]).format(
                          "YYYY년 M월 D일"
                        );
                        const date = day.sort(
                          (a, b) => a.createdAt - b.createdAt
                        );

                        return (
                          <GroupMessage key={arr[0]}>
                            <GroupDateBox>
                              <GroupDate>{`${monthDate} ${date[index]?.day}요일`}</GroupDate>
                            </GroupDateBox>
                            {arr[1]
                              .sort((a, b) => a.createdAt - b.createdAt)
                              .map((res, idx, self) => {
                                const isMine =
                                  res?.displayName === myAccount?.displayName;

                                return (
                                  <User key={res.createdAt} isMine={isMine}>
                                    {!isMine && users && (
                                      <ProfileImageBox
                                        to={`/profile/${res?.displayName}/post`}
                                      >
                                        <ProfileImage
                                          onContextMenu={(e) =>
                                            e.preventDefault()
                                          }
                                          src={users?.profileURL}
                                          alt="profile image"
                                        />
                                      </ProfileImageBox>
                                    )}
                                    <SendMessageBox>
                                      <SendMessage isMine={isMine}>
                                        {res?.text}
                                      </SendMessage>
                                    </SendMessageBox>
                                    <SeneMessageAt isMine={isMine}>
                                      <Read>
                                        <>{res?.isRead ? " " : "1"}</>
                                      </Read>
                                      {moment(res?.createdAt).format(`HH:mm`)}
                                    </SeneMessageAt>
                                  </User>
                                );
                              })}
                          </GroupMessage>
                        );
                      }
                    )}
                  <div
                    ref={bottomListRef}
                    // style={{ height: "20px", border: `1px solid red` }}
                  />
                </MessageBox>
                <ChatBox>
                  <TextAreaBox sendLoading={sendLoading} onSubmit={onSubmit}>
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
                      rows={1}
                      ref={textRef}
                      onClick={onReadMessage}
                      onChange={onChange}
                      onKeyDown={onKeyPress}
                      placeholder={
                        sendLoading ? "전송 중..." : "메시지 입력..."
                      }
                      readOnly={sendLoading}
                    />
                    {sendLoading ? (
                      <LoadingBox>
                        <Spinner />
                      </LoadingBox>
                    ) : (
                      <>
                        {text.length > 0 && (
                          <SendBtn
                            type="button"
                            onClick={onClickSendMessage}
                            disabled={!text}
                          >
                            보내기
                          </SendBtn>
                        )}
                      </>
                    )}
                  </TextAreaBox>
                </ChatBox>
              </Conatiner>
            </Wrapper>
          ) : (
            <Spinner />
          )}
        </>
      )}
    </>
  );
};

export default InfiniteChat;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Category = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 20px;
  border-bottom: 1px solid var(--third-color);
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
  border: 1px solid var(--fourth-color);
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
  user-select: none;
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
  user-select: none;
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
  user-select: none;
`;

const ProfileName = styled.p`
  font-size: 12px;
  color: var(--third-color);
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
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

const Conatiner = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  scroll-behavior: auto;
  position: relative;
  padding: 0 20px 20px;
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
  color: var(--third-color);
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
  border-top: 1px solid var(--third-color);
  display: flex;
  align-items: center;
  padding: 20px;
`;

const TextAreaBox = styled.form<{ sendLoading: boolean }>`
  border: 1px solid var(--third-color);
  border-radius: 22px;
  display: flex;
  align-items: center;
  min-height: 44px;
  width: 100%;
  padding: 0 10px;
  margin-right: 10px;
  position: relative;

  background: ${(props) => (props.sendLoading ? "#f1f1f1" : "#fff")};
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
  background: transparent;
`;

const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  div {
    width: 20px;
    height: 20px;
  }
`;

const SendBtn = styled.button`
  display: flex;
  flex: 1 0 auto;
  padding: 0;
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
