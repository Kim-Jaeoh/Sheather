import { useEffect, useRef, useState } from "react";
import useMediaScreen from "./useMediaScreen";

type Props = {
  dataLength?: number;
  lastLength: number;
};

const useFlickingArrow = ({ dataLength, lastLength }: Props) => {
  const flickingRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [visible2, setVisible2] = useState(true);
  const { isMobile } = useMediaScreen();

  // 이미지 변경 시마다 슬라이드 이동
  useEffect(() => {
    moveToFlicking(slideIndex);
  }, [slideIndex]);

  // 슬라이드 변경 (주어진 인덱스에 해당하는 패널로 이동)
  const moveToFlicking = async (index: number) => {
    const flicking = flickingRef.current;
    if (!flicking) {
      return;
    }

    // 무분별하게 이동 시 "Animation is already playing." 에러 뜨는 거 방지
    await flicking.moveTo(index).catch(() => {
      return;
    });
  };

  const onClickArrowPrev = () => {
    // 무분별하게 클릭할 경우 아이콘 엉키는 거 방지
    if (flickingRef.current.animating === true) {
      return;
    }
    if (slideIndex !== 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const onClickArrowNext = () => {
    // 무분별하게 클릭할 경우 아이콘 엉키는 거 방지
    if (flickingRef.current.animating === true) {
      return;
    }
    if (isMobile && slideIndex !== 6) {
      setSlideIndex(slideIndex + 1);
    }
    if (!isMobile && slideIndex !== 4) {
      setSlideIndex(slideIndex + 1);
    }
  };

  useEffect(() => {
    if (slideIndex === 0) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    if (slideIndex === dataLength - lastLength) {
      setVisible2(false);
    } else {
      setVisible2(true);
    }
  }, [dataLength, lastLength, slideIndex]);

  return {
    flickingRef,
    slideIndex,
    visible,
    visible2,
    setSlideIndex,
    onClickArrowPrev,
    onClickArrowNext,
  };
};

export default useFlickingArrow;
