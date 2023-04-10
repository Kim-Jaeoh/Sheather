import { useEffect, useRef, useState } from "react";
import {
  CurrentUserType,
  MessageReadType,
  MessageType,
  NoticeArrType,
  listType,
} from "../types/type";

import useGetMyAccount from "./useGetMyAccount";
import { throttle } from "lodash";
import { query, collection, onSnapshot, doc } from "firebase/firestore";
import { dbService } from "../fbase";
import useThrottle from "./useThrottle";

interface NoticeMessageType {
  id: string;
  member: string[];
  message: MessageType[];
}

const useSendNoticeMessage = () => {
  const { userObj, myAccount } = useGetMyAccount();
  const [messageCollection, setMessageCollection] = useState(null);
  const [users, setUsers] = useState([]);
  const { takeThrottle } = useThrottle();

  const setNoticeMessage = (noticeText: string) => {
    const title = "SHEATHER";
    const body = noticeText;
    const icon = "./sheather_logo_s_svg";
    const options = { body, icon };

    new Notification(title, options);
  };
  const usePrevios = (value: NoticeArrType) => {
    const noticeRef = useRef(null);
    useEffect(() => {
      noticeRef.current = value;
    });
    return noticeRef.current;
  };

  const prevData = usePrevios(
    myAccount?.notice?.filter((res: NoticeArrType) => !res.isRead)
  );

  // 메시지 상대 계정 정보 가져오기
  useEffect(() => {
    myAccount?.message?.map(async (res: { user: string }) => {
      if (res.user) {
        onSnapshot(doc(dbService, "users", res.user), (doc) => {
          setUsers((prev: CurrentUserType[]) => {
            // 중복 체크
            if (!prev.some((user) => user.uid === doc.data().uid)) {
              return [...prev, doc.data()];
            } else {
              return prev;
            }
          });
        });
      }
    });
  }, [myAccount]);

  // 채팅방 정보 불러오기
  useEffect(() => {
    const q = query(collection(dbService, `messages`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list: listType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const getInfo = users?.map((user) => {
        return list?.filter(
          (doc) =>
            doc.member.includes(userObj.displayName) &&
            doc.member.includes(user?.displayName)
        );
      });
      setMessageCollection(getInfo.flat());
    });
    return () => unsubscribe();
  }, [userObj.displayName, users]);

  // 팔로우, 좋아요, 댓글 알림 보내기
  // useEffect(() => {
  const noticeCheck = myAccount?.notice?.filter(
    (res: NoticeArrType) => !res.isRead
  );
  const noticeFilter = noticeCheck?.at(-1);
  let noticeText: string = "";

  if (noticeFilter?.type === "like") {
    noticeText = `${noticeFilter.displayName}님이 회원님의 게시물을 좋아합니다.`;
  }
  if (noticeFilter?.type === "reply") {
    noticeText = `${noticeFilter.displayName}님이 회원님의 게시물에 댓글을 남겼습니다: )${noticeFilter?.text}`;
  }
  if (noticeFilter?.type === "follower") {
    noticeText = `${noticeFilter.displayName}님이 회원님을 팔로우하기 시작했습니다.`;
  }

  const onSendNotice = async () => {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setNoticeMessage(noticeText);
    }
  };

  if (
    noticeCheck?.length &&
    noticeText !== "" &&
    prevData?.length < noticeCheck?.length
  ) {
    onSendNotice();
  }
  // }, [myAccount?.notice]);

  // 메시지 알림 보내기
  // useEffect(() => {
  const messageCheck = messageCollection
    ?.map((res: NoticeMessageType) =>
      res.message.filter(
        (msg) => !msg.isRead && msg.displayName !== userObj.displayName
      )
    )
    .flat();
  const messageFilter: MessageType = messageCheck?.at(-1);
  if (messageFilter) {
    noticeText = `${messageFilter.displayName}님이 메시지를 보냈습니다.`;
  }

  const onSendMessage = async () => {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setNoticeMessage(noticeText);
    }
  };

  if (messageCheck?.length && noticeText !== "") {
    const setNotificationTimer = (timeout: number) => {
      takeThrottle(() => {
        onSendMessage();
      }, timeout);
    };
    setNotificationTimer(3000);
  }
  // }, [messageCollection, userObj.displayName]);

  return { setNoticeMessage };
};

export default useSendNoticeMessage;
