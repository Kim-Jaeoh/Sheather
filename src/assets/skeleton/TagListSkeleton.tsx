import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";

const TagListSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((res, index) => (
        <Container key={index}>
          <Skeleton width={12} height={12} variant="rectangular" />
          <Box>
            <Skeleton width={"100%"} height={"100%"} />
            <Skeleton width={"100%"} height={"100%"} />
          </Box>
        </Container>
      ))}
    </>
  );
};

export default TagListSkeleton;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  height: 56px;
`;

const Box = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-left: 18px;
`;
