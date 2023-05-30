import React from "react";
import { useQuery } from "@tanstack/react-query";
import { regionApi } from "../../apis/api";
import useCurrentLocation from "../useCurrentLocation";

const useRegionQuery = () => {
  const { location } = useCurrentLocation();

  // 현재 주소 받아오기
  const { data: regionData, isLoading: isRegionLoading } = useQuery(
    ["Region", location],
    () => regionApi(location),
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location?.coordinates?.acc),
    }
  );

  const region = regionData?.data?.documents[0]?.address;

  return { regionData, region, isRegionLoading };
};

export default useRegionQuery;
