import React from "react";
import styled from "@emotion/styled";
import { RotatingLines } from "react-loader-spinner";

export const SuspenseSpinner = () => {
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
