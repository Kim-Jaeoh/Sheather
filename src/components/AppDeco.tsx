/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import decoCircle from "../assets/image/deco_circle.png";

type BgColor = {
  [key: string]: string;
};

const AppDeco = () => {
  const { pathname } = useLocation();

  const bgColor = useMemo(() => {
    const bgArr: BgColor = {
      feed: `#ffd5dc`,
      weather: `#d4e9ff`,
      message: `#ffd8c8`,
      profile: `#ebe4ff`,
      explore: `#e8fff2`,
    };

    const key = pathname.split("/")[1];
    return bgArr[key];
  }, [pathname]);

  return (
    <Container bgColor={bgColor}>
      <DecoCircleBox>
        <DecoCircle>
          <img src={decoCircle} alt="" />
        </DecoCircle>
      </DecoCircleBox>
    </Container>
  );
};

export default AppDeco;

const Container = styled.div<{ bgColor: string }>`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: hidden;
  background-color: ${(props) => props.bgColor};
  /* background-image: url("/bg.svg"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E"); */
  background-image: url("/image/bg.png");
`;

const DecoCircleBox = styled.div`
  position: absolute;
  bottom: -106px;
  right: -106px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DecoCircle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  animation: rotate 15s linear infinite;
  @keyframes rotate {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
