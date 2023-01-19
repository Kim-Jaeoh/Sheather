import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "../utils//slick-theme.css";
import styled from "@emotion/styled";
import { WeatherMapDataType } from "../types/type";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

type PropsType<T> = {
  data: T[];
};

interface ResDataType {
  dt?: number;
  dt_txt?: string;
  weather?: { description: string; icon: string }[];
  main?: { temp_max: number; temp_min: number };
  wind: { speed: number };
}

const SlickSlider = ({ data }: PropsType<ResDataType>) => {
  const [dayCheck, setDayCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState("");

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: data?.length <= 3 ? 4 : 4,
    slidesToScroll: 1,
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

  // 오늘 날짜 체크
  useEffect(() => {
    if (data) {
      const time = new Date();
      const today = data[1]?.dt_txt?.split("-")[2].split(" ")[0];
      setDayCheck(time.getDate() === Number(today));
      // setDay(
      //   check ? "오늘" : `${data[1]?.dt_txt?.split("-")[2].split(" ")[0]}일`
      // );
    }
  }, [data]);

  // 오늘 날짜 체크
  useEffect(() => {
    if (dayCheck) {
      setLoading(true);
    }
  }, [dayCheck]);

  return (
    <>
      {data[1] && (
        <Wrapper>
          <WeatherDateBox>
            <WeatherDate>
              {dayCheck
                ? "오늘"
                : `${data[1]?.dt_txt?.split("-")[2].split(" ")[0]}일`}
            </WeatherDate>
          </WeatherDateBox>
          <Slider {...settings}>
            {data?.map((res: ResDataType, index: number) => {
              return (
                <WeatherList key={res?.dt}>
                  <WeatherDateListBox now={res?.dt_txt}>
                    <WeatherDateList now={res?.dt_txt}>
                      {!res?.dt_txt
                        ? "지금"
                        : `${res?.dt_txt?.split(":")[0].split(" ")[1]}시`}
                    </WeatherDateList>
                  </WeatherDateListBox>
                  <WeatherCategoryIconBox>
                    <WeatherCategoryIcon
                      src={`http://openweathermap.org/img/wn/${res?.weather[0]?.icon}@2x.png`}
                      alt="weather icon"
                    />
                    <WeatherCategoryIconText>
                      {res?.weather[0]?.description}
                    </WeatherCategoryIconText>
                  </WeatherCategoryIconBox>
                  <WeatherCategoryBox>
                    <WeatherCategoryText>
                      <WeatherCategoryMain>최고</WeatherCategoryMain>
                      <WeatherCategorySub>
                        {Math.round(res?.main.temp_max)}º
                      </WeatherCategorySub>
                    </WeatherCategoryText>
                    <WeatherCategoryText>
                      <WeatherCategoryMain>최저</WeatherCategoryMain>
                      <WeatherCategorySub>
                        {Math.round(res?.main.temp_min)}º
                      </WeatherCategorySub>
                    </WeatherCategoryText>
                    <WeatherCategoryText>
                      <WeatherCategoryMain>바람</WeatherCategoryMain>
                      <WeatherCategorySub>
                        {Math.round(res?.wind.speed)}m/s
                      </WeatherCategorySub>
                    </WeatherCategoryText>
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
  /* border-top: 1px solid #dbdbdb; */
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const WeatherDateBox = styled.div`
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -2px;
  border-top: 2px solid #222;
  border-bottom: 2px solid #222;
`;

const WeatherDate = styled.span`
  width: 52px;
  font-size: 14px;
  font-weight: bold;
  width: 54px;
  padding: 4px 10px;
  border-radius: 9999px;
  background-color: #48a3ff;
  color: #fff;
  /* border: 1px solid #dbdbdb; */
`;

const WeatherList = styled.div`
  border-right: 1px solid #dbdbdb;
  /* border-top: 1px solid #dbdbdb; */
  width: 156px;
  padding: 20px;
  font-size: 12px;
  line-height: 20px;
  word-wrap: break-word;
  margin-right: -2px;
`;

const WeatherDateListBox = styled.div<{ now: string }>`
  width: 52px;
  border: 1px solid ${(props) => (!props?.now ? "#48a3ff" : "#b3b3b3")};
  border-radius: 9999px;
  margin: 0 auto;
  text-align: center;
  padding: 2px 10px;
`;

const WeatherDateList = styled.span<{ now: string }>`
  color: ${(props) => !props?.now && "#48a3ff"};
  font-size: 14px;
  font-weight: bold;
`;

const WeatherCategoryBox = styled.div``;

const WeatherCategoryText = styled.div`
  &:not(:last-of-type) {
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
  margin: -8px 0;
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

const Arrow = styled.div`
  position: absolute;
  width: 22px;
  height: 22px;
  /* right: -12px; */
  /* transform: translate(0, -50%); */
  top: -25px;
  border-radius: 50%;
  border: 1px solid #48a3ff;
  background-color: #fff;
  z-index: 10;
  transition: all 0.1s;
  color: #48a3ff;

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NextArrow = styled(Arrow)`
  right: 325px;

  span {
    svg {
      padding-left: 2px;
    }
  }
`;

const PrevArrow = styled(Arrow)`
  left: 325px;
  span {
    svg {
      padding-right: 2px;
    }
  }
`;
