import React from "react";
import styled from "@emotion/styled";
import Flicking from "@egjs/react-flicking";
import { BsSun } from "react-icons/bs";
import { IoShirtOutline } from "react-icons/io5";
import { MdPlace } from "react-icons/md";
import { Link } from "react-router-dom";
import ColorList from "../../assets/ColorList";
import { FeedType } from "../../types/type";
import useMediaScreen from "../../hooks/useMediaScreen";

type Props = {
  res: FeedType;
  categoryTags: {
    name: string;
    type: string;
    detail: string;
  }[];
  onWearClick: (cat: string, detail: string) => void;
};

const DetailFeedCategory = ({ res, categoryTags, onWearClick }: Props) => {
  const { isMobile } = useMediaScreen();

  return (
    <>
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
                    <CategoryTag>
                      <MdPlace />
                      {res.region}
                    </CategoryTag>
                    <CategoryTag>
                      <WeatherIcon>
                        <img
                          src={`http://openweathermap.org/img/wn/${res.weatherInfo.weatherIcon}@2x.png`}
                          alt="weather icon"
                        />
                      </WeatherIcon>
                      {res.weatherInfo.weather}
                    </CategoryTag>
                    <CategoryTag>{res.weatherInfo.temp}º</CategoryTag>
                    <CategoryTag>
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
                      <CategoryTag>
                        <MdPlace />
                        {res.region}
                      </CategoryTag>
                      <CategoryTag>
                        <WeatherIcon>
                          <img
                            src={`http://openweathermap.org/img/wn/${res.weatherInfo.weatherIcon}@2x.png`}
                            alt="weather icon"
                          />
                        </WeatherIcon>
                        {res.weatherInfo.weather}
                      </CategoryTag>
                      <CategoryTag>{res.weatherInfo.temp}º</CategoryTag>
                      <CategoryTag>
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
    </>
  );
};

export default DetailFeedCategory;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const WearDetail = styled.div`
  position: relative;
  padding: 0px 14px;
  display: flex;
  flex: 1;
  width: 50%;
  height: 60px;
  align-items: center;
  &:not(:last-of-type) {
    border-right: 1px solid ${thirdColor};
  }

  @media (max-width: 767px) {
    padding: 0px 16px;
    height: 40px;
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
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fafafa);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  }

  @media (max-width: 767px) {
    /* width: 136px; */
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
  width: 14px;
  height: 14px;
  margin-right: 8px;
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
  font-size: 12px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  border: 1px solid ${thirdColor};
  border-radius: 8px;

  svg {
    margin-right: 2px;
    font-size: 12px;
    color: ${thirdColor};
  }

  @media (max-width: 767px) {
    padding: 4px 6px;
  }
`;
