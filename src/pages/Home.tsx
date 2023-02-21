import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import defaultAccount from "../assets/account_img_default.png";
import ColorList from "../assets/ColorList";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FeedType } from "../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import useToggleLike from "../hooks/useToggleLike";
import useToggleBookmark from "../hooks/useToggleBookmark";
import moment from "moment";
import RangeTimeModal from "../components/modal/feed/RangeTimeModal";
import HomeSkeleton from "../assets/skeleton/HomeSkeleton";

const Home = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [feed, setFeed] = useState(null);
  const [rangeTime, setRangeTime] = useState<number[]>([1, 24]);
  const [changeValue, setChangeValue] = useState<Date | null>(new Date());
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetailDone, setIsDetailDone] = useState(false);
  const { toggleLike } = useToggleLike(); // 좋아요 커스텀 훅
  const { toggleBookmark } = useToggleBookmark(); // 좋아요 커스텀 훅
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

  useEffect(() => {
    const date = (time: number) => new Date(time);

    // 최신
    if (selectCategory === 0) {
      return setFeed(
        feedData
          ?.filter((res) => res.createdAt)
          .sort((a, b) => a.createdAt - b.createdAt)
      );
    }

    // 인기
    if (selectCategory === 1) {
      return setFeed(feedData.sort((a, b) => b.like.length - a.like.length));
    }

    // 시간별
    if (selectCategory === 2) {
      if (isDetailDone) {
        // 1). 글 작성 날짜와 캘린더 날짜 비교
        const dayFilter = feedData.filter(
          (res) =>
            moment(res?.createdAt).format("YYYY-MM-DD") ===
            moment(changeValue).format("YYYY-MM-DD")
        );
        // 1)의 값에 시간 지정
        return setFeed(
          dayFilter
            .filter((res) => {
              const hour = date(res.createdAt).getHours();
              return hour >= rangeTime[0] && hour < rangeTime[1];
            })
            .sort((a, b) => a.like.length - b.like.length)
        );
      }
    }
  }, [selectCategory, feedData, isDetailDone, rangeTime, changeValue]);

  let checkSize: number;
  let checkAspect: number;
  const sizes = (aspect: string) => {
    if (aspect === "4/3") {
      return (checkSize = 36);
    }
    if (aspect === "1/1") {
      return (checkSize = 44);
    }
    if (aspect === "3/4") {
      return (checkSize = 54);
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

  const onSelectCategory2 = () => {
    setSelectCategory(2);
    setIsDetailDone(false);
    setIsDetailModal(true);
  };

  const onReset = () => {
    setRangeTime([1, 24]);
    setChangeValue(new Date());
  };

  const onDone = () => {
    setIsDetailDone(true);
    setIsDetailModal(false);
  };

  return (
    <>
      <Container>
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
              onClick={onSelectCategory2}
              select={selectCategory}
              num={2}
            >
              시간별
            </SelectCurrentTime>
          </SelectCategory>

          {selectCategory === 2 && isDetailModal && (
            <RangeTimeModal
              rangeTime={rangeTime}
              setRangeTime={setRangeTime}
              changeValue={changeValue}
              setChangeValue={setChangeValue}
              onReset={onReset}
              onDone={onDone}
            />
          )}
        </SelectTimeBox>

        {isDetailDone && selectCategory === 2 && (
          <SelectDetailTimeBox>
            <SelectDetailTime>
              {moment(changeValue).format("YYYY년 MM월 DD일")} &nbsp;
              {rangeTime[0] < 10 ? "0" + rangeTime[0] : rangeTime[0]} ~{" "}
              {rangeTime[1] < 10 ? "0" + rangeTime[1] : rangeTime[1]}시
            </SelectDetailTime>
          </SelectDetailTimeBox>
        )}

        {!isLoading && feed ? (
          <CardBox feedLength={feed?.length}>
            {feed?.map((res: FeedType, index: number) => {
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
                      <UserReactBox>
                        <UserIconBox>
                          <UserIcon onClick={() => toggleLike(res)}>
                            {res.like.filter(
                              (asd) => asd.email === userObj.email
                            ).length > 0 ? (
                              <FaHeart style={{ color: "#FF5673" }} />
                            ) : (
                              <FaRegHeart />
                            )}
                          </UserIcon>
                          <UserReactNum>{res.like.length}</UserReactNum>
                        </UserIconBox>
                        <UserIcon onClick={() => toggleBookmark(res.id)}>
                          {userObj?.bookmark?.filter((id) => id === res.id)
                            .length > 0 ? (
                            <FaBookmark style={{ color: "#FF5673" }} />
                          ) : (
                            <FaRegBookmark />
                          )}
                        </UserIcon>
                      </UserReactBox>
                    </UserInfoBox>
                    <UserText>{res.text}</UserText>
                  </UserBox>
                </CardList>
              );
            })}
          </CardBox>
        ) : (
          <HomeSkeleton />
        )}

        {feed && feed.length < 1 && (
          <NotInfoBox>
            <NotInfo>해당 날짜의 글이 존재하지 않습니다.</NotInfo>
          </NotInfoBox>
        )}
      </Container>
    </>
  );
};
export default React.memo(Home);

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.main`
  height: 100%;
  padding: 20px 10px 10px;
  position: relative;
`;

const SelectTimeBox = styled.nav<{ select: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const SelectDetailTimeBox = styled.div`
  width: 100%;
  padding: 0 10px;
  margin-bottom: 10px;
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

const SelectDetailTime = styled.p`
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: end;
  color: ${thirdColor};
  padding-top: 10px;
  border-top: 1px solid ${fourthColor};
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
  cursor: pointer;
`;

const CardBox = styled.ul<{ feedLength?: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
`;

const CardList = styled.li<{ size?: number }>`
  display: flex;
  flex-direction: column;

  margin: 10px;
  border-radius: 8px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  grid-row-end: span ${(props) => (props.size ? props.size : 43)};
  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

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
`;

const UserBox = styled.div`
  padding: 12px 12px;
  flex: 1;
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
  margin: 0;
  padding: 0;
  align-items: center;
  gap: 12px;
`;

const UserIconBox = styled.div`
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
  svg {
    font-size: 16px;
  }
`;

const UserReactNum = styled.p`
  font-size: 14px;
  margin-left: 4px;
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

const NotInfoBox = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotInfo = styled.div``;
