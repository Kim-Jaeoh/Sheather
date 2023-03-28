import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Flicking from "@egjs/react-flicking";
import "../../styles/DetailFlicking.css";
import { BsSun } from "react-icons/bs";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoShirtOutline } from "react-icons/io5";
import useTimeFormat from "../../hooks/useTimeFormat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FeedType, replyType } from "../../types/type";
import { MdPlace } from "react-icons/md";
import useToggleLike from "../../hooks/useToggleLike";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useToggleBookmark from "../../hooks/useToggleBookmark";
import DetailFeedReply from "./DetailFeedReply";
import Emoji from "../../assets/Emoji";
import { useHandleResizeTextArea } from "../../hooks/useHandleResizeTextArea";
import useFlickingArrow from "../../hooks/useFlickingArrow";
import { Link } from "react-router-dom";
import uuid from "react-uuid";
import useToggleFollow from "../../hooks/useToggleFollow";
import FeedProfileImage from "./FeedProfileImage";
import FeedProfileDisplayName from "./FeedProfileDisplayName";
import FeedEditModal from "../modal/feed/FeedEditModal";
import toast from "react-hot-toast";
import FeedMoreSelectModal from "../modal/feed/FeedMoreSelectModal";
import { BiCopy } from "react-icons/bi";
import TempClothes from "../../assets/TempClothes";
import AuthFormModal from "../modal/auth/AuthFormModal";
import useMediaScreen from "../../hooks/useMediaScreen";

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

type locationProps = {
  state: {
    id: string;
    email: string;
  };
  pathname: string;
};

const DetailFeed = () => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [replyText, setReplyText] = useState("");
  const [onMouse, setOnMouse] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const [isAuthModal, setIsAuthModal] = useState(false);
  const [isFeedEdit, setIsFeedEdit] = useState(false);
  const { state, pathname } = useLocation() as locationProps;
  const { toggleLike } = useToggleLike();
  const { toggleBookmark } = useToggleBookmark();
  const { toggleFollow } = useToggleFollow();
  const { timeToString, timeToString2 } = useTimeFormat();
  const { handleResizeHeight } = useHandleResizeTextArea(textRef);
  const { ClothesCategory } = TempClothes();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isDesktop, isTablet, isMobile, isMobileBefore, RightBarNone } =
    useMediaScreen();

  const feedApi = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_PORT}/api/feed`
    );
    return data;
  };

  // 피드 리스트 가져오기
  const { data: feedData } = useQuery<FeedType[]>(["feed"], feedApi, {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
  });

  const detailInfo = useMemo(() => {
    return feedData?.filter((res) => state?.id === res.id);
  }, [feedData, state]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  // 댓글 업로드
  const { mutate } = useMutation(
    (response: ReplyPayload) =>
      axios.post(`${process.env.REACT_APP_SERVER_PORT}/api/reply`, response),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );

  // 댓글 삭제
  const { mutate: mutateReplyDelete } = useMutation(
    (response: ReplyPayload) =>
      axios.delete(
        `${process.env.REACT_APP_SERVER_PORT}/api/reply/${response.id}`,
        {
          data: response,
        }
      ),
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
          replyId: uuid(),
          email: userObj.email,
          displayName: userObj.displayName,
          text: replyText,
          replyAt: +new Date(),
        },
      ],
    });
    setReplyText("");
  };

  // 댓글 삭제
  const onReplyDelete = (res: replyType) => {
    const filter = detailInfo[0].reply.filter((asd) => asd.text !== res.text);
    mutateReplyDelete({
      id: res.parentId,
      reply: [...filter],
    });
  };

  // 피드 삭제
  const { mutate: mutateFeedDelete } = useMutation(
    () =>
      axios.delete(`${process.env.REACT_APP_SERVER_PORT}/api/feed/${state.id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
        onMoreClick();
        navigate("/");
      },
    }
  );

  // 피드 삭제
  const onFeedDelete = () => {
    // const filter = feedData?.filter((res) => state.id !== res.id);
    if (isMore) {
      const ok = window.confirm("게시물을 삭제하시겠어요?");
      if (ok) {
        mutateFeedDelete();
        toast.success("삭제가 완료 되었습니다.");
      }
    }
  };

  const {
    flickingRef,
    slideIndex,
    visible,
    visible2,
    setSlideIndex,
    onClickArrowPrev,
    onClickArrowNext,
  } = useFlickingArrow({
    dataLength: detailInfo && detailInfo[0]?.url.length,
    lastLength: 1,
  });

  const bgColor = useMemo(() => {
    if (pathname.includes("feed")) {
      return "#ff5673";
    }
    if (pathname.includes("profile")) {
      return "#6f4ccf";
    }
  }, [pathname]);

  const shadowColor = useMemo(() => {
    if (pathname.includes("feed")) {
      return "#be374e";
    }
    if (pathname.includes("profile")) {
      return "#422a83";
    }
  }, [pathname]);

  const onMoreClick = () => {
    setIsMore((prev) => !prev);
  };

  const onFeedEditClick = () => {
    setIsFeedEdit((prev) => !prev);
    setIsMore(false);
  };

  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toast.success("클립보드로 복사했습니다.");
    } catch (error) {
      alert("클립보드에 복사되지 않았습니다.");
    }
  };

  const onWearClick = (cat: string, detail: string) => {
    let number = ClothesCategory[cat].findIndex((res) => res === detail);
    // // top에만 "없음" 항목이 없어서 index가 부족하기 때문
    // if (cat === "top") {
    //   number += 1;
    // }
    navigate(`/explore/${cat}?detail=${number}`);
  };

  const onLogState = () => {
    if (!userLogin) {
      setIsAuthModal(true);
    }
  };

  const onAuthModal = () => {
    setIsAuthModal((prev) => !prev);
  };

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      {feedData && (
        <>
          {detailInfo.map((res) => {
            const reply = res.reply.sort(
              (a: { replyAt: number }, b: { replyAt: number }) =>
                b.replyAt - a.replyAt
            );
            const { outer, top, innerTop, bottom, etc } = res.wearInfo;
            const categoryTags = [
              { name: "outer", type: "outer", detail: outer },
              { name: "top", type: "top", detail: top },
              { name: "innerTop", type: "innerTop", detail: innerTop },
              { name: "bottom", type: "bottom", detail: bottom },
              { name: "etc", type: "etc", detail: etc },
            ];
            return (
              <Wrapper key={res.id} bgColor={bgColor} isMobile={isMobile}>
                {isMore && !isFeedEdit ? (
                  <FeedMoreSelectModal
                    bgColor={bgColor}
                    modalOpen={isMore}
                    modalClose={onMoreClick}
                    onFeedEditClick={onFeedEditClick}
                    onFeedDelete={onFeedDelete}
                  />
                ) : (
                  <FeedEditModal
                    modalOpen={isFeedEdit}
                    modalClose={onFeedEditClick}
                    info={res}
                  />
                )}
                <Container shadowColor={shadowColor}>
                  <Header>
                    <UserInfoBox>
                      <UserImageBox
                        to={`/profile/${res.displayName}/post`}
                        state={res.email}
                      >
                        <FeedProfileImage displayName={res.displayName} />
                      </UserImageBox>
                      <UserWriteInfo>
                        <UserNameBox
                          to={`/profile/${res.displayName}/post`}
                          state={res.email}
                        >
                          <FeedProfileDisplayName
                            displayName={res.displayName}
                          />
                        </UserNameBox>
                        <WriteDate>
                          {timeToString2(Number(res.createdAt))}
                        </WriteDate>
                      </UserWriteInfo>
                      {res.email !== userObj.email ? (
                        <FollowBtnBox
                          onClick={() => toggleFollow(res.displayName)}
                        >
                          {userObj?.following.filter((obj) =>
                            obj?.displayName?.includes(res.displayName)
                          ).length !== 0 ? (
                            <FollowingBtn>팔로잉</FollowingBtn>
                          ) : (
                            <FollowBtn>팔로우</FollowBtn>
                          )}
                        </FollowBtnBox>
                      ) : (
                        <MoreBtn type="button" onClick={onMoreClick}>
                          <FiMoreHorizontal />
                        </MoreBtn>
                      )}
                    </UserInfoBox>
                  </Header>
                  <WearDetailBox>
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
                                <CategoryTag>
                                  {res.weatherInfo.temp}º
                                </CategoryTag>
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
                                      onClick={() =>
                                        onWearClick(tag.type, tag.detail)
                                      }
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
                  </WearDetailBox>
                  {res.url.length > 1 ? (
                    <FlickingImageBox
                      onMouseOver={() => setOnMouse(true)}
                      onMouseLeave={() => setOnMouse(false)}
                    >
                      {onMouse && (
                        <>
                          <PrevArrow
                            onClick={onClickArrowPrev}
                            visible={visible}
                            bgColor={bgColor}
                          >
                            <ArrowIcon>
                              <IoIosArrowBack />
                            </ArrowIcon>
                          </PrevArrow>
                          <NextArrow
                            onClick={onClickArrowNext}
                            visible={visible2}
                            bgColor={bgColor}
                          >
                            <ArrowIcon>
                              <IoIosArrowForward />
                            </ArrowIcon>
                          </NextArrow>
                        </>
                      )}
                      <Flicking
                        align="prev"
                        panelsPerView={1}
                        ref={flickingRef}
                        bound={true}
                        moveType={"strict"}
                        onChanged={(e) => {
                          setSlideIndex(e.index);
                        }}
                      >
                        {res.url.map((res, index) => {
                          return (
                            <Card key={index}>
                              <CardImage src={res} alt="" />
                            </Card>
                          );
                        })}
                      </Flicking>
                      <PaginationButton>
                        {Array.from(
                          { length: res.url.length },
                          (value, index) => (
                            <PaginationSpan key={index} slideIndex={slideIndex}>
                              <span />
                            </PaginationSpan>
                          )
                        )}
                      </PaginationButton>
                    </FlickingImageBox>
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
                            {userObj?.like?.filter((id) => id === res.id)
                              .length > 0 ? (
                              <FaHeart style={{ color: bgColor }} />
                            ) : (
                              <FaRegHeart />
                            )}
                          </Icon>
                          <Icon onClick={() => toggleBookmark(res.id)}>
                            {userObj?.bookmark?.filter((id) => id === res.id)
                              .length > 0 ? (
                              <FaBookmark style={{ color: bgColor }} />
                            ) : (
                              <FaRegBookmark />
                            )}
                          </Icon>
                        </IconBox>
                        <Icon onClick={() => handleCopyClipBoard()}>
                          <BiCopy />
                        </Icon>
                      </UserReactBox>
                      <UserReactNum>공감 {res.like.length}개</UserReactNum>
                      <UserTextBox>
                        <UserText>{res.text}</UserText>
                      </UserTextBox>
                      {res?.tag.length > 0 && (
                        <TagList>
                          {res?.tag?.map((tag, index) => {
                            return (
                              <Tag
                                key={index}
                                color={bgColor}
                                to={`/explore/search?keyword=${tag}`}
                              >
                                <span>#</span>
                                <TagName>{tag}</TagName>
                              </Tag>
                            );
                          })}
                        </TagList>
                      )}
                    </TextBox>
                    <ReplyBox>
                      {res.reply.length > 0 && (
                        <>
                          <UserReactNum>댓글 {res.reply.length}개</UserReactNum>
                          {reply.map((reply, index) => {
                            return (
                              <DetailFeedReply
                                key={index}
                                userObj={userObj.email}
                                isLogin={userLogin}
                                reply={reply}
                                onDelete={onReplyDelete}
                              />
                            );
                          })}
                        </>
                      )}
                      <ReplyEditBox onClick={onLogState}>
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
                          <ReplyEditBtn
                            color={shadowColor}
                            onClick={() => onReply(res)}
                          >
                            게시
                          </ReplyEditBtn>
                        )}
                        <Emoji
                          setText={setReplyText}
                          textRef={textRef}
                          right={0}
                          bottom={30}
                        />
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

const Wrapper = styled.div<{ bgColor: string; isMobile: boolean }>`
  position: relative;
  overflow: hidden;
  padding: 40px;
  height: 100%;
  /* padding: 20px 60px 30px; */
  background: ${(props) => props.bgColor};
  border-top: ${(props) => !props.isMobile && `2px solid ${secondColor}`};
`;

const Container = styled.div<{ shadowColor: string }>`
  position: relative;
  border: 2px solid ${secondColor};
  border-radius: 20px;
  overflow: hidden;
  background: #fff;

  box-shadow: ${(props) => {
    let shadow = "";
    for (let i = 1; i < 63; i++) {
      shadow += `${props.shadowColor} ${i}px ${i}px,`;
    }
    shadow += `${props.shadowColor} 63px 63px`;
    return shadow;
  }};
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${thirdColor};
`;

const UserInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserImageBox = styled(Link)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${fourthColor};
  object-fit: cover;
  cursor: pointer;
  position: relative;
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

const UserNameBox = styled(Link)`
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: ${secondColor};
`;

const FollowBtnBox = styled.div`
  margin-left: auto;
`;

const MoreBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fff;
  padding: 0;
  margin-right: -6px;
  border-radius: 50%;
  transition: all 0.15s linear;
  cursor: pointer;
  &:hover,
  &:active {
    background: ${fourthColor};
  }
  svg {
    font-size: 20px;
  }
`;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 16px;
  color: #fff;
  /* border-radius: 9999px; */
  border-radius: 8px;
  border: 1px solid ${secondColor};
  background: ${secondColor};
  cursor: pointer;

  &:hover,
  &:active {
    background: #000;
  }
`;

const FollowingBtn = styled(FollowBtn)`
  border: 1px solid ${thirdColor};
  background: #fff;
  color: ${secondColor};

  &:hover,
  &:active {
    background: ${fourthColor};
  }
`;

const UserImage = styled.img`
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
`;

const Card = styled.div`
  display: block;
  position: relative;
  height: auto;
  user-select: none;
  outline: none;
  overflow: hidden;
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  width: 100%; */
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
  border-bottom: 1px solid ${thirdColor};
`;

const WearDetail = styled.div`
  padding: 14px 14px;
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
  width: 100%;
`;

const WearInfoMain = styled.div`
  flex: 0 0 auto;
  user-select: text;
  color: ${secondColor};
  /* min-width: 55px; */
  text-align: center;
  margin-right: 12px;
  /* padding-right: 8px; */
  /* border-right: 1px solid ${thirdColor}; */
  font-size: 14px;

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FlickingCategoryBox = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
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

const FlickingImageBox = styled(FlickingCategoryBox)`
  position: relative;
  &::after {
    display: none;
  }
`;

const PaginationButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  position: absolute;
  bottom: 18px;
  z-index: 10;

  /* @media screen and (min-width: 640px) {
    margin: 0 30px;
  } */
`;

const PaginationSpan = styled.span<{ slideIndex: number }>`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    border-radius: 100%;
    display: inline-block;
    font-size: 1rem;
    width: 6px;
    height: 6px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0 3px;
  }

  &:nth-of-type(${(props) => props.slideIndex + 1}) {
    span {
      background-color: #222;
      /* transform: scaleX(30px); */
      /* width: 6px; */
      /* height: 6px; */
      /* border-radius: 3px; */
    }
  }
`;

const WearInfo = styled.div`
  display: flex;
  align-items: center;
  /* width: 100%; */
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
  flex: nowrap;
  gap: 8px;
`;

const CategoryTag = styled.div`
  font-size: 12px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  border: 1px solid ${thirdColor};
  border-radius: 8px;
  /* border-radius: 20px; */

  svg {
    margin-right: 2px;
    font-size: 12px;
    color: ${thirdColor};
  }
`;

const InfoBox = styled.div`
  padding: 20px;
  border-top: 1px solid ${thirdColor};
`;

const TagList = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 10px;
`;

const Tag = styled(Link)<{ color?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  /* line-height: 16px; */
  border-radius: 64px;
  background-color: #f5f5f5;
  padding: 8px 10px;
  color: ${(props) => props.color};

  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
  span {
    margin-right: 4px;
  }
`;

const TagName = styled.div`
  font-weight: 500;
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
  /* position: relative; */
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

const ReplyEditBtn = styled.div<{ color: string }>`
  display: flex;
  flex: 1 0 auto;
  margin: 0 12px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  outline: none;
  font-weight: 500;
  color: ${(props) => props.color};
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
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  transition: all 0.1s;

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ArrowIcon = styled.span`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NextArrow = styled(Arrow)<{ visible: boolean; bgColor: string }>`
  right: 20px;
  color: ${(props) => (!props.visible ? thirdColor : props.bgColor)};
  border-color: ${(props) => (!props.visible ? thirdColor : props.bgColor)};
  cursor: ${(props) => !props.visible && "default"};
  span {
    svg {
      padding-left: 2px;
    }
  }
`;

const PrevArrow = styled(Arrow)<{ visible: boolean; bgColor: string }>`
  left: 20px;
  color: ${(props) => (!props.visible ? thirdColor : props.bgColor)};
  border-color: ${(props) => (!props.visible ? thirdColor : props.bgColor)};
  cursor: ${(props) => !props.visible && "default"};
  span {
    svg {
      padding-right: 2px;
    }
  }
`;
