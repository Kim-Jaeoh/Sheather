import { Skeleton, Stack } from "@mui/material";
import React from "react";
import styled from "@emotion/styled";

type Props = {};

const SliderSkeleton = (props: Props) => {
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
            height={50}
          />
        </Header>
        <SliderBox>
          {Array.from({ length: 4 }).map((res, index) => {
            return (
              <Slider key={index}>
                <Skeleton
                  key={index}
                  variant="rectangular"
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

export default SliderSkeleton;

const secondColor = "#dbdbdb";

const Wrapper = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 30px;
  }
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${secondColor};
`;

const Header = styled.header`
  border-top: 2px solid ${secondColor};
  border-bottom: 2px solid ${secondColor};
  height: 54px;
  padding: 0 14px;
  margin-top: -2px;
  box-sizing: border-box;
  background: #fff;
`;

const SliderBox = styled.ul`
  display: flex;
  height: 296px;
  gap: 12px;
  padding: 12px;
  background: #fff;
`;

const Slider = styled.li`
  padding: 12px;
  /* width: 100%; */
  flex: 1 1 auto;
  background: #fff;
`;
