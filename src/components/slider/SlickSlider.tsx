import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./slick-theme.css";

import styled from "@emotion/styled";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FiShare } from "react-icons/fi";
import { TbShirt } from "react-icons/tb";
import Clothes from "../clothes/Clothes";
import { shareWeather } from "../../app/getWeather";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { WeathersFiveDataType } from "../../types/type";
import ShareWeather from "../modal/shareWeather/ShareWeatherModal";
import { Skeleton, Stack } from "@mui/material";
import SliderSkeleton from "../../assets/skeleton/SliderSkeleton";
import ColorList from "../../assets/ColorList";
import ShareWeatherImage from "../modal/shareWeather/ShareWeatherImage";

type PropsType<T> = {
  data: T[];
};

export interface ResDataType {
  dt?: number;
  dt_txt?: string;
  weather?: { description: string; icon: string }[];
  main?: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
  };
  wind?: { speed: number };
}

const SlickSlider = ({ data }: PropsType<WeathersFiveDataType>) => {
  const [clothesBtn, setClothesBtn] = useState(false);
  const [shareBtn, setShareBtn] = useState(false);
  const [selected, setSelected] = useState(null);
  const dispach = useDispatch();

  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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

  // 오늘 날짜인지 boolean 체크
  const dayCheck = useMemo(() => {
    if (data) {
      const time = new Date();
      const today =
        data[0]?.dt_txt?.split("-")[2].split(" ")[0] ||
        data[1]?.dt_txt?.split("-")[2].split(" ")[0];
      return time.getDate() === Number(today);
    }
  }, [data]);

  // 날짜 입력값
  const day = useMemo(() => {
    if (data) {
      return dayCheck
        ? "오늘"
        : `${data[1]?.dt_txt?.split("-")[2].split(" ")[0]}일`;
    }
  }, [data, dayCheck]);

  const clothBtnClick = (index: number) => {
    setClothesBtn((prev) => !prev);
    setSelected(index);
  };

  const shareBtnClick = () => {
    setShareBtn(true);
    if (shareBtn) {
      const ok = window.confirm(
        "게시물을 삭제하시겠어요? 지금 나가면 수정 내용이 저장되지 않습니다."
      );
      if (ok) {
        setShareBtn(false);
      }
    }
  };

  const timeStamp = Math.floor(+new Date() / 1000);

  return (
    <>
      {/* {shareBtn && (
        <ShareWeather shareBtn={shareBtn} shareBtnClick={shareBtnClick} />
      )} */}
      {shareBtn && (
        <ShareWeatherImage
          shareBtn={shareBtn}
          setShareBtn={setShareBtn}
          shareBtnClick={shareBtnClick}
        />
      )}
      {/* {clothesBtn ? ( */}
      {data && data[0] ? (
        <Wrapper>
          <WeatherDateBox>
            <WeatherDate>{day}</WeatherDate>
          </WeatherDateBox>
          <Slider {...settings}>
            {data?.map((res: ResDataType, index: number) => {
              return (
                <Container key={res?.dt}>
                  {index === selected && clothesBtn && (
                    <Clothes
                      index={index}
                      clothBtnClick={() => clothBtnClick(index)}
                      temp={res?.main?.temp}
                    />
                  )}
                  <WeatherList
                    clothes={clothesBtn}
                    index={index}
                    selected={selected}
                  >
                    <WeatherInfoBox>
                      <WeatherInfoBtn onClick={() => clothBtnClick(index)}>
                        <TbShirt />
                      </WeatherInfoBtn>
                      <WeatherDateListBox now={res?.dt_txt}>
                        <WeatherDateList now={res?.dt_txt}>
                          {!res?.dt_txt
                            ? "지금"
                            : `${res?.dt_txt?.split(":")[0].split(" ")[1]}시`}
                        </WeatherDateList>
                      </WeatherDateListBox>
                      {!res?.dt_txt && userObj.displayName && (
                        <WeatherInfoBtn
                          // disabled={timeStamp < res.dt - 9 * 60 * 60} // -9시간
                          disabled={Boolean(res?.dt_txt)} // -9시간
                          onClick={() => {
                            shareBtnClick();
                            dispach(shareWeather(res));
                          }}
                        >
                          <FiShare />
                        </WeatherInfoBtn>
                      )}
                    </WeatherInfoBox>

                    <WeatherCategoryIconBox>
                      <WeatherCategoryIconText>
                        {res?.weather[0]?.description}
                      </WeatherCategoryIconText>
                      <WeatherCategoryIcon
                        src={`http://openweathermap.org/img/wn/${res?.weather[0]?.icon}@2x.png`}
                        alt="weather icon"
                      />
                      <WeatherCategoryIconText>
                        {Math.round(res?.main.temp)}º
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
                        <WeatherCategoryMain>체감</WeatherCategoryMain>
                        <WeatherCategorySub>
                          {Math.round(res?.main?.feels_like)}º
                        </WeatherCategorySub>
                      </WeatherCategoryText>
                      <WeatherCategoryText>
                        <WeatherCategoryMain>바람</WeatherCategoryMain>
                        <WeatherCategorySub>
                          {Math.round(res?.wind.speed)}
                          <span>m/s</span>
                        </WeatherCategorySub>
                      </WeatherCategoryText>
                    </WeatherCategoryBox>
                  </WeatherList>
                </Container>
              );
            })}
          </Slider>
        </Wrapper>
      ) : (
        <SliderSkeleton />
      )}
    </>
  );
};

export default React.memo(SlickSlider);

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.div`
  background: #fff;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${secondColor};
  box-shadow: 8px 8px 0px rgba(35, 92, 150, 0.3);
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  /* height: 330px; */
  padding: 14px;
  word-wrap: break-word;
  position: relative;
  border-right: 1px solid ${fourthColor};
`;

const WeatherInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin: -7px; */
`;

const WeatherInfoBtn = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid ${fourthColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: all 0.1s;
  outline: none;
  cursor: pointer;
  :disabled {
    cursor: default;
  }

  &:not(:disabled):hover {
    border: 1px solid #48a3ff;
    svg {
      color: #48a3ff;
    }
  }
  svg {
    font-size: 24px;
  }
`;

const WeatherDateBox = styled.div`
  text-align: center;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -2px;
  border-top: 2px solid ${secondColor};
  border-bottom: 2px solid ${secondColor};
`;

const WeatherDate = styled.span`
  font-size: 14px;
  font-weight: bold;
  width: 50px;
  padding: 6px 10px;
  border-radius: 9999px;
  background-color: #48a3ff;
  color: #fff;
`;

const WeatherList = styled.div<{
  index: number;
  selected: number;
  clothes: boolean;
}>`
  filter: ${(props) =>
    props.clothes && props.index === props.selected && "blur(3px)"};
  transition: filter 0.1s ease;
  width: 100%;
  font-size: 12px;
  line-height: 20px;
  word-wrap: break-word;
`;

const WeatherDateListBox = styled.div<{ now?: string }>`
  width: 52px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  border: 1px solid ${(props) => (!props?.now ? "#48a3ff" : "#b3b3b3")};
  border-radius: 9999px;
  margin: 0 auto;
  text-align: center;
  padding: 2px 10px;
`;

const WeatherDateList = styled.span<{ now?: string }>`
  color: ${(props) => !props?.now && "#48a3ff"};
  font-size: 14px;
  font-weight: bold;
  user-select: text;
`;

const WeatherCategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 4px;
`;

const WeatherCategoryText = styled.div`
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:not(:nth-of-type(3), :nth-of-type(4)) {
    margin-bottom: 14px;
  }
`;

const WeatherCategoryIconBox = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 26px;
`;

const WeatherCategoryIcon = styled.img`
  display: block;
  margin: -4px 0 2px;
  width: 100px;
`;

const WeatherCategoryIconText = styled.span`
  user-select: text;
  font-weight: bold;

  &:not(:last-of-type) {
    margin-top: 20px;
  }
  &:not(:first-of-type) {
    font-size: 20px;
  }
`;

const WeatherCategoryMain = styled.span`
  user-select: text;
  border: 1px solid ${thirdColor};
  border-radius: 9999px;
  padding: 0px 6px;
  margin-bottom: 4px;
  font-size: 12px;
  color: ${thirdColor};
`;

const WeatherCategorySub = styled.span`
  user-select: text;
  font-size: 14px;
  span {
    font-size: 10px;
  }
`;

const Arrow = styled.div`
  position: absolute;
  width: 22px;
  height: 22px;
  /* right: -12px; */
  transform: translate(0, -50%);
  top: -27px;
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
  right: 270px;

  span {
    svg {
      padding-left: 2px;
    }
  }
`;

const PrevArrow = styled(Arrow)`
  left: 270px;
  span {
    svg {
      padding-right: 2px;
    }
  }
`;
