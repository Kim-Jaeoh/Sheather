import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import ColorList from "../ColorList";
import { FrameGrid } from "@egjs/react-grid";

const ProfileSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((res, index) => {
        return (
          <CardList key={index}>
            <Skeleton width={"100%"} height={"100%"} variant="rounded" />
          </CardList>
        );
      })}
    </>
  );
};

export default ProfileSkeleton;

const CardList = styled.div`
  border-radius: 20px;
  display: block;
  flex: 1 0 30%;
  height: 200px;
  overflow: hidden;
  border: 2px solid #dbdbdb;
`;
