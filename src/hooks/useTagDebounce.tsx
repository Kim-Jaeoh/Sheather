import React, { useEffect, useState } from "react";

const useTagDebounce = (value: string, delay: number) => {
  const [debouncedSearchTerm, setDebounceSearchTerm] = useState("");

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

export default useTagDebounce;
