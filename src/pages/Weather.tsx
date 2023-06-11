import { useEffect, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { WeathersFiveDataType } from "../types/type";
import moment from "moment";
import WeatherSliderSkeleton from "../assets/skeleton/WeatherSliderSkeleton";
import WeatherSlider from "../components/weather/WeatherSlider";
import useWeatherQuery from "../hooks/useQuery/useWeatherQuery";
import useRegionQuery from "../hooks/useQuery/useRegionQuery";
import { MdPlace } from "react-icons/md";
import Skeleton from "@mui/material/Skeleton";

const Weather = () => {
  const [weather, setWeather] = useState<WeathersFiveDataType | null>(null);
  const [weatherArray, setWeatherArray] = useState<
    WeathersFiveDataType[] | null
  >(null);
  const [filterData, setFilterData] = useState({
    today: [],
    dayPlusOne: [],
    dayPlusTwo: [],
    dayPlusThree: [],
    dayPlusFour: [],
  });
  const { weatherData, weathersData, isWeathersLoading } = useWeatherQuery();
  const { region } = useRegionQuery();
  const time = new Date();

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

  // 1. 날씨 정보 가져온 뒤 배열에 날짜 담기
  const dateArray = useMemo(() => {
    const checkDate = weatherArray?.map((res) => moment(res?.dt).format("DD"));
    const filter = new Set(checkDate); // 중복 제거
    return Array.from(filter);
  }, [weatherArray]);

  // 2-1. 해당 날짜 맞는지 체크
  const getDataFilter = (
    date: string,
    weatherArray: WeathersFiveDataType[]
  ) => {
    return weatherArray?.filter((res) => moment(res?.dt).format("DD") === date);
  };

  // 2-2. 반환된 함수의 값을 useMemo로 메모이제이션
  const filteredDates = useMemo(
    () => dateArray.map((date) => getDataFilter(date, weatherArray)),
    [dateArray, weatherArray]
  );

  // 3. 배열로 이루어진 날씨 추출
  const [date1, date2, date3, date4, date5] = filteredDates;

  // 오늘 날짜 체크 (오늘 날짜와 day 날짜가 같은지 체크)
  const dayCheck = filterData.today
    ? time.getDate() === Number(moment(filterData.today[0]?.dt).format("DD"))
    : false;

  // day+1 날짜 체크 (오늘 날짜와 day+1 날짜가 같은지 체크)
  const dayPlusCheck = date2
    ? time.getDate() === Number(moment(date2[0]?.dt).format("DD"))
    : false;

  useEffect(() => {
    if (weather && date1 && date2 && date3 && date4 && date5) {
      // 21시까지 유지 및 21시 이후 사라짐 -> 자정 지나면 다시 생성
      setFilterData((prev) => ({ ...prev, today: [weather, ...date1] }));
      // true = 예보가 21시까지밖에 없기에 21시 지나면 다음 날 예보와 현재 예보 합침 (오늘 ~ '다음 날')
      // false = 자정되면 다음 날 예보(api)로 넘어가기에 다시 오늘 예보 생성 (오늘)
      setFilterData((prev) => ({
        ...prev,
        dayPlusOne: dayPlusCheck ? [weather, ...date2] : date2,
      }));
      setFilterData((prev) => ({ ...prev, dayPlusTwo: date3 }));
      setFilterData((prev) => ({ ...prev, dayPlusThree: date4 }));
      setFilterData((prev) => ({ ...prev, dayPlusFour: date5 }));
    }
  }, [date1, date2, date3, date4, date5, dayPlusCheck, weather]);

  return (
    <>
      <Container>
        <CurrentPlaceBox>
          {region ? (
            <RoundBox>
              <IconBox>
                <MdPlace />
              </IconBox>
              <InfoTextBox>
                현재 위치는
                <InfoText>
                  {region?.region_1depth_name} {region?.region_3depth_name}
                </InfoText>
                입니다.
              </InfoTextBox>
            </RoundBox>
          ) : (
            <Skeleton
              sx={{ borderRadius: "9999px" }}
              width={"216px"}
              height={"32px"}
              variant="rounded"
            />
          )}
        </CurrentPlaceBox>
        <WeatherBox>
          <Box>
            {!isWeathersLoading ? (
              <>
                {dayCheck && <WeatherSlider data={filterData.today} />}
                <WeatherSlider data={filterData.dayPlusOne} />
                <WeatherSlider data={filterData.dayPlusTwo} />
                <WeatherSlider data={filterData.dayPlusThree} />
                <WeatherSlider data={filterData.dayPlusFour} />
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
    </>
  );
};

export default Weather;

const Container = styled.main`
  overflow: hidden;
  position: relative;
  height: 100%;
  border-top: 2px solid var(--second-color);
  border-bottom: 2px solid var(--second-color);
  background: var(--weather-color);

  @media (max-width: 767px) {
    border: none;
  }
`;

const CurrentPlaceBox = styled.div`
  width: 100%;
  /* height: 80px; */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: -20px;

  @media (max-width: 767px) {
    margin-bottom: 8px;
  }
`;

const RoundBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: #fff;
  background: #174b87;
  svg {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const IconBox = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoTextBox = styled.div`
  padding: 8px 14px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoText = styled.em`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  white-space: nowrap;
  font-weight: 600;
  color: #ff9700;
`;

const WeatherBox = styled.div`
  position: relative;
  padding: 40px;
  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const Box = styled.div``;
