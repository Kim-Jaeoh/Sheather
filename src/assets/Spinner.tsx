import React from "react";
import styled from "@emotion/styled";
import { RotatingLines } from "react-loader-spinner";

export const Spinner = () => {
  return (
    <Box>
      <RotatingLines
        strokeColor="grey"
        strokeWidth="3"
        animationDuration="1"
        width="30"
        visible={true}
      />
    </Box>
  );
};

const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;
