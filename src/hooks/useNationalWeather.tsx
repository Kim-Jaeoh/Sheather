import axios from "axios";
import React, { useEffect, useState } from "react";
import useCurrentLocation from "./useCurrentLocation";

const useNationalWeather = () => {
  const { location } = useCurrentLocation();
  const [coordinate, setCoordinate] = useState({
    x: "",
    y: "",
  });
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (location.coordinates.lat) {
      const transcoord = async () => {
        await axios
          .get(
            `https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${location?.coordinates?.lat}&y=${location?.coordinates?.lon}&output_coord=WGS84`,
            {
              headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
              },
            }
          )
          .then((response) => {
            const {
              data: { documents },
            } = response;
            setCoordinate({ x: documents[0].x, y: documents[0].y });
          });
      };
      transcoord();
    }
  }, [location]);

  // 예보
  useEffect(() => {
    if (location.coordinates.lat) {
      const getWeather = async () => {
        await axios
          .get(
            `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=rS5KvquzZKyNOvQHXt546zlgiXhtmBipH6cdtLoKY%2FC74BkjW2SMi042nt%2BWmd%2FhZQ8VFI%2FXkjCVR%2FVT8PqMig%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20230117&base_time=0200&nx=${
              coordinate.x.toString().split(".")[0]
            }&ny=${coordinate?.y.toString().split(".")[0]}`
          )
          .then((res) => {
            setWeather(res?.data?.response?.body?.items);
          });
      };
      getWeather();
    }
  }, [coordinate.x, coordinate?.y, location.coordinates.lat]);

  return { weather };
};

export default useNationalWeather;
