import React from "react";
import { useMediaQuery } from "react-responsive";

const useMediaScreen = () => {
  const isDesktop: boolean = useMediaQuery({
    query: "(min-width:1060px)",
  });
  const isTablet: boolean = useMediaQuery({
    query: "(min-width:768px) and (max-width:1059px)",
  });
  const isMobile: boolean = useMediaQuery({
    query: "(max-width:767px)",
  });
  const isMobileBefore: boolean = useMediaQuery({
    query: `(max-width: 799px)`,
  });
  const RightBarNone: boolean = useMediaQuery({
    query: `(max-width: 956px)`,
  });

  return { isDesktop, isTablet, isMobile, isMobileBefore, RightBarNone };
};

export default useMediaScreen;
