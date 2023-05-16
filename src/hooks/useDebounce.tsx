import React, { useRef } from "react";

const useDebounce = () => {
  const timerRef = useRef(null);

  const debounce = (callback: () => void, delay: number) => {
    if (!timerRef.current) {
      timerRef.current = setTimeout(callback, delay);
    } else {
      clearTimeout(timerRef.current);
    }
  };

  return { debounce };
};

export default useDebounce;
