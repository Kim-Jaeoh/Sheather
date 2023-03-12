import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import ColorList from "../ColorList";
import { FrameGrid } from "@egjs/react-grid";

const ProfileSkeleton = () => {
  return (
    <>
      {Array.from({ length: 9 }).map((res, index) => {
        return (
          <CardList key={index}>
            <Card>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </Card>
          </CardList>
        );
      })}
    </>
  );
};

export default ProfileSkeleton;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  border: 2px solid #dbdbdb;
  width: 184px;
  height: 184px;
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
