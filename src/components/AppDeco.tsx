/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useEffect, useMemo, useRef } from "react";
import DecoCircleType from "circletype";
import { useLocation } from "react-router-dom";

type BgColor = {
  [key: string]: string;
};

const AppDeco = () => {
  const circleInstance = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    new DecoCircleType(circleInstance.current);
  }, []);

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
      <DecoDecoCircleBox>
        <DecoCircle>
          <Text ref={circleInstance}>
            · SHEATHER · SHEATHER · SHEATHER · SHEATHER ·
          </Text>
          <EmptyDecoCircle bgColor={bgColor} />
        </DecoCircle>
      </DecoDecoCircleBox>
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

const DecoDecoCircleBox = styled.div`
  position: absolute;
  bottom: -110px;
  right: -110px;
  width: 300px;
  height: 300px;
  background: #222;
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
`;

const EmptyDecoCircle = styled.div<{ bgColor: string }>`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor};
`;

const Text = styled.p`
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  font-weight: bold;
  font-size: 28px;
  white-space: pre-line;
  animation: rotate 15s linear infinite;

  /* 띄어쓰기 안 먹히는 거 조정 */
  > div span:first-of-type {
    display: none;
  }

  @keyframes rotate {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
