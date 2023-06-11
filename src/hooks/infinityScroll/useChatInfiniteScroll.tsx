import React, { useEffect, useMemo, useState } from "react";
import { dbService } from "../../fbase";
import {
  collection,
  query,
  limit,
  onSnapshot,
  orderBy,
  doc,
  startAfter,
  DocumentData,
} from "firebase/firestore";
import { useInView } from "react-intersection-observer";
import moment from "moment";
import { MessageType } from "../../types/type";

type Props = {
  chatId?: string;
  toBottom?: boolean;
  containerRef: React.MutableRefObject<HTMLDivElement>;
  isRead?: boolean;
  setPrevScrollHeight: React.Dispatch<number>;
};

const useChatInfiniteScroll = ({
  chatId,
  toBottom,
  containerRef,
  setPrevScrollHeight,
}: Props) => {
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  const [sortMessages, setSortMessages] = useState(
    new Map<number, MessageType[]>(null)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<number | DocumentData>(null);
  const { ref, inView } = useInView();

  //최초 페이지 렌더링 (chatId = Firebase 채팅 컬렉션 id 값)
  useEffect(() => {
    if (chatId) {
      getNextPage();
    }
  }, [chatId]);

  // 더 불러오기
  useEffect(() => {
    if (inView && toBottom) {
      // 데이터 불러오기 이전 스크롤 값 저장
      setPrevScrollHeight(containerRef.current?.scrollHeight);
      getNextPage();
    }
  }, [inView, toBottom]);

  const getNextPage = () => {
    let q;

    if (lastVisible === -1) {
      return;
    }

    if (!lastVisible) {
      // 처음 값
      q = query(
        collection(doc(dbService, "messages", chatId), "message"),
        orderBy("createdAt", "desc"),
        limit(15)
      );
    } else {
      // 값 더 불러오기
      q = query(
        collection(doc(dbService, "messages", chatId), "message"),
        orderBy("createdAt", "desc"),
        limit(20),
        startAfter(lastVisible) // 이전에 불러온 게시글의 다음 글부터 불러옴
      );
    }

    const newUnsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docData = change.doc.data() as MessageType;
        const monthDate = moment(docData.createdAt).format("YYYY-MM-DD");
        const dateKey = new Date(monthDate).getTime();

        // 날짜별로 섹션 묶기
        setSortMessages((prev) => {
          const newSections = new Map(prev);

          if (!newSections.has(dateKey)) {
            newSections.set(dateKey, []);
          }

          const section = newSections.get(dateKey);
          const existingIndex = section.findIndex(
            (data) => data.createdAt === docData.createdAt
          );

          // 문서가 추가된 경우 (메세지 발신/수신)
          if (change.type === "added" && existingIndex === -1) {
            section.push(docData);
          }

          // 문서가 변경된 경우 (메세지 확인)
          if (change.type === "modified" && existingIndex !== -1) {
            section[existingIndex] = docData;
          }

          return newSections;
        });
      });

      setIsLoading(true);

      if (snapshot.docs.length === 0) {
        setLastVisible(-1);
      } else {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    });

    setUnsubscribe(() => newUnsubscribe);
  };

  // 리스너 분리
  const detachListeners = () => {
    return () => {
      unsubscribe();
      setIsLoading(false);
    };
  };

  return {
    isLoading,
    sortMessages,
    setIsLoading,
    unsubscribe,
    detachListeners,
    ref,
  };
};

export default useChatInfiniteScroll;
