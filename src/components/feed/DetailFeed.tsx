import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { useLocation } from "react-router-dom";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./slick-theme.css";
import Flicking from "@egjs/react-flicking";
import "../../styles/flicking.css";
import { BsBookmark, BsSun } from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import { IoShirtOutline } from "react-icons/io5";
import useTimeFormat from "../../hooks/useTimeFormat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FeedType } from "../../types/type";
import { MdPlace } from "react-icons/md";
import useToggleLike from "../../hooks/useToggleLike";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useToggleBookmark from "../../hooks/useToggleBookmark";
import DetailFeedReply from "./DetailFeedReply";
import Emoji from "../../assets/Emoji";
import { useHandleResizeTextArea } from "../../hooks/useHandleResizeTextArea";

const DetailFeed = () => {
  const [replyText, setReplyText] = useState("");

  const { state } = useLocation();
  const { toggleLike } = useToggleLike();
  const { toggleBookmark } = useToggleBookmark();
  const { timeToString, timeToString2 } = useTimeFormat();
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { handleResizeHeight } = useHandleResizeTextArea(textRef);
  const queryClient = useQueryClient();

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

  const detailInfo = useMemo(() => {
    return feedData?.filter((res) => state === res.createdAt);
  }, [feedData, state]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  type ReplyPayload = {
    id?: string;
    reply?: {
      parentId: string;
      displayName: string;
      replyAt: number;
      email: string;
      text: string | number;
    }[];
  };

  // 댓글 업로드
  const { mutate } = useMutation(
    (response: ReplyPayload) =>
      axios.post("http://localhost:4000/api/reply", response),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  // 댓글 삭제
  const { mutate: mutateDelete } = useMutation(
    (response: ReplyPayload) =>
      axios.delete("http://localhost:4000/api/reply", { data: response }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  // 댓글 업로드
  const onReply = (res: FeedType) => {
    const copy = [...res.reply];
    mutate({
      id: res.id,
      reply: [
        ...copy,
        {
          parentId: res.id,
          displayName: userObj.displayName,
          replyAt: +new Date(),
          email: userObj.email,
          text: replyText,
        },
      ],
    });
    setReplyText("");
  };

  // 댓글 삭제
  const onDelete = (res: {
    parentId?: string;
    email: string;
    displayName: string;
    text: string;
    replyAt: number;
  }) => {
    const filter = detailInfo[0].reply.filter((asd) => asd.text !== res.text);
    mutateDelete({
      id: res.parentId,
      reply: [...filter],
    });
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
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
  };

  return (
    <>
      {feedData && (
        <>
          {detailInfo.map((res) => {
            const reply = res.reply.sort(
              (a: { replyAt: number }, b: { replyAt: number }) =>
                b.replyAt - a.replyAt
            );
            return (
              <Wrapper key={res.id}>
                <Container>
                  <Header>
                    <UserInfoBox>
                      <UserImageBox>
                        <UserImage src={res?.url[0]} alt="" />
                      </UserImageBox>
                      <UserWriteInfo>
                        <UserName>{res.displayName}</UserName>
                        <WriteDate>
                          {timeToString2(Number(res.createdAt))}
                        </WriteDate>
                      </UserWriteInfo>
                      <FollowBtnBox>팔로우</FollowBtnBox>
                    </UserInfoBox>
                  </Header>
                  <WearDetailBox>
                    <WearDetail>
                      <WearInfoBox>
                        <WearInfoMain>
                          <BsSun />
                        </WearInfoMain>
                        <FlickingBox>
                          <Flicking
                            onChanged={(e) => console.log(e)}
                            moveType="freeScroll"
                            bound={true}
                            align="prev"
                          >
                            <WearInfo>
                              <TagBox>
                                <Tag>
                                  <MdPlace />
                                  {res.region}
                                </Tag>
                                <Tag>
                                  <WeatherIcon>
                                    <img
                                      src={`http://openweathermap.org/img/wn/${res.weatherInfo.weatherIcon}@2x.png`}
                                      alt="weather icon"
                                    />
                                  </WeatherIcon>
                                  {res.weatherInfo.weather}
                                </Tag>
                                <Tag>{res.weatherInfo.temp}º</Tag>
                                <Tag>
                                  {res.weatherInfo.wind}
                                  <span>m/s</span>
                                </Tag>
                              </TagBox>
                            </WearInfo>
                          </Flicking>
                        </FlickingBox>
                      </WearInfoBox>
                    </WearDetail>
                    <WearDetail>
                      <WearInfoBox>
                        <WearInfoMain>
                          <IoShirtOutline />
                        </WearInfoMain>
                        <FlickingBox>
                          <Flicking
                            onChanged={(e) => console.log(e)}
                            moveType="freeScroll"
                            bound={true}
                            align="prev"
                          >
                            <WearInfo>
                              <TagBox>
                                <Tag>{res.feel}</Tag>
                                {res.wearInfo.outer && (
                                  <Tag>{res.wearInfo.outer}</Tag>
                                )}
                                {res.wearInfo.top && (
                                  <Tag>{res.wearInfo.top}</Tag>
                                )}
                                {res.wearInfo.bottom && (
                                  <Tag>{res.wearInfo.bottom}</Tag>
                                )}
                                {res.wearInfo.etc && (
                                  <Tag>{res.wearInfo.etc}</Tag>
                                )}
                              </TagBox>
                            </WearInfo>
                          </Flicking>
                        </FlickingBox>
                      </WearInfoBox>
                    </WearDetail>
                  </WearDetailBox>
                  {res.url.length > 1 ? (
                    <Slider {...settings}>
                      {res.url.map((res, index) => {
                        return (
                          <Card key={index}>
                            <CardImage src={res} alt="" />
                          </Card>
                        );
                      })}
                    </Slider>
                  ) : (
                    <Card onContextMenu={(e) => e.preventDefault()}>
                      <CardImage src={res.url[0]} alt="" />
                    </Card>
                  )}
                  <InfoBox>
                    <TextBox>
                      <UserReactBox>
                        <IconBox>
                          <Icon onClick={() => toggleLike(res)}>
                            {res.like.filter(
                              (res) => res.email === userObj.email
                            ).length > 0 ? (
                              <FaHeart style={{ color: "#FF5673" }} />
                            ) : (
                              <FaRegHeart />
                            )}
                          </Icon>
                          <Icon onClick={() => toggleBookmark(res.id)}>
                            {userObj?.bookmark?.filter((id) => id === res.id)
                              .length > 0 ? (
                              <FaBookmark style={{ color: "#FF5673" }} />
                            ) : (
                              <FaRegBookmark />
                            )}
                          </Icon>
                        </IconBox>
                        <Icon>
                          <FiShare />
                        </Icon>
                      </UserReactBox>
                      <UserReactNum>공감 {res.like.length}개</UserReactNum>
                      <UserTextBox>
                        <UserText>{res.text}</UserText>
                      </UserTextBox>
                    </TextBox>
                    <ReplyBox>
                      {res.reply.length > 0 && (
                        <>
                          <UserReactNum>댓글 {res.reply.length}개</UserReactNum>
                          {reply.map((reply, index) => {
                            return (
                              <DetailFeedReply
                                key={index}
                                reply={reply}
                                onDelete={onDelete}
                              />
                            );
                          })}
                        </>
                      )}
                      <ReplyEditBox>
                        <ReplyEditText
                          spellCheck="false"
                          maxLength={120}
                          value={replyText}
                          ref={textRef}
                          onChange={onChange}
                          onInput={handleResizeHeight}
                          placeholder="댓글 달기..."
                        />
                        {replyText.length > 0 && (
                          <ReplyEditBtn onClick={() => onReply(res)}>
                            게시
                          </ReplyEditBtn>
                        )}
                        <Emoji setText={setReplyText} textRef={textRef} />
                      </ReplyEditBox>
                    </ReplyBox>
                  </InfoBox>
                </Container>
              </Wrapper>
            );
          })}
        </>
      )}
    </>
  );
};

export default DetailFeed;
const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.main`
  position: relative;
  overflow: hidden;
  /* height: 100%; */
  /* width: 500px;
  margin: 0 auto; */
  padding: 20px 60px 30px;
  background: #ff5673;
`;

const Container = styled.main`
  border: 2px solid ${secondColor};
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: #d43d59 1px 1px, #d43d59 0px 0px, #d43d59 1px 1px, #d43d59 2px 2px,
    #d43d59 3px 3px, #d43d59 4px 4px, #d43d59 5px 5px, #d43d59 6px 6px,
    #d43d59 7px 7px, #d43d59 8px 8px, #d43d59 9px 9px, #d43d59 10px 10px,
    #d43d59 11px 11px, #d43d59 12px 12px, #d43d59 13px 13px, #d43d59 14px 14px,
    #d43d59 15px 15px, #d43d59 16px 16px, #d43d59 17px 17px, #d43d59 18px 18px,
    #d43d59 19px 19px, #d43d59 20px 20px, #d43d59 21px 21px, #d43d59 22px 22px,
    #d43d59 23px 23px, #d43d59 24px 24px, #d43d59 25px 25px, #d43d59 26px 26px,
    #d43d59 27px 27px, #d43d59 28px 28px, #d43d59 29px 29px, #d43d59 30px 30px,
    #d43d59 31px 31px, #d43d59 32px 32px, #d43d59 33px 33px, #d43d59 34px 34px,
    #d43d59 35px 35px, #d43d59 36px 36px, #d43d59 37px 37px, #d43d59 38px 38px,
    #d43d59 39px 39px, #d43d59 40px 40px, #d43d59 41px 41px, #d43d59 42px 42px,
    #d43d59 43px 43px, #d43d59 44px 44px, #d43d59 45px 45px, #d43d59 46px 46px,
    #d43d59 47px 47px, #d43d59 48px 48px, #d43d59 49px 49px, #d43d59 50px 50px,
    #d43d59 51px 51px, #d43d59 52px 52px, #d43d59 53px 53px, #d43d59 54px 54px,
    #d43d59 55px 55px, #d43d59 56px 56px, #d43d59 57px 57px, #d43d59 58px 58px,
    #d43d59 59px 59px, #d43d59 60px 60px, #d43d59 61px 61px, #d43d59 62px 62px,
    #d43d59 63px 63px;
  /* box-shadow: 8px 8px 0px #86192c4c; */
`;

const Header = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${thirdColor};
`;

const UserInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserImageBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${fourthColor};
  object-fit: cover;
  cursor: pointer;
`;

const UserWriteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
  color: ${thirdColor};
`;

const WriteDate = styled.span`
  font-size: 12px;
`;

const UserName = styled.div`
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: -0.15px;
  color: rgba(34, 34, 34, 0.8);
`;

const FollowBtnBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 16px;
  /* width: 82px; */
  /* height: 30px; */
  color: #fff;
  border-radius: 9999px;
  background: #000;
  cursor: pointer;
`;

const UserImage = styled.img`
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
`;

const Card = styled.div`
  display: block;
  position: relative;
  /* cursor: pointer; */
  user-select: none;
  outline: none;
  overflow: hidden;
  /* max-height: 532px; */
  border-bottom: 1px solid ${thirdColor};
`;

const CardImage = styled.img`
  /* object-fit: cover; */
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: auto;
`;

const WearDetailBox = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  border-bottom: 2px solid ${secondColor};
`;

const WearDetail = styled.div`
  padding: 12px;
  display: flex;
  flex: 1;
  align-items: center;
  &:not(:last-of-type) {
    border-right: 1px solid ${thirdColor};
  }
`;

const WearInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const WearInfoMain = styled.div`
  flex: 0 0 auto;
  user-select: text;
  color: ${secondColor};
  /* min-width: 55px; */
  text-align: center;
  margin-right: 8px;
  /* padding-right: 8px; */
  /* border-right: 1px solid ${thirdColor}; */
  font-size: 14px;

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FlickingBox = styled.div`
  position: relative;
  cursor: pointer;

  /* &::before {
    left: 0px;
    background: linear-gradient(to right, #fafafa, rgba(255, 255, 255, 0));
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 120%;
    width: 14px;
    content: "";
  } */

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

const TagBox = styled.div`
  display: flex;
  /* user-select: none; */
  flex: nowrap;
  gap: 8px;
`;

const Tag = styled.div`
  font-size: 14px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  border: 1px solid ${thirdColor};
  border-radius: 4px;

  svg {
    margin-right: 2px;
    font-size: 12px;
    color: ${secondColor};
  }
  /* cursor: pointer; */
  /* background: ${mainColor}; */
`;

const InfoBox = styled.div`
  /* height: 300px; */
  padding: 20px;
  margin-top: -4px;
  /* border-bottom: 1px solid ${thirdColor}; */
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReplyBox = styled.div`
  margin-top: 30px;
  /* display: flex; */
  /* flex-direction: column; */
`;

const ReplyEditBox = styled.div`
  padding-top: 20px;
  margin-top: 24px;
  width: 100%;
  height: 100%;
  border-top: 1px solid ${fourthColor};
  /* height: 32px; */
  /* max-height: 80px; */
  position: relative;
  display: flex;
  align-items: center;
`;

const ReplyEditText = styled.textarea`
  display: block;
  width: 100%;
  height: 24px;
  max-height: 80px;
  resize: none;
  border: none;
  outline: none;
  line-height: 24px;
`;

const ReplyEditBtn = styled.div`
  display: flex;
  flex: 1 0 auto;
  margin: 0 8px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  outline: none;
  font-weight: bold;
  color: #d43d59;
  font-size: 14px;
  cursor: pointer;
`;

const UserReactBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: -2px;
  margin-bottom: 16px;
`;

const UserReactNum = styled.p`
  font-size: 15px;
  color: ${thirdColor};
  margin-bottom: 6px;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${thirdColor};
  svg {
    font-size: 24px;
  }
`;

const UserTextBox = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 30px;
  font-size: 16px;
  letter-spacing: -0.21px;
`;

const UserId = styled.p`
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  cursor: pointer;
`;

const UserText = styled.span`
  font-size: 16px;
  white-space: pre-wrap;
`;

const ReplyTextBox = styled(UserTextBox)`
  line-height: 24px;
`;

const ReplyText = styled(UserText)`
  font-size: 14px;
`;

const Arrow = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  transform: translate(0, -50%);
  border-radius: 50%;
  background-color: #fff;
  z-index: 10;
  transition: all 0.1s;
  color: #e74b7a;

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NextArrow = styled(Arrow)`
  right: 20px;

  span {
    svg {
      padding-left: 2px;
    }
  }
`;

const PrevArrow = styled(Arrow)`
  left: 20px;

  span {
    svg {
      padding-right: 2px;
    }
  }
`;
