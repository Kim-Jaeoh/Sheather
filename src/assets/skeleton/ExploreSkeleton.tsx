import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import ColorList from "../ColorList";
import { FrameGrid } from "@egjs/react-grid";

const ExploreSkeleton = () => {
  return (
    <FrameGrid
      className="container"
      gap={10}
      defaultDirection={"end"}
      isConstantSize={true}
      preserveUIOnDestroy={true}
      observeChildren={true}
      frame={[
        [1, 1, 2, 2, 3, 3],
        [1, 1, 2, 2, 3, 3],
        [4, 4, 5, 5, 3, 3],
        [4, 4, 5, 5, 3, 3],
        [6, 6, 7, 7, 8, 8],
        [6, 6, 7, 7, 8, 8],
        [6, 6, 9, 9, 10, 10],
        [6, 6, 9, 9, 10, 10],
      ]}
      rectSize={0}
      useFrameFill={true}
    >
      {Array.from({ length: 10 }).map((res, index) => {
        return (
          <CardList key={index}>
            <Card>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </Card>
            {/* <UserBox>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </UserBox> */}
          </CardList>
        );
      })}
    </FrameGrid>
  );
};

export default ExploreSkeleton;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.ul`
  width: 100%;
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr; */
  /* grid-auto-rows: auto; */
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  /* margin: 10px; */
  border-radius: 8px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  grid-row-end: span 43;
  border: 2px solid #dbdbdb;
  /* width: 318px; */
  width: 100%;
  height: 404px;

  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const Card = styled.div`
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
  /* width: 314px; */
  /* height: 314px; */
  /* padding: 12px; */
  /* border-bottom: 2px solid #dbdbdb; */
`;

const UserBox = styled.div`
  padding: 12px 12px;
  flex: 1;
  width: 314px;
  height: 84px;
  padding: 12px;
`;
