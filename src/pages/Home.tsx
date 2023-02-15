import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import defaultAccount from "../assets/account_img_default.png";
import ColorList from "../assets/ColorList";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsCalendar3 } from "react-icons/bs";
import Calendar from "react-calendar";
import "../styles/Calendar.css"; // css import
import { Spinner } from "../assets/Spinner";
import { Skeleton } from "@mui/material";
import FeedModal from "../components/modal/feed/FeedModal";
import DetailFeed from "../components/feed/DetailFeed";
import { Link, useNavigate } from "react-router-dom";
import datas from "../assets/data.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { UserType } from "../app/user";
import { FeedType } from "../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import useToggleLike from "../hooks/useToggleLike";

const Home = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [selectTime, setSelectTime] = useState(null);
  const [getSize, setGetSize] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isCalendar, setIsCalendar] = useState(false);
  const queryClient = useQueryClient();

  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });

  const feedApi = async () => {
    const { data } = await axios.get("http://localhost:4000/api/feed");
    return data;
  };

  // 피드 리스트 가져오기
  const { data: feedData, isLoading } = useQuery<FeedType[]>(
    ["feed"],
    feedApi,
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
    }
  );

  const timeArray = [
    "00 ~ 03시",
    "03 ~ 06시",
    "06 ~ 09시",
    "09 ~ 12시",
    "12 ~ 15시",
    "15 ~ 18시",
    "18 ~ 21시",
    "21 ~ 00시",
  ];

  const onClickCalendar = () => setIsCalendar((prev) => !prev);

  const feed = useMemo(() => {
    const date = (time: number) => new Date(time);
    const timeRanges = [
      [0, 3],
      [3, 6],
      [6, 9],
      [9, 12],
      [12, 15],
      [15, 18],
      [18, 21],
      [21, 24],
    ];

    // 최신
    if (selectCategory === 0) {
      setSelectTime(null); // 시간대별 초기화
      return feedData
        ?.filter((res) => res.createdAt)
        .sort((a, b) => a.createdAt - b.createdAt);
    }

    // 인기
    if (selectCategory === 1) {
      setSelectTime(null); // 시간대별 초기화
      return feedData.sort((a, b) => b.like.length - a.like.length);
    }

    // 시간별
    if (selectCategory === 2) {
      const selectedTimeRange = timeRanges.find(
        (range) => range[0] === selectTime * 3 // selectTime이 0부터 시작이라 3을 곱해서 맞는 index 값 추출
      );

      if (selectTime !== null) {
        return feedData.filter((res) => {
          const hour = date(Number(res.createdAt)).getHours();
          return hour >= selectedTimeRange[0] && hour < selectedTimeRange[1];
        });
      }
      return feedData;
    }
  }, [feedData, selectCategory, selectTime]);

  const CalendarText = () => {
    return (
      changeValue.getFullYear() +
      "-" +
      (changeValue.getMonth() + 1 < 10
        ? "0" + (changeValue.getMonth() + 1)
        : changeValue.getMonth() + 1) +
      "-" +
      (changeValue.getDate() < 10
        ? "0" + changeValue.getDate()
        : changeValue.getDate())
    );
  };

  const { toggleLike } = useToggleLike();
  // // 좋아요
  // const { mutate } = useMutation(
  //   (response: {
  //     parentEmail: string;
  //     like: { email: string; likedAt: number }[];
  //   }) => axios.patch("http://localhost:4000/api/like", response),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(["feed"]);
  //     },
  //   }
  // );

  // const toggleLike = async (res: FeedType) => {
  //   const copy = [...res.like];
  //   const findEmail = copy.filter((res) => res.email === userObj.email);
  //   const filter = copy.filter((res) => res.email !== userObj.email);
  //   if (findEmail.length === 0) {
  //     setLiked(true);
  //     mutate({
  //       parentEmail: res.email,
  //       like: [...copy, { email: userObj.email, likedAt: +new Date() }],
  //     });
  //   } else {
  //     setLiked(false);
  //     mutate({
  //       parentEmail: res.email,
  //       like: filter,
  //     });
  //   }
  // };

  let checkSize: number;
  let checkAspect: number;
  const sizes = (aspect: string) => {
    if (aspect === "4/3") {
      return (checkSize = 36);
      // return { checkSize: 36, checkAspect: 74.8 };
    }
    if (aspect === "1/1") {
      return (checkSize = 44);
      // return { checkSize: 44, checkAspect: 100 };
    }
    if (aspect === "3/4") {
      return (checkSize = 54);
      // return { checkSize: 54, checkAspect: 74.8 };
    }
  };
  const sizeAspect = (aspect: string) => {
    if (aspect === "4/3") {
      return (checkAspect = 74.8);
    }
    if (aspect === "1/1") {
      return (checkAspect = 100);
    }
    if (aspect === "3/4") {
      return (checkAspect = 132.8);
    }
  };

  return (
    <>
      <Container>
        {isCalendar && (
          <CalendarBox>
            <Calendar onChange={setChangeValue} value={changeValue} />
          </CalendarBox>
        )}
        <DateBox onClick={onClickCalendar}>
          <DateIcon>
            <BsCalendar3 />
          </DateIcon>
          <DateText>{CalendarText()}</DateText>
        </DateBox>
        <SelectTimeBox select={selectCategory}>
          <SelectCategory>
            <SelectCurrentTime
              onClick={() => setSelectCategory(0)}
              select={selectCategory}
              num={0}
            >
              최신
            </SelectCurrentTime>
            <SelectCurrentTime
              onClick={() => setSelectCategory(1)}
              select={selectCategory}
              num={1}
            >
              인기
            </SelectCurrentTime>
            <SelectCurrentTime
              onClick={() => setSelectCategory(2)}
              select={selectCategory}
              num={2}
            >
              시간별
            </SelectCurrentTime>
          </SelectCategory>
          {selectCategory === 2 && (
            <SelectDetailTime>
              {timeArray.map((time, index) => (
                <SelectTime
                  onClick={() => setSelectTime(index)}
                  num={index}
                  key={index}
                  select={selectTime}
                >
                  {time}
                </SelectTime>
              ))}
            </SelectDetailTime>
          )}
        </SelectTimeBox>

        {!isLoading ? (
          <CardBox feedLength={feed.length}>
            {feed?.map((res, index: number) => {
              sizes(res.imgAspect);
              sizeAspect(res.imgAspect);
              return (
                <CardList size={checkSize} key={res.createdAt}>
                  <Card
                    aspect={checkAspect}
                    to={"/detail"}
                    state={res.createdAt}
                  >
                    <WeatherEmojiBox>
                      <WeatherEmoji>{res.feel}</WeatherEmoji>
                    </WeatherEmojiBox>
                    <CardLengthBox>
                      {res.url.length > 1 && (
                        <CardLength>+{res.url.length}</CardLength>
                      )}
                    </CardLengthBox>
                    <CardImageBox>
                      <CardImage
                        onContextMenu={(e) => e.preventDefault()}
                        src={res.url[0]}
                        alt=""
                      />
                    </CardImageBox>
                  </Card>
                  <UserBox>
                    <UserInfoBox>
                      <UserImageBox onContextMenu={(e) => e.preventDefault()}>
                        <UserImage
                          src={res.url ? res.url[0] : defaultAccount}
                          alt=""
                        />
                      </UserImageBox>
                      <UserName>{res.displayName}</UserName>
                      <UserReactBox
                        type="button"
                        onClick={() => toggleLike(res)}
                      >
                        <UserIcon>
                          {res.like.filter((asd) => asd.email === userObj.email)
                            .length > 0 ? (
                            <FaHeart style={{ color: "#FF5673" }} />
                          ) : (
                            <FaRegHeart />
                          )}
                        </UserIcon>
                        <UserReactNum>{res.like.length}</UserReactNum>
                      </UserReactBox>
                    </UserInfoBox>
                    <UserText>{res.text}</UserText>
                  </UserBox>
                </CardList>
              );
            })}
          </CardBox>
        ) : (
          <CardBox>
            {Array.from({ length: 9 }).map((res, index) => {
              return (
                <CardList
                  key={index}
                  style={{
                    border: "2px solid #dbdbdb",
                    width: "318px",
                    height: "404px",
                  }}
                >
                  <Card
                    to={""}
                    style={{
                      width: "314px",
                      height: "314px",
                      padding: "12px",
                      borderBottom: "2px solid #dbdbdb",
                    }}
                  >
                    <Skeleton
                      width={"100%"}
                      height={"100%"}
                      variant="rounded"
                    />
                  </Card>
                  <UserBox
                    style={{ width: "314px", height: "84px", padding: "12px" }}
                  >
                    <Skeleton
                      width={"100%"}
                      height={"100%"}
                      variant="rounded"
                    />
                  </UserBox>
                </CardList>
              );
            })}
          </CardBox>
        )}
      </Container>
    </>
  );
};
export default React.memo(Home);

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const CalendarBox = styled.div`
  z-index: 99;
  position: absolute;
  right: 10px;
  top: 36px;
`;

const Container = styled.main`
  height: 100%;
  padding: 20px 10px 10px;
  position: relative;
`;

const SelectTimeBox = styled.nav<{ select: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: ${(props) => (props.select === 2 ? "60px" : "40px")};
  /* padding: 0 0 14px; */
`;

const SelectDetailTime = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding-top: 16px;
  border-top: 1px solid #c7c7c7;

  animation-name: slideDown;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const SelectCategory = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const SelectCurrentTime = styled.li<{ select: number; num: number }>`
  border-radius: 9999px;
  color: ${(props) => (props.num === props.select ? "#fff" : `${thirdColor}`)};
  background: ${(props) =>
    props.num === props.select ? "#ff5673" : "transparent"};
  border: 2px solid
    ${(props) => (props.num === props.select ? "#ff5673" : "tranparent")};
  padding: 6px 12px;
  font-size: 18px;
  font-weight: bold;
  /* margin-bottom: 8px; */
  cursor: pointer;
`;

const SelectTime = styled.li<{ num: number; select: number }>`
  cursor: pointer;
  font-size: 14px;
  letter-spacing: -0.8px;
  &:not(:first-of-type) {
    padding-left: 12px;
  }
  &:not(:last-of-type) {
    padding-right: 12px;
    border-right: 1px solid ${thirdColor};
  }
  font-weight: ${(props) => (props.num === props.select ? "bold" : "normal")};
  color: ${(props) => (props.num === props.select ? secondColor : thirdColor)};
`;

const DateBox = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 12px;
  color: ${thirdColor};
`;
const DateText = styled.span`
  font-size: 14px;
`;

const DateIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardBox = styled.ul<{ feedLength?: number }>`
  /* width: 100%;
  display: ${(props) => props.feedLength === 2 && `flex`};
  column-width: ${(props) =>
    (props.feedLength === 1 || props.feedLength > 2) && `318px`};
  column-gap: 20px; */
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 10px;
`;

const CardList = styled.li<{ size?: number }>`
  /* border-radius: 8px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  height: 100%; */
  margin: 10px;
  border-radius: 8px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  grid-row-end: span ${(props) => props.size};

  animation-name: slideUp;
  animation-duration: 0.4s;
  animation-timing-function: ease-in-out;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const Card = styled(Link)<{ aspect?: number }>`
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  border-bottom: 2px solid ${secondColor};
  /* width: 318px; */
  padding-top: ${(props) => `${props.aspect}%`};
`;

const WeatherEmojiBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
  background-color: rgba(34, 34, 34, 0.4);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const WeatherEmoji = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;

const CardLengthBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  background-color: rgba(34, 34, 34, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const CardLength = styled.span`
  display: inline-block;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;

const CardImageBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  width: 100%;
`;

const CardImage = styled.img`
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
  /* position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  object-fit: cover; */
`;

const UserBox = styled.div`
  padding: 12px 12px;
`;

const UserInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserImageBox = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${fourthColor};
  object-fit: cover;
  cursor: pointer;
`;

const UserImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  image-rendering: auto;
`;

const UserName = styled.div`
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  padding: 8px;
  white-space: nowrap;
  font-size: 14px;
  letter-spacing: -0.15px;
  color: rgba(34, 34, 34, 0.8);
`;

const UserReactBox = styled.button`
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${thirdColor};
  svg {
    margin-right: 4px;
    font-size: 16px;
  }
`;

const UserReactNum = styled.p`
  font-size: 14px;
  color: ${thirdColor};
`;

const UserText = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  margin-top: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 20px;
  font-size: 14px;
  letter-spacing: -0.21px;
`;
