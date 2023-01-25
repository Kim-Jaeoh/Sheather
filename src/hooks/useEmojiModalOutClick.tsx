import React, { useEffect, useState } from "react";

export const useEmojiModalOutClick = (
  emojiRef: React.MutableRefObject<HTMLDivElement>,
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement>
) => {
  const [clickEmoji, setClickEmoji] = useState(false);

  // 이모지 모달 밖 클릭 시 창 끔
  useEffect(() => {
    if (!clickEmoji) return;
    const handleClick = (e: React.BaseSyntheticEvent | MouseEvent) => {
      // node.contains는 주어진 인자가 자손인지 아닌지에 대한 Boolean 값을 리턴함
      // emojiRef 내의 클릭한 영역의 타겟이 없으면 true
      if (!emojiRef.current.contains(e.target)) {
        setClickEmoji(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [clickEmoji, emojiRef]);

  const toggleEmoji = () => {
    setClickEmoji((prev) => !prev);
    // 이모지 토글 활성화 -> 한 번 클릭 시 꺼지는 거 방지
    if (clickEmoji) {
      setClickEmoji(true);
      textAreaRef.current.focus();
    }
  };

  return { clickEmoji, toggleEmoji };
};
