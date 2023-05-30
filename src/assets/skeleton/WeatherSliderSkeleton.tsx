import { Skeleton, Stack } from "@mui/material";
import React from "react";
import styled from "@emotion/styled";
import useMediaScreen from "../../hooks/useMediaScreen";

type Props = {};

const WeatherSliderSkeleton = (props: Props) => {
  const { isMobile } = useMediaScreen();
  return (
    <Wrapper>
      <Header>
        <Skeleton height={"50px"} />
      </Header>
      <SliderBox>
        {Array.from({ length: isMobile ? 2 : 4 }).map((res, index) => {
          return (
            <Slider key={index}>
              <Skeleton
                key={index}
                variant="rounded"
                width={"100%"}
                height={"100%"}
              />
            </Slider>
          );
        })}
      </SliderBox>
    </Wrapper>
  );
};

export default WeatherSliderSkeleton;

const Wrapper = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 30px;
  }
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid #22222222;

  @media (max-width: 767px) {
    border-width: 1px;
  }
`;

const Header = styled.header`
  border-bottom: 2px solid #22222222;
  height: 54px;
  padding: 0 12px;
  box-sizing: border-box;

  @media (max-width: 767px) {
    border-width: 1px;
  }
`;

const SliderBox = styled.ul`
  display: flex;
  height: 376px;
  gap: 6px;
  padding: 12px;
`;

const Slider = styled.li`
  flex: 1 1 auto;
`;
