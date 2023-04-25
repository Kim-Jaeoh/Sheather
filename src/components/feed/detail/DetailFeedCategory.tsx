import styled from "@emotion/styled";
import Flicking from "@egjs/react-flicking";
import { BsSun } from "react-icons/bs";
import { IoShirtOutline } from "react-icons/io5";
import { MdPlace } from "react-icons/md";
import ColorList from "../../../assets/data/ColorList";
import useMediaScreen from "../../../hooks/useMediaScreen";
import { FeedType } from "../../../types/type";
import { useNavigate } from "react-router-dom";

type Props = {
  res: FeedType;
};

const DetailFeedCategory = ({ res }: Props) => {
  const { outer, top, innerTop, bottom, etc } = res.wearInfo;
  const categoryTags = [
    { name: "outer", type: "outer", detail: outer },
    { name: "top", type: "top", detail: top },
    { name: "innerTop", type: "innerTop", detail: innerTop },
    { name: "bottom", type: "bottom", detail: bottom },
    { name: "etc", type: "etc", detail: etc },
  ];
  const { isMobile } = useMediaScreen();
  const navigate = useNavigate();

  const onWearClick = (cat: string, detail: string) => {
    navigate(`/explore?q=clothes&cat=${cat}&detail=${detail}&sort=recent`);
  };

  const onWeatherClick = (cat: string, detail: string | number) => {
    navigate(`/explore?q=weather&cat=${cat}&detail=${detail}&sort=recent`);
  };

  const onRegionClick = (cat: string, detail: string) => {
    navigate(`/explore?q=region&cat=${cat}&detail=${detail}&sort=recent`);
  };

  return (
    <WearDetailBox>
      {isMobile ? (
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
                    <CategoryTag
                      onClick={() => onRegionClick("region", res.region)}
                    >
                      <MdPlace />
                      {res.region}
                    </CategoryTag>
                    <CategoryTag
                      onClick={() =>
                        onWeatherClick("weather", res.weatherInfo.weather)
                      }
                    >
                      <WeatherIcon>
                        <img
                          src={`/image/weather/${res.weatherInfo.weatherIcon}.png`}
                          // src={`https://openweathermap.org/img/wn/${res.weatherInfo.weatherIcon}@2x.png`}
                          alt="weather icon"
                        />
                      </WeatherIcon>
                      {res.weatherInfo.weather}
                    </CategoryTag>
                    <CategoryTag
                      onClick={() =>
                        onWeatherClick("temp", res.weatherInfo.temp)
                      }
                    >
                      {res.weatherInfo.temp}º
                    </CategoryTag>
                    <CategoryTag
                      onClick={() =>
                        onWeatherClick("wind", res.weatherInfo.wind)
                      }
                    >
                      {res.weatherInfo.wind}
                      <span>m/s</span>
                    </CategoryTag>
                    <WearInfoMain style={{ marginLeft: `4px` }}>
                      <IoShirtOutline />
                    </WearInfoMain>
                    <CategoryTag>{res.feel}</CategoryTag>
                    {categoryTags.map((tag) =>
                      tag.detail ? (
                        <CategoryTag
                          key={tag.name}
                          onClick={() => onWearClick(tag.type, tag.detail)}
                        >
                          {tag.detail}
                        </CategoryTag>
                      ) : null
                    )}
                  </CategoryTagBox>
                </WearInfo>
              </Flicking>
            </FlickingCategoryBox>
          </WearInfoBox>
        </WearDetail>
      ) : (
        <>
          <WearDetail>
            <WearInfoBox>
              <WearInfoMain>
                <BsSun />
              </WearInfoMain>
              <FlickingCategoryBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <WearInfo>
                    <CategoryTagBox>
                      <CategoryTag
                        onClick={() => onRegionClick("region", res.region)}
                      >
                        <MdPlace />
                        {res.region}
                      </CategoryTag>
                      <CategoryTag
                        onClick={() =>
                          onWeatherClick("weather", res.weatherInfo.weather)
                        }
                      >
                        <WeatherIcon>
                          <img
                            src={`/image/weather/${res.weatherInfo.weatherIcon}.png`}
                            // src={`http://openweathermap.org/img/wn/${res.weatherInfo.weatherIcon}@2x.png`}
                            alt="weather icon"
                          />
                        </WeatherIcon>
                        {res.weatherInfo.weather}
                      </CategoryTag>
                      <CategoryTag
                        onClick={() =>
                          onWeatherClick("temp", res.weatherInfo.temp)
                        }
                      >
                        {res.weatherInfo.temp}º
                      </CategoryTag>
                      <CategoryTag
                        onClick={() =>
                          onWeatherClick("wind", res.weatherInfo.wind)
                        }
                      >
                        {res.weatherInfo.wind}
                        <span>m/s</span>
                      </CategoryTag>
                    </CategoryTagBox>
                  </WearInfo>
                </Flicking>
              </FlickingCategoryBox>
            </WearInfoBox>
          </WearDetail>
          <WearDetail>
            <WearInfoBox>
              <WearInfoMain>
                <IoShirtOutline />
              </WearInfoMain>
              <FlickingCategoryBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <WearInfo>
                    <CategoryTagBox>
                      <CategoryTag>{res.feel}</CategoryTag>
                      {categoryTags.map((tag) =>
                        tag.detail ? (
                          <CategoryTag
                            key={tag.name}
                            onClick={() => onWearClick(tag.type, tag.detail)}
                          >
                            {tag.detail}
                          </CategoryTag>
                        ) : null
                      )}
                    </CategoryTagBox>
                  </WearInfo>
                </Flicking>
              </FlickingCategoryBox>
            </WearInfoBox>
          </WearDetail>
        </>
      )}
    </WearDetailBox>
  );
};

export default DetailFeedCategory;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const WearDetailBox = styled.div`
  overflow: hidden;
  display: flex;
  border-bottom: 1px solid ${fourthColor};
`;

const WearDetail = styled.div`
  position: relative;
  padding: 10px 14px;
  display: flex;
  flex: 1;
  /* width: 50%; */
  align-items: center;
  &:not(:last-of-type) {
    border-right: 1px solid ${fourthColor};
  }

  @media (max-width: 767px) {
    padding: 10px 16px;
    overflow: hidden;
  }
`;

const WearInfoBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;

const WearInfoMain = styled.div`
  flex: 0 0 auto;
  user-select: text;
  color: ${secondColor};
  text-align: center;
  margin-right: 12px;
  font-size: 14px;

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;

    svg {
      color: ${thirdColor};
      width: 12px;
      height: 12px;
    }
  }
`;

const FlickingCategoryBox = styled.div`
  width: 100%;
  cursor: pointer;
  position: relative;
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
  margin-right: 4px;
  img {
    display: block;
    width: 100%;
  }
`;

const CategoryTagBox = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
`;

const CategoryTag = styled.div`
  font-size: 14px;
  padding: 6px 8px;
  height: 30px;
  display: flex;
  align-items: center;
  border: 1px solid ${fourthColor};
  border-radius: 8px;
  color: ${thirdColor};
  svg {
    margin-right: 2px;
    font-size: 12px;
    color: ${thirdColor};
  }

  @media (max-width: 767px) {
    font-size: 12px;
    padding: 4px 6px;
  }
`;
