import axios from "axios";
import React from "react";

type Props = {
  coord: {
    lat: number;
    lon: number;
  };
};

const useKakaoMap = (props: Props) => {
  function onGeoOk() {
    const lat = props?.coord.lat;
    const lon = props?.coord.lon;

    //kakao REST API에 get 요청을 보낸다.
    //파라미터 x,y에 lon,lat을 넣어주고 API_KEY를 Authorization헤더에 넣어준다.
    // axios
    //   .get(
    //     `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`,
    //     {
    //       headers: {
    //         Authorization: `KakaoAK 05f031c959215a083e70737dfe892b6e`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data.documents);
    //   });
    axios
      .get(
        `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=CE7&x=${lon}&y=${lat}&radius=20000&page=45`,
        {
          headers: {
            Authorization: `KakaoAK 05f031c959215a083e70737dfe892b6e`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.documents);
      });
  }

  onGeoOk();

  return <div>useKakaoMap</div>;
};

export default useKakaoMap;
