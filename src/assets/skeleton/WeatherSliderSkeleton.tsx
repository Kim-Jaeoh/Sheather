import { Skeleton, Stack } from "@mui/material";
import React from "react";
import styled from "@emotion/styled";

type Props = {};

const WeatherSliderSkeleton = (props: Props) => {
  return (
    <Wrapper>
      <Stack
        spacing={0}
        sx={{
          background: "#FAFAFA",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Header>
          <Skeleton
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            height={"50px"}
          />
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
      </Stack>
    </Wrapper>
  );
};

export default WeatherSliderSkeleton;

const secondColor = "#dbdbdb";

const Wrapper = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 30px;
  }
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${secondColor};
`;

const Header = styled.header`
  border-bottom: 2px solid ${secondColor};
  height: 54px;
  padding: 0 12px;
  box-sizing: border-box;
  background: #fff;
`;

const SliderBox = styled.ul`
  display: flex;
  height: 356px;
  gap: 6px;
  padding: 12px;
  background: #fff;
`;

const Slider = styled.li`
  /* padding: 12px; */
  /* width: 100%; */
  flex: 1 1 auto;
  background: #fff;
`;
