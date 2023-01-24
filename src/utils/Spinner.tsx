import React from "react";
import styled from "@emotion/styled";
import FadeLoader from "react-spinners/FadeLoader";

const Box = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
`;

export const Spinner = () => {
  return (
    <Box>
      <FadeLoader color="#363636" height={14} width={6} radius={5} margin={2} />
    </Box>
  );
};
