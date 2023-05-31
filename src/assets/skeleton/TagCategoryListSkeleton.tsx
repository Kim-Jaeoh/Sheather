import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import { useLocation } from "react-router-dom";

const TagCategoryListSkeleton = () => {
  const { pathname } = useLocation();

  return (
    <>
      {Array.from({ length: 10 }).map((res, index) => (
        <Container isFeed={pathname.includes("feed")} key={index}>
          <Profile>
            <Skeleton width={"100%"} height={"100%"} variant="rectangular" />
          </Profile>
          <TagInfo>
            <TagName>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </TagName>
            <TagCount>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </TagCount>
          </TagInfo>
        </Container>
      ))}
    </>
  );
};

export default TagCategoryListSkeleton;

const Container = styled.div<{ isFeed: boolean }>`
  display: flex;
  align-items: center;
  border: 2px solid #2aaa5f;
  flex: 1 1 40%;
  border-radius: 20px;
  width: 100%;
  height: 90px;
  overflow: hidden;

  @media (max-width: 767px) {
    justify-content: center;
    flex-direction: column;
    border-width: 1px;
    height: 70px;
    border-radius: 10px;
    height: 100%;
  }
`;

const Profile = styled.div`
  width: 120px;
  height: 90px;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 2px solid #2aaa5f;

  @media (max-width: 767px) {
    border: none;
    width: 172px;
    height: 172px;
  }
`;

const TagInfo = styled.div`
  padding-left: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  height: 100%;

  @media (max-width: 767px) {
    gap: 8px;
    padding: 0;
    margin: 10px 0;
    align-items: center;
  }
`;

const TagName = styled.div`
  width: 80px;
  height: 16px;

  @media (max-width: 767px) {
    width: 80px;
    height: 16px;
  }
`;

const TagCount = styled.div`
  width: 54px;
  height: 14px;
  @media (max-width: 767px) {
    width: 54px;
    height: 14px;
  }
`;
