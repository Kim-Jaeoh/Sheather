import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import { useLocation } from "react-router-dom";
import useMediaScreen from "../../hooks/useMediaScreen";

const FollowCategoryListSkeleton = () => {
  const { pathname } = useLocation();
  const { isMobile } = useMediaScreen();

  return (
    <>
      {Array.from({ length: 10 }).map((res, index) => (
        <Container
          isMobile={isMobile}
          isFeed={pathname.includes("feed")}
          key={index}
        >
          <Profile>
            <Skeleton variant="circular" />
          </Profile>
          <Skeleton
            sx={{ margin: "16px" }}
            width={"100%"}
            height={18}
            variant="rounded"
          />
          <FollowBtn>
            <Skeleton variant="rounded" />
          </FollowBtn>
        </Container>
      ))}
    </>
  );
};

export default FollowCategoryListSkeleton;

const Container = styled.div<{ isFeed: boolean; isMobile: boolean }>`
  flex: 1 0 40%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  width: 100%;
  height: 80px;
  border: 2px solid
    ${(props) =>
      props.isMobile && props.isFeed
        ? `var(--fourth-color)`
        : props.isFeed
        ? `#d84a62`
        : `#2aaa5f`};
  border-radius: 20px;

  @media (max-width: 767px) {
    border-width: 1px;
    border-radius: 10px;
    justify-content: normal;
    flex-direction: column;
    height: 204px;
    padding: 16px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  flex: 1;
  height: 100%;

  span {
    width: 44px;
    height: 44px;
  }

  @media (max-width: 767px) {
    display: block;

    span {
      width: 88px;
      height: 88px;
    }
  }
`;

const FollowBtn = styled.div`
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 38px;
    border-radius: 20px;

    @media (max-width: 767px) {
      width: 92px;
      height: 32px;
      border-radius: 8px;
    }
  }
`;
