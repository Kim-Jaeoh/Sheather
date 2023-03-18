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
  width: 318px;
  height: 404px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 2px solid #22222222;
`;

const Card = styled.div`
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  border-bottom: 2px solid #22222222;
  height: 314px;
`;

const UserBox = styled.div`
  padding: 12px 12px;
  flex: 1;
  padding: 12px;
`;
