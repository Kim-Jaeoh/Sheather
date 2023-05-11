import { useEffect, useState, useMemo } from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import styled from "@emotion/styled";
import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  WeatherDataType,
  WeatherMapDataType,
  WeathersFiveDataType,
} from "../types/type";
import moment from "moment";
import WeatherSliderSkeleton from "../assets/skeleton/WeatherSliderSkeleton";
import { nowWeatherApi, weatherApi } from "../apis/api";
import WeatherSlider from "../components/weather/WeatherSlider";

const Weather = () => {
  const [weather, setWeather] = useState<WeathersFiveDataType | null>(null);
  const [weatherArray, setWeatherArray] = useState<
    WeathersFiveDataType[] | null
  >(null);
  const [filterData1, setFilterData1] = useState<WeathersFiveDataType[]>([]);
  const [filterData2, setFilterData2] = useState<WeathersFiveDataType[]>([]);
  const [filterData3, setFilterData3] = useState<WeathersFiveDataType[]>([]);
  const [filterData4, setFilterData4] = useState<WeathersFiveDataType[]>([]);
  const [filterData5, setFilterData5] = useState<WeathersFiveDataType[]>([]);
  const { location } = useCurrentLocation();

  // 단기 예보 정보 가져오기
  const { data: weathersData, isLoading } = useQuery<
    AxiosResponse<WeatherMapDataType>,
    AxiosError
  >(["Weathers", location], () => weatherApi(location), {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

  // 현재 날씨 정보 가져오기
  const { data: weatherData } = useQuery<
    AxiosResponse<WeatherDataType>,
    AxiosError
  >(["Weather", location], () => nowWeatherApi(location), {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
    enabled: Boolean(location),
  });

  // 현재 예보 시간 계산
  useEffect(() => {
    if (weatherData) {
      setWeather({
        ...weatherData?.data,
        dt: weatherData?.data.dt * 1000,
      });
    }
  }, [weatherData]);

  // 단기 예보 시간 계산
  useEffect(() => {
    if (weathersData) {
      const list = weathersData?.data?.list.map((res) => {
        return { ...res, dt: res.dt * 1000 };
      });
      setWeatherArray(list);
    }
  }, [weathersData]);

  // 날짜 가져온 뒤 배열에 담기
  const dateArray = useMemo(() => {
    const checkDate = weatherArray?.map((res) => moment(res?.dt).format("DD"));
    const filter = new Set(checkDate); // 중복 제거
    return Array.from(filter);
  }, [weatherArray]);

  // 해당 날짜 맞는지 체크
  const GetDate = (dateStr: string, weatherArray: WeathersFiveDataType[]) => {
    return useMemo(
      () =>
        weatherArray?.filter((res) => moment(res?.dt).format("DD") === dateStr),
      [dateStr, weatherArray]
    );
  };

  const date1 = GetDate(dateArray[0], weatherArray);
  const date2 = GetDate(dateArray[1], weatherArray);
  const date3 = GetDate(dateArray[2], weatherArray);
  const date4 = GetDate(dateArray[3], weatherArray);
  const date5 = GetDate(dateArray[4], weatherArray);

  // 오늘 날짜 체크
  const dayCheck = useMemo(() => {
    const time = new Date();
    if (filterData1) {
      const checkDate = moment(filterData1[0]?.dt).format("DD");
      return time.getDate() === Number(checkDate); // 오늘 날짜와 day 날짜가 다르면 false
    }
  }, [filterData1]);

  // day+1 날짜 체크
  const dayPlusCheck = useMemo(() => {
    const time = new Date();
    if (date2) {
      const checkPlusDate = moment(date2[0]?.dt).format("DD");
      return time.getDate() === Number(checkPlusDate); // 오늘 날짜와 day+1 날짜가 다르면 false
    }
  }, [date2]);

  useEffect(() => {
    if (weather && date1 && date2 && date3 && date4 && date5) {
      setFilterData1([weather, ...date1]);
      if (dayPlusCheck) {
        setFilterData2([weather, ...date2]);
      } else {
        setFilterData2(date2);
      }
      setFilterData3(date3);
      setFilterData4(date4);
      setFilterData5(date5);
    }
  }, [date1, date2, date3, date4, date5, dayPlusCheck, weather]);

  return (
    <Container>
      <WeatherBox>
        <Box>
          {!isLoading ? (
            <>
              {dayCheck && <WeatherSlider data={filterData1} />}
              <WeatherSlider data={filterData2} />
              <WeatherSlider data={filterData3} />
              <WeatherSlider data={filterData4} />
              <WeatherSlider data={filterData5} />
            </>
          ) : (
            <>
              {Array.from({ length: 4 }).map((res, index) => (
                <WeatherSliderSkeleton key={index} />
              ))}
            </>
          )}
        </Box>
      </WeatherBox>
    </Container>
  );
};

export default Weather;

const Container = styled.main`
  overflow: hidden;
  height: 100%;
  border-top: 2px solid var(--second-color);
  border-bottom: 2px solid var(--second-color);
  background: var(--weather-color);

  @media (max-width: 767px) {
    border: none;
  }
`;

const WeatherBox = styled.div`
  position: relative;
  padding: 40px;
  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const Box = styled.div``;
