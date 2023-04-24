import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

type props = {
  url: string;
  count: number;
};

// 무한 스크롤
const useInfinityScroll = ({ url, count }: props) => {
  const queryClient = useQueryClient();

  const fetchRepositories = async (page: number) => {
    if (url !== "") {
      const res = await axios.get(`${url}limit=${count}&page=${page}`);
      return res.data;
    }
  };

  const {
    data: dataList,
    isLoading,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery(
    ["feed", url],
    ({ pageParam = 1 }) => {
      return fetchRepositories(pageParam);
    },
    {
      // refetchOnMount: true,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage) {
          const nextPage = allPages.length + 1; //
          return lastPage.length !== 0 ? nextPage : undefined; // 다음 데이터가 있는지 없는지 판단
        }
      },
    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [hasNextPage, inView]);

  return { ref, isLoading, dataList };
};

export default useInfinityScroll;
