import { useMemo } from "react";
import styled from "@emotion/styled";
import { MdPlace } from "react-icons/md";
import { Spinner } from "../../assets/spinner/Spinner";
import Flicking from "@egjs/react-flicking";
import "../../styles/DetailFlicking.css";
import TempClothes from "../../assets/data/TempClothes";
import { IoShirtOutline } from "react-icons/io5";
import { BsSun } from "react-icons/bs";
import useRegionQuery from "../../hooks/useQuery/useRegionQuery";
import useWeatherQuery from "../../hooks/useQuery/useWeatherQuery";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { BiErrorCircle } from "react-icons/bi";

const MobileFeedWeatherInfo = () => {
  const { location } = useCurrentLocation();
  const { weatherData } = useWeatherQuery();
  const { tempClothes } = TempClothes(); // 옷 정보
  const { region, isRegionLoading } = useRegionQuery();

  const filterTempClothes = useMemo(() => {
    const temp = weatherData?.data?.main.temp;
    return tempClothes.filter(
      (info) =>
        info.tempMax >= Math.round(temp) && info.tempMin <= Math.round(temp)
    );
  }, [tempClothes, weatherData?.data?.main.temp]);

  return (
    <Container>
      {!location?.error?.message ? (
        <>
          {!isRegionLoading ? (
            <WearDetailBox>
              <WearDetail>
                <WearInfoBox>
                  <FlickingCategoryBox>
                    <Flicking
                      onChanged={(e) => console.log(e)}
                      moveType="freeScroll"
                      bound={true}
                      align="prev"
                    >
                      <WearInfo>
                        <CategoryTagBox>
                          <WearInfoMain>
                            <BsSun />
                          </WearInfoMain>
                          <CategoryTag>
                            <MdPlace />
                            {region?.region_1depth_name}{" "}
                            {region?.region_3depth_name}
                          </CategoryTag>
                          <CategoryTag>
                            <WeatherIcon>
                              <img
                                src={`/image/weather/${weatherData?.data?.weather[0].icon}.png`}
                                alt="weather icon"
                              />
                            </WeatherIcon>
                            {weatherData?.data?.weather[0].description}
                          </CategoryTag>
                          <CategoryTag>
                            {Math.round(weatherData?.data?.main.temp)}
                            <sup>º</sup>
                          </CategoryTag>
                          <CategoryTag>
                            {Math.round(weatherData?.data?.wind.speed)}
                            <span>m/s</span>
                          </CategoryTag>
                          <WearInfoMain style={{ marginLeft: `4px` }}>
                            <IoShirtOutline />
                          </WearInfoMain>
                          {filterTempClothes[0]?.clothes?.map((res, index) => {
                            return <CategoryTag key={index}>{res}</CategoryTag>;
                          })}
                        </CategoryTagBox>
                      </WearInfo>
                    </Flicking>
                  </FlickingCategoryBox>
                </WearInfoBox>
              </WearDetail>
            </WearDetailBox>
          ) : (
            <Spinner />
          )}
        </>
      ) : (
        <NotInfoBox>
          <NotInfo>
            <BiErrorCircle />
            위치 권한이 허용되지 않았습니다.
          </NotInfo>
        </NotInfoBox>
      )}
    </Container>
  );
};

export default MobileFeedWeatherInfo;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  color: var(--third-color);
`;

const WearDetailBox = styled.div`
  width: 100%;
  overflow: hidden;
  padding-right: 16px;
  position: relative;
`;

const WearDetail = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const WearInfoBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  }
`;

const WearInfoMain = styled.div`
  flex: 0 0 auto;
  user-select: text;
  margin-right: 4px;
  color: var(--second-color);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: var(--third-color);
    width: 12px;
    height: 12px;
  }
`;

const FlickingCategoryBox = styled.div`
  width: 100%;
  cursor: pointer;
`;

const WearInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  img {
    display: block;
    width: 100%;
  }
`;

const CategoryTagBox = styled.div`
  display: flex;
  flex: nowrap;
  gap: 8px;
`;

const CategoryTag = styled.div`
  font-size: 12px;
  padding: 4px 6px;
  height: 30px;
  display: flex;
  align-items: center;
  border: 1px solid var(--fourth-color);
  border-radius: 8px;

  svg {
    margin-right: 2px;
    font-size: 12px;
    color: var(--third-color);
  }

  span {
    font-size: 10px;
  }
`;

const NotInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const NotInfo = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  svg {
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }
`;
