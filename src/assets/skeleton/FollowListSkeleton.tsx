import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";

const FollowListSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((res, index) => (
        <Container key={index}>
          <SmallBox>
            <Skeleton width={12} height={12} variant="circular" />
          </SmallBox>
          <Skeleton width={"100%"} height={"100%"} />
        </Container>
      ))}
    </>
  );
};

export default FollowListSkeleton;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  height: 56px;
`;

const SmallBox = styled.div`
  margin-right: 18px;
`;
