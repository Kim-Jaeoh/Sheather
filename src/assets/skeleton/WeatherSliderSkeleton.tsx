import { Skeleton, Stack } from "@mui/material";
import React from "react";
import styled from "@emotion/styled";

type Props = {};

const WeatherSliderSkeleton = (props: Props) => {
  return (
    <Wrapper>
      <Header>
        <Skeleton height={"50px"} />
      </Header>
      <SliderBox>
        {Array.from({ length: 4 }).map((res, index) => {
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
`;

const Header = styled.header`
  border-bottom: 2px solid #22222222;
  height: 54px;
  padding: 0 12px;
  box-sizing: border-box;
`;

const SliderBox = styled.ul`
  display: flex;
  height: 356px;
  gap: 6px;
  padding: 12px;
`;

const Slider = styled.li`
  flex: 1 1 auto;
`;
