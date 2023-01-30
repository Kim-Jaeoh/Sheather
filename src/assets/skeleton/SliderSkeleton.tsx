import { Skeleton, Stack } from "@mui/material";
import React from "react";
import styled from "@emotion/styled";

type Props = {};

const SliderSkeleton = (props: Props) => {
  return (
    <Stack
      spacing={0}
      sx={{
        background: "#FAFAFA",
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
                sx={{
                  flex: "1 1 auto",
                }}
                width={"100%"}
                height={"100%"}
              />
            </Slider>
          );
        })}
      </SliderBox>
    </Stack>
  );
};

export default SliderSkeleton;

const secondColor = "#dbdbdb";

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
  width: 100%;
  height: 332px;
  margin-bottom: 30px;
  border-bottom: 2px solid ${secondColor};
`;

const Slider = styled.li`
  padding: 14px;
  width: 100%;
  border-right: 1px solid ${secondColor};
  background: #fff;
`;
