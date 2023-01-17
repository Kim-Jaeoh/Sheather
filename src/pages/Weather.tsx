import React, { useEffect, useState } from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import styled from "@emotion/styled";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { WeatherFiveDataType } from "../types/type";
import SlickSlider from "../utils/SlickSlider";

const Weather = () => {
  const { location } = useCurrentLocation();
  const [weathers, setWeathers] = useState<WeatherFiveDataType | null>(null);
  const [filterData, setFilterData] = useState([]);
  const [filterData1, setFilterData1] = useState<any>([]);
  const [filterData2, setFilterData2] = useState<any>([]);
  const [filterData3, setFilterData3] = useState<any>([]);
  const [filterData4, setFilterData4] = useState<any>([]);
  const [filterData5, setFilterData5] = useState<any>([]);

  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.coordinates?.lat}&lon=${location?.coordinates?.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=kr`;

  const { data, isLoading } = useQuery<AxiosResponse, AxiosError>(
    ["Weathers", location],
    async () => await axios.get(URL),
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location),
    }
  );

  useEffect(() => {
    if (location) {
      setWeathers(data?.data);
    }
  }, [data, location]);

  useEffect(() => {
    weathers?.list.map((res) =>
      setFilterData((prev) => [
        ...prev,
        res.dt_txt?.split("-")[2].split(" ")[0],
      ])
    );
  }, [weathers?.list]);

  const filter = new Set(filterData);
  let b = [Array.from(filter)];

  // useEffect(() => {
  //   setFilterData1(
  //     weathers?.list.filter(
  //       (res: any) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][0]
  //     )
  //   );
  //   setFilterData2(
  //     weathers?.list.filter(
  //       (res: any) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][1]
  //     )
  //   );
  //   setFilterData3(
  //     weathers?.list.filter(
  //       (res: any) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][2]
  //     )
  //   );
  //   setFilterData4(
  //     weathers?.list.filter(
  //       (res: any) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][3]
  //     )
  //   );
  //   setFilterData5(
  //     weathers?.list.filter(
  //       (res: any) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][4]
  //     )
  //   );
  // }, [weathers?.list]);

  const today = weathers?.list.filter(
    (res) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][0]
  );

  const today2 = weathers?.list.filter(
    (res) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][1]
  );
  const today3 = weathers?.list.filter(
    (res) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][2]
  );
  const today4 = weathers?.list.filter(
    (res) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][3]
  );
  const today5 = weathers?.list.filter(
    (res) => res.dt_txt?.split("-")[2].split(" ")[0] === b[0][4]
  );

  return (
    <>
      {weathers ? (
        <Container>
          <>
            <WeatherBox>
              {/* <WeatherDateBox>
                    <WeatherDate>{res}</WeatherDate>
                  </WeatherDateBox> */}
              {today ? (
                <>
                  <SlickSlider today={today} />
                  <SlickSlider today={today2} />
                  <SlickSlider today={today3} />
                  <SlickSlider today={today4} />
                  <SlickSlider today={today5} />
                </>
              ) : (
                <div>로딩중</div>
              )}
            </WeatherBox>
          </>
        </Container>
      ) : (
        <div>로딩중..</div>
      )}
    </>
  );
};

export default Weather;

const Container = styled.main`
  /* height: 260px; */
  height: 100%;
`;

const WeatherBox = styled.div`
  position: relative;
`;

const WeatherDateBox = styled.div`
  text-align: center;
  padding: 14px 0px;
`;

const WeatherDate = styled.span`
  border: 1px solid #b3b3b3;

  font-size: 14px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 9999px;
`;

const WeatherList = styled.div`
  border-right: 1px solid #dbdbdb;
  border-top: 1px solid #dbdbdb;
  padding: 12px;
  font-size: 12px;
  line-height: 20px;
  word-wrap: break-word;
`;

const WeatherCategoryBox = styled.div`
  &:first-of-type {
    text-align: center;
  }

  &:not(:first-of-type, :last-of-type) {
    margin-bottom: 14px;
  }
`;

const WeatherCategoryIconBox = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const WeatherCategoryIcon = styled.img`
  display: block;
  width: 100px;
`;

const WeatherCategoryIconText = styled.span``;

const WeatherCategoryMain = styled.span`
  border: 1px solid #b3b3b3;
  border-radius: 9999px;
  padding: 2px 6px;
  margin-right: 8px;
  font-size: 10px;
`;

const WeatherCategorySub = styled.span``;

const NextArrow = styled.div`
  position: absolute;
  width: 22px;
  height: 22px;
  right: -12px;
  transform: translate(0, -50%);
  border-radius: 50%;
  border: 2px solid #222222;
  background-color: #fafafa;
  z-index: 10;
  transition: all 0.1s;

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    svg {
      padding-left: 2px;
    }
  }

  &:hover {
    color: #fff;
    background-color: #48a3ff;
  }
`;

const PrevArrow = styled.div`
  position: absolute;
  width: 22px;
  height: 22px;
  left: -12px;
  transform: translate(0, -50%);
  border-radius: 50%;
  border: 2px solid #222222;
  background-color: #fafafa;
  z-index: 10;
  transition: all 0.1s;

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      padding-right: 2px;
    }
  }

  &:hover {
    color: #fff;
    background-color: #48a3ff;
  }
`;
