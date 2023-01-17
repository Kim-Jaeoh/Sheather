import axios from "axios";
import React, { useEffect, useState } from "react";
import useCurrentLocation from "./useCurrentLocation";

type Props = {
  item: any;
  map(arg0: (res: any) => JSX.Element): React.ReactNode;
  res: [];
};

const useNationalWeather = () => {
  const { location } = useCurrentLocation();
  const [coordinate, setCoordinate] = useState({
    x: "",
    y: "",
  });
  const [weather, setWeather] = useState<Props | null>(null);

  useEffect(() => {
    if (location) {
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

  // // 단기
  // useEffect(() => {
  //   if (coordinate) {
  //     const getWeather = async () => {
  //       await axios
  //         .get(
  //           `
  //           https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=rS5KvquzZKyNOvQHXt546zlgiXhtmBipH6cdtLoKY%2FC74BkjW2SMi042nt%2BWmd%2FhZQ8VFI%2FXkjCVR%2FVT8PqMig%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20230116&base_time=0500&nx=${
  //             coordinate.x.toString().split(".")[0]
  //           }&ny=${coordinate?.y.toString().split(".")[0]}
  //          `
  //         )
  //         .then((res) => {
  //           setWeather(res?.data?.response?.body?.items);
  //         });
  //     };
  //     getWeather();
  //   }
  // }, [coordinate]);

  // 예보
  useEffect(() => {
    if (coordinate) {
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
  }, [coordinate]);

  return { weather };
};

export default useNationalWeather;
