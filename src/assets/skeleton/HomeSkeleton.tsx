import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import ColorList from "../data/ColorList";
import useMediaScreen from "../../hooks/useMediaScreen";
import ImageList from "@mui/material/ImageList";

const HomeSkeleton = () => {
  const { isMobile } = useMediaScreen();

  return (
    <ImageList
      sx={{
        width: "100%",
        overflow: "hidden",
        padding: `${isMobile ? `0 6px` : `0 14px`}`,
      }}
      variant="masonry"
      cols={2}
      gap={!isMobile ? 30 : 12}
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
    </ImageList>
  );
};

export default HomeSkeleton;

const { fourthColor } = ColorList();

const CardList = styled.li`
  height: 380px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #d84a62;
  margin-bottom: 30px;
  @media (max-width: 767px) {
    margin-bottom: 12px;
    border-width: 1px;
    border-color: ${fourthColor};
    height: 230px;
  }
`;

const Card = styled.div`
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  border-bottom: 2px solid #d84a62;
  height: 320px;

  @media (max-width: 767px) {
    height: 170px;
    border-width: 1px;
    border-color: ${fourthColor};
  }
`;

const UserBox = styled.div`
  padding: 12px 12px;
  flex: 1;
  padding: 12px;
`;
