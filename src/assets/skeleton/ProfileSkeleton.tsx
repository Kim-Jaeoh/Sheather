import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import ColorList from "../data/ColorList";
import { FrameGrid } from "@egjs/react-grid";
import { Link } from "react-router-dom";

const ProfileSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((res, index) => {
        return (
          <CardList key={index}>
            <div>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </div>
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
  overflow: hidden;
  border: 2px solid #dbdbdb;

  span {
    position: relative;
    display: block;
    padding-bottom: 100%;
  }

  @media (max-width: 767px) {
    border: none;
    border-radius: 0;
    animation: none;
  }
`;
