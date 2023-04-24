import React from "react";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import ColorList from "../data/ColorList";
import useMediaScreen from "../../hooks/useMediaScreen";
import ImageList from "@mui/material/ImageList";

const HomeSkeleton = () => {
  const { isDesktop, isTablet, isMobile } = useMediaScreen();

  return (
    <ImageList
      sx={{ overflow: "hidden" }}
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

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const CardList = styled.li`
  /* width: 330px; */
  height: 380px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 2px solid #22222222;
  margin-bottom: 30px;
  @media (max-width: 767px) {
    margin-bottom: 12px;
    height: 230px;
  }
`;

const Card = styled.div`
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  border-bottom: 2px solid #22222222;
  height: 320px;

  @media (max-width: 767px) {
    height: 170px;
  }
`;

const UserBox = styled.div`
  padding: 12px 12px;
  flex: 1;
  padding: 12px;
`;
