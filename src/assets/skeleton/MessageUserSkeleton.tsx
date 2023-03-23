import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";

const MessageuserSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((res, index) => (
        <Container key={index}>
          <SmallBox>
            <Skeleton width={40} height={40} variant="circular" />
          </SmallBox>
          <Skeleton width={"100%"} height={"100%"} />
        </Container>
      ))}
    </>
  );
};

export default MessageuserSkeleton;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
  margin: 0;
  padding: 14px 16px;
  height: 70px;
`;

const SmallBox = styled.div``;
