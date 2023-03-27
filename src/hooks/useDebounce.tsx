import React, { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number) => {
  const [debouncedSearchTerm, setDebounceSearchTerm] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchTerm(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedSearchTerm;
};

export default useDebounce;
