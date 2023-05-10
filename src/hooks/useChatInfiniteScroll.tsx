import React, { useCallback, useEffect, useMemo, useState } from "react";
import { dbService } from "../fbase";
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

type Props = {
  chatId?: string;
  toBottom?: boolean;
  containerRef: React.MutableRefObject<HTMLDivElement>;
  isRead?: boolean;
  setPrevScrollHeight: React.Dispatch<number>;
};

interface DayType {
  createdAt: number;
  day: string;
}

const dayArr: { [key: number]: string } = {
  0: `일`,
  1: `월`,
  2: `화`,
  3: `수`,
  4: `목`,
  5: `금`,
  6: `토`,
};

const useChatInfiniteScroll = ({
  chatId,
  toBottom,
  containerRef,
  setPrevScrollHeight,
}: Props) => {
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  const [sortMessages, setSortMessages] = useState(null);
  const [sections, setSections] = useState(
    new Map<number, DocumentData[]>(null)
  );
  const [day, setDay] = useState<DayType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<number | DocumentData>(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (chatId) {
      getNextPage(); //최초 페이지 렌더링
    }
  }, [chatId]);

  // 더 불러오기
  useEffect(() => {
    if (toBottom && inView) {
      getNextPage();

      // 데이터 불러오기 이전 스크롤 값 저장
      setPrevScrollHeight(containerRef.current?.scrollHeight);
    }
  }, [inView, toBottom]);

  // 대화 내역 담기
  useEffect(() => {
    if (sections) {
      setSortMessages(
        Array.from(sections)
          .reverse()
          .sort((a, b) => a[0] - b[0])
      );
    }
  }, [sections]);

  const getNextPage = () => {
    let q;

    if (lastVisible === -1) {
      return;
    }

    if (lastVisible) {
      // 값 더 불러오기
      q = query(
        collection(doc(dbService, "messages", chatId), "message"),
        orderBy("createdAt", "desc"),
        limit(20),
        startAfter(lastVisible)
      );
    } else {
      // 처음 값
      q = query(
        collection(doc(dbService, "messages", chatId), "message"),
        orderBy("createdAt", "desc"),
        limit(15)
      );
    }

    const newUnsubscribe = onSnapshot(q, (snapshot) => {
      snapshot?.docs?.forEach((doc) => {
        // const monthDate = moment(doc.data().createdAt).format("YYYY년 M월 D일");
        const monthDate = moment(doc.data().createdAt).format("YYYY-MM-DD");
        const dateKey = new Date(monthDate).getTime();

        // 중복 체크
        setSections((prev) => {
          const newSections = new Map(prev);

          if (!newSections.has(dateKey)) {
            newSections.set(dateKey, []);
          }
          const section = newSections.get(dateKey);
          const isDuplicate = section.some(
            (data) => data.createdAt === doc.data().createdAt
          );
          if (!isDuplicate) {
            section.push(doc.data());
          }

          return newSections;
        });

        // 요일 구하기
        const getDay = dayArr[moment(doc.data().createdAt).day()];

        // 중복 체크
        setDay((prev) => {
          if (
            !prev.some(
              (res) =>
                moment(res.createdAt).format("YYYYMMDD") ===
                moment(doc.data().createdAt).format("YYYYMMDD")
            )
          ) {
            return [...prev, { createdAt: doc.data().createdAt, day: getDay }];
          } else {
            return prev;
          }
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

  const detachListeners = () => {
    return () => unsubscribe();
  };

  return {
    isLoading,
    day,
    sortMessages,
    sections,
    setIsLoading,
    setSortMessages,
    unsubscribe,
    detachListeners,
    ref,
  };
};

export default useChatInfiniteScroll;
