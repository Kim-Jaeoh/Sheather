import React from "react";
import {
  collection,
  query,
  orderBy,
  startAt,
  endBefore,
  onSnapshot,
  getDocs,
  limit,
} from "firebase/firestore";
import { dbService } from "../fbase";

type Props = {};

const useTest = (props: Props) => {
  const messages = [];
  const listeners: any[] = [];
  let start: any = null;
  let end = null;

  const getMessages = (chatId: any) => {
    const chatRef = collection(dbService, "chats", chatId);
    // const messageRef = collection(chatRef, "messages");
    const messageRef = collection(dbService, "messages-123");

    const firstQuery = query(
      messageRef,
      orderBy("createdAt", "desc"),
      limit(50)
    );
    getDocs(firstQuery).then((snapshots) => {
      start = snapshots.docs[snapshots.docs.length - 1];

      const listener = onSnapshot(
        query(messageRef, orderBy("createdAt"), startAt(start)),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              messages.push(change.doc.data());
            }
          });
        }
      );
      // 목록에 리스너 추가
      listeners.push(listener);
    });
  };

  const getMoreMessages = (chatId: any) => {
    const chatRef = collection(dbService, "chats", chatId);
    // const messageRef = collection(chatRef, "messages");
    const messageRef = collection(dbService, "messages-123");

    const nextQuery = query(
      messageRef,
      orderBy("createdAt", "desc"),
      startAt(start),
      limit(50)
    );

    getDocs(nextQuery).then((snapshots) => {
      // 이전 시작 경계는 새로운 끝 경계가 됨
      end = start;
      start = snapshots.docs[snapshots.docs.length - 1];

      // 새 경계를 사용하여 다른 리스너 생성
      const listener = onSnapshot(
        query(messageRef, orderBy("createdAt"), startAt(start), endBefore(end)),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              messages.push(change.doc.data());
            }
          });
        }
      );

      listeners.push(listener);
    });
  };

  // 모든 리스너 분리 호출
  const detachListeners = () => {
    listeners.forEach((listener) => listener());
  };

  return <div>useTest</div>;
};

export default useTest;
