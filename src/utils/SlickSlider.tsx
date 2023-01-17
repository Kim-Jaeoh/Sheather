import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "../utils//slick-theme.css";
import styled from "@emotion/styled";
import { WeatherFiveDataType } from "../types/type";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

interface ResDataType {
  dt?: string;
  dt_txt?: string;
  weather?: { description: string; icon: string }[];
  main?: { temp_max: number; temp_min: number };
  wind: { speed: number };
}

const SlickSlider = ({ today }: WeatherFiveDataType | null) => {
  // const [scrollY, setScrollY] = useState(0);
  // const [btnStatus, setBtnStatus] = useState<boolean>(false); // 버튼 상태

  // useEffect(() => {
  //   const handleFollow = () => {
  //     if (window.pageYOffset <= 80) {
  //       setBtnStatus(false);
  //     } else {
  //       setBtnStatus(true);
  //     }
  //     setScrollY(window.pageYOffset);
  //   };

  //   window.addEventListener("scroll", handleFollow);

  //   return () => {
  //     window.removeEventListener("scroll", handleFollow);
  //   };
  // }, [scrollY]);

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: today?.length <= 2 ? 2 : 5,
    slidesToScroll: 4,
    nextArrow: (
      <NextArrow>
        <span>
          <IoIosArrowForward />
        </span>
      </NextArrow>
    ),
    prevArrow: (
      <PrevArrow>
        <span>
          <IoIosArrowBack />
        </span>
      </PrevArrow>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <>
      {today[0] && (
        <Wrapper>
          <WeatherDateBox>
            <WeatherDate>
              {today[0]?.dt_txt?.split("-")[2].split(" ")[0]}일
            </WeatherDate>
          </WeatherDateBox>
          <Slider {...settings}>
            {today?.map((res: ResDataType) => {
              return (
                <WeatherList key={res.dt}>
                  <WeatherCategoryBox>
                    {/* <WeatherCategoryMain>날짜</WeatherCategoryMain> */}
                    <WeatherCategorySub>{res.dt_txt}</WeatherCategorySub>
                  </WeatherCategoryBox>
                  <WeatherCategoryIconBox>
                    <WeatherCategoryIcon
                      src={`http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`}
                      alt=""
                    />
                    <WeatherCategoryIconText>
                      {res.weather[0].description}
                    </WeatherCategoryIconText>
                  </WeatherCategoryIconBox>
                  <WeatherCategoryBox>
                    <WeatherCategoryMain>최고</WeatherCategoryMain>
                    <WeatherCategorySub>
                      {Math.round(res.main.temp_max)}º
                    </WeatherCategorySub>
                  </WeatherCategoryBox>
                  <WeatherCategoryBox>
                    <WeatherCategoryMain>최저</WeatherCategoryMain>
                    <WeatherCategorySub>
                      {Math.round(res.main.temp_min)}º
                    </WeatherCategorySub>
                  </WeatherCategoryBox>
                  <WeatherCategoryBox>
                    <WeatherCategoryMain>바람</WeatherCategoryMain>
                    <WeatherCategorySub>
                      {Math.round(res.wind.speed)}m/s
                    </WeatherCategorySub>
                  </WeatherCategoryBox>
                </WeatherList>
              );
            })}
          </Slider>
        </Wrapper>
      )}
    </>
  );
};

export default SlickSlider;

const Wrapper = styled.div`
  background: #fff;
  border-bottom: 1px solid #dbdbdb;
  border-top: 1px solid #dbdbdb;
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
  /* box-shadow: 0px 6px 0 -2px #e29be9, 0px 6px #222222; */
`;

const WeatherList = styled.div`
  border-right: 1px solid #dbdbdb;
  border-top: 1px solid #dbdbdb;
  width: 156px;
  padding: 12px;
  font-size: 12px;
  line-height: 20px;
  word-wrap: break-word;
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
  /* right: -12px; */
  /* transform: translate(0, -50%); */
  top: -25px;
  right: 325px;
  border-radius: 50%;
  border: 1px solid #dbdbdb;
  background-color: #fff;
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
  top: -25px;
  left: 325px;
  /* left: -12px; */
  /* transform: translate(0, -50%); */
  border-radius: 50%;
  border: 1px solid #dbdbdb;
  background-color: #fff;
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
