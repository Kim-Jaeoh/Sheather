import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import ColorList from "../ColorList";
import { MasonryGrid } from "@egjs/react-grid";

const HomeSkeleton = () => {
  return (
    <MasonryGrid
      className="container"
      gap={20}
      defaultDirection={"end"}
      align={"stretch"}
      column={2}
      columnSize={0}
      columnSizeRatio={0}
    >
      {Array.from({ length: 6 }).map((res, index) => {
        return (
          <CardList key={index}>
            <Card>
              <Skeleton width={"100%"} height={"100%"} variant="rectangular" />
            </Card>
            <UserBox>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </UserBox>
          </CardList>
        );
      })}
    </MasonryGrid>
  );
};

export default HomeSkeleton;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const CardList = styled.li`
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 8px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  grid-row-end: span 43;
  border: 2px solid #dbdbdb;
  width: 318px;
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
  border-bottom: 2px solid ${secondColor};
  width: 314px;
  height: 314px;
  /* padding: 12px; */
  border-bottom: 2px solid #dbdbdb;
`;

const UserBox = styled.div`
  padding: 12px 12px;
  flex: 1;
  width: 314px;
  height: 84px;
  padding: 12px;
`;
