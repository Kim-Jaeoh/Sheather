import React, { useEffect, useMemo, useState } from "react";
import { CurrentUserType } from "../../types/type";
import { throttle as _throttle } from "lodash";

type Props = {
  containerRef: React.MutableRefObject<HTMLDivElement>;
  prevScrollHeight: number;
  sortMessages: any;
  setPrevScrollHeight: React.Dispatch<number>;
  setClickInfo: React.Dispatch<React.SetStateAction<CurrentUserType>>;
};

const useChatScrollTo = ({
  containerRef,
  prevScrollHeight,
  sortMessages,
  setPrevScrollHeight,
  setClickInfo,
}: Props) => {
  const [bottomStatus, setBottomStatus] = useState({
    show: false,
    toBottom: false,
  });

  // 채팅 불러올 때 이전 스크롤 값 위치 이동
  useEffect(() => {
    // prevScrollHeight 있을 시 현재 전체 스크롤 높이 값 - 과거 전체 스크롤 높이 값
    if (prevScrollHeight) {
      onScrollTo(containerRef?.current?.scrollHeight - prevScrollHeight);
      return setPrevScrollHeight(null);
    }

    // a. prevScrollHeight 없을 시 맨 아래로 이동
    onScrollTo(containerRef?.current?.scrollHeight);
  }, [sortMessages]);

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
        if (totalScrollHeight) {
          setBottomStatus((prev) => ({ ...prev, toBottom: true }));
        } else {
          setBottomStatus((prev) => ({ ...prev, toBottom: false }));
        }

        if (currentScrollPosition > 1500) {
          setBottomStatus((prev) => ({ ...prev, show: true }));
        } else {
          setBottomStatus((prev) => ({ ...prev, show: false }));
        }
      }, 500),
    []
  );

  // 스크롤 값 계산
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); //clean up
    };
  }, [handleScroll, setClickInfo]);

  return { bottomStatus, handleScroll };
};

export default useChatScrollTo;
