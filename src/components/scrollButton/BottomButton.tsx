import React from "react";
import styled from "@emotion/styled";
import { BsArrowDown } from "react-icons/bs";

type Props = {
  btnStatus: boolean;
  bottomListRef: React.MutableRefObject<HTMLDivElement>;
};

const BottomButton = ({ btnStatus, bottomListRef }: Props) => {
  const handleBottom = () => {
    bottomListRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <BottomButtonBox
        btnStatus={btnStatus}
        onClick={handleBottom} // 버튼 클릭시 함수 호출
      >
        <Button>
          <BsArrowDown />
        </Button>
      </BottomButtonBox>
      <Back btnStatus={btnStatus} />
    </>
  );
};

export default BottomButton;

const BottomButtonBox = styled.div<{ btnStatus: boolean }>`
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 96px;
  right: 30px;
  background: #fff;
  z-index: 100;
  opacity: ${(props) => (props.btnStatus ? 1 : 0)};
  border: 1px solid var(--second-color);
  border-radius: 50%;
  transition: all 0.15s linear;

  @media screen and (max-width: 767px) {
    width: 34px;
    height: 34px;
    box-shadow: none;
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
  position: absolute;
  width: 100%;
  height: 66px;
  bottom: 84px;
  background: linear-gradient(to top, #e0e0e0, rgb(224, 224, 224, 0));
  opacity: ${(props) => (props.btnStatus ? 1 : 0)};
  transition: all 0.15s linear;
`;
