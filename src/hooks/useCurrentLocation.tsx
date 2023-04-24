import { useState, useEffect } from "react";
import {
  LocationCoordsType,
  LocationErrorType,
  LocationStateType,
} from "../types/type";

const useCurrentLocation = () => {
  const [location, setLocation] = useState<LocationStateType | null>(null);

  // 성공 함수
  const onSuccess = (res: LocationCoordsType) => {
    setLocation({
      coordinates: {
        lat: res.coords.latitude,
        lon: res.coords.longitude,
        acc: res.coords.accuracy,
      },
    });
  };

  // 에러 함수
  const onError = (err: LocationErrorType) => {
    setLocation({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  };

  useEffect(() => {
    const { geolocation } = navigator; // window.navigator.geolocation
    // 옵션
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0, //1000 * 60 * 1, // 불러온 값을 캐싱하는 시간 (1분)
      timeout: 5000, // API 최대 요청 시간
    };
    if (!geolocation) {
      // navigator에 해당 텍스트가 없을 시 에러
      onError({
        code: 0,
        message: "위치 정보를 찾을 수 없습니다.",
      });
    }
    geolocation.getCurrentPosition(onSuccess, onError, options);
  }, []);

  return { location };
};

export default useCurrentLocation;
