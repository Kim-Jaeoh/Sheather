import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { BsArrowUp } from "react-icons/bs";
import useMediaScreen from "../../hooks/useMediaScreen";
import { throttle } from "lodash";

type Props = {
  bgColor: string;
};

const TopButton = ({ bgColor }: Props) => {
  const [scrollY, setScrollY] = useState(0);
  const [topBtnStatus, setTopBtnStatus] = useState(false); // 버튼 상태
  const { isMobile } = useMediaScreen();

  const handleFollow = throttle(() => {
    if (window.scrollY > 1600) {
      setTopBtnStatus(true);
    } else {
      setTopBtnStatus(false);
    }
    setScrollY(window.scrollY);
  }, 1000);

  // 위로 가기
  useEffect(() => {
    window.addEventListener("scroll", handleFollow);

    return () => {
      window.removeEventListener("scroll", handleFollow);
    };
  }, []);

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setScrollY(0); // scrollY 의 값을 초기화
    if (scrollY === 0) {
      setTopBtnStatus(false);
    }
  };

  return (
    <>
      <TopButtonBox
        bgColor={bgColor}
        btnStatus={topBtnStatus}
        onClick={handleTop} // 버튼 클릭시 함수 호출
      >
        <Button>
          <BsArrowUp />
        </Button>
      </TopButtonBox>
      {isMobile && <Back btnStatus={topBtnStatus} />}
    </>
  );
};

export default TopButton;

const TopButtonBox = styled.div<{ btnStatus: boolean; bgColor: string }>`
  position: fixed;
  width: 48px;
  height: 48px;
  bottom: 24px;
  right: 24px;
  background: #fff;
  z-index: 100;
  opacity: ${(props) => (props.btnStatus ? 0.9 : 0)};
  border: 2px solid var(--second-color);
  border-radius: 50%;
  box-shadow: 4px 4px 0 -2px ${(props) => props.bgColor},
    4px 4px var(--second-color);
  transition: all 0.15s linear;

  @media screen and (max-width: 767px) {
    width: 34px;
    height: 34px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 72px;
    border-width: 1px;
    background: transparent;
    svg {
      width: 20px;
      height: 20px;
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
    color: var(--second-color);
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
