import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import a from "../assets/test1.jpeg";
import b from "../assets/test2.jpeg";
import c from "../assets/test3.jpeg";
import d from "../assets/test4.jpeg";
import e from "../assets/test5.jpeg";
import f from "../assets/test6.jpeg";
import defaultAccount from "../assets/account_img_default.png";
import ColorList from "../assets/ColorList";
import { FaRegHeart } from "react-icons/fa";
import { BsCalendar3 } from "react-icons/bs";
import Calendar from "react-calendar";
import "../styles/Calendar.css"; // css import
import { Spinner } from "../assets/Spinner";
import { Skeleton } from "@mui/material";
import FeedModal from "../components/modal/feed/FeedModal";
import DetailFeed from "../components/feed/DetailFeed";
import { Link, useNavigate } from "react-router-dom";
import data from "../assets/data.json";

const Home = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [selectTime, setSelectTime] = useState(null);
  const [getSize, setGetSize] = useState<boolean>(false);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isCalendar, setIsCalendar] = useState(false);
  // const testArray = [a, b, c, d, e, f];
  let getWidth = new Image(); // 이미지 정보 얻기

  const timeArray = [
    "00 ~ 03시",
    "04 ~ 06시",
    "07 ~ 12시",
    "13 ~ 15시",
    "16 ~ 18시",
    "19 ~ 21시",
  ];

  const onClickCalendar = () => setIsCalendar((prev) => !prev);

  const feed = useMemo(() => {
    if (selectCategory === 0) {
      return data.feed;
    }
    if (selectCategory === 1) {
      return data.feed
        .filter((res) => res.like)
        .sort((a: any, b: any) => b.like - a.like);
    }
    if (selectCategory === 2) {
      return data.feed
        .filter((res) => res.like)
        .sort((a: any, b: any) => b.like - a.like);
    }
  }, [selectCategory]);

  console.log(new Date(1664207202124));

  const CalendarBox = styled.div`
    z-index: 99;
    position: absolute;
    right: 10px;
    top: 36px;
  `;

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

  // const [openFeedModal, setOpenFeedModal] = useState<boolean>(false);

  // const onOpenFeedModal = () => setOpenFeedModal((prev) => !prev);

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
                  key={time}
                  select={selectTime}
                >
                  {time}
                </SelectTime>
              ))}
            </SelectDetailTime>
          )}
        </SelectTimeBox>

        {feed ? (
          <CardBox>
            {feed.map((res, index) => {
              getWidth.onload = () => {
                setGetSize(getWidth.complete);
              };
              getWidth.src = res.url[0];
              return (
                <CardList key={index}>
                  <Card
                    // onClick={() => onClickDetail(res.email)}
                    aspect={getWidth.width}
                    to={"/detail"}
                    state={res.email}
                  >
                    {getSize && (
                      <>
                        <WeatherEmojiBox>
                          <WeatherEmoji>{res.feel}</WeatherEmoji>
                        </WeatherEmojiBox>
                        <CardLengthBox>
                          {res.url.length > 1 && (
                            <CardLength>+{res.url.length}</CardLength>
                          )}
                        </CardLengthBox>
                        <CardImage
                          onContextMenu={(e) => e.preventDefault()}
                          src={res.url[0]}
                          alt=""
                        />
                      </>
                    )}
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
                      <UserReactBox>
                        <UserIcon>
                          <FaRegHeart />
                        </UserIcon>
                        <UserReactNum>{res.like}</UserReactNum>
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
                  style={{
                    border: "2px solid #dbdbdb",
                    width: "238px",
                    height: "344px",
                  }}
                >
                  <Card
                    to={""}
                    style={{
                      width: "234px",
                      height: "234px",
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
                    style={{ width: "234px", height: "104px", padding: "12px" }}
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

const Container = styled.main`
  height: 100%;
  padding: 20px;
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

const CardBox = styled.ul`
  width: 100%;
  column-width: 300px;
  column-gap: 20px;
`;

const CardList = styled.li`
  display: inline-block;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  position: relative;

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
  /* padding-top: ${(props) => (props.aspect === 525 ? "100%" : "133.33%")}; */
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

const CardImage = styled.img`
  /* position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0; */
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
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

const UserReactBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${thirdColor};
`;

const UserReactNum = styled.p`
  margin-left: 2px;
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
