import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { BsArrowDown } from "react-icons/bs";
import ColorList from "../../assets/data/ColorList";
import useMediaScreen from "../../hooks/useMediaScreen";

type Props = {
  containerRef: React.MutableRefObject<HTMLDivElement>;
  bottomListRef: React.MutableRefObject<HTMLDivElement>;
};

const BottomButton = ({ containerRef, bottomListRef }: Props) => {
  const [bottomBtnStatus, setBottomBtnStatus] = useState(false); // 버튼 상태
  const { isMobile } = useMediaScreen();

  // 아래로 가기
  useEffect(() => {
    const getScrollDifference = () => {
      const totalScrollHeight = containerRef?.current?.scrollHeight; // 전체 스크롤 높이 값
      const currentScrollPosition = window.pageYOffset; // 현재 문서의 수직 스크롤 위치 값
      const scrollDifference = totalScrollHeight - currentScrollPosition; // 전체 스크롤 값에서 현재 스크롤 값 뺀 차이값

      if (scrollDifference > 2000) {
        setBottomBtnStatus(true);
      } else {
        setBottomBtnStatus(false);
      }
    };

    window.addEventListener("scroll", getScrollDifference);

    return () => {
      window.removeEventListener("scroll", getScrollDifference);
    };
  }, [containerRef]);

  const handleBottom = () => {
    // 클릭하면 스크롤이 위로 올라가는 함수
    bottomListRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <BottomButtonBox
        btnStatus={bottomBtnStatus}
        onClick={handleBottom} // 버튼 클릭시 함수 호출
      >
        <Button>
          <BsArrowDown />
        </Button>
      </BottomButtonBox>
      {isMobile && <Back btnStatus={bottomBtnStatus} />}
    </>
  );
};

export default BottomButton;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const BottomButtonBox = styled.div<{ btnStatus: boolean }>`
  position: fixed;
  width: 48px;
  height: 48px;
  bottom: 24px;
  right: 24px;
  /* right: 630px; */
  /* left: 50%; */
  /* transform: translateX(-50%); */
  background: #fff;
  z-index: 100;
  opacity: ${(props) => (props.btnStatus ? 0.9 : 0)};
  border: 2px solid ${secondColor};
  border-radius: 50%;
  box-shadow: 4px 4px 0 -2px #ff5c1b, 4px 4px ${secondColor};
  transition: all 0.15s linear;

  @media screen and (max-width: 767px) {
    width: 34px;
    height: 34px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 72px;
    border-width: 1px;
    background: transparent;
    box-shadow: none;
    svg {
      width: 20px;
      height: 20px;
      color: ${secondColor};
    }
  }
`;

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: ${secondColor};
  }
`;

const Back = styled.div<{ btnStatus: boolean }>`
  position: fixed;
  bottom: 60px;
  width: calc(100% - 34px);
  height: 66px;
  background: linear-gradient(to top, #e0e0e0, rgb(224, 224, 224, 0));
  opacity: ${(props) => (props.btnStatus ? 1 : 0)};
  transition: all 0.15s linear;
`;
