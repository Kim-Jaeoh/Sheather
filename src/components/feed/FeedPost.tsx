import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import ColorList from "../../assets/data/ColorList";
import { FeedType } from "../../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import HomeSkeleton from "../../assets/skeleton/HomeSkeleton";
import { useState } from "react";
import useMediaScreen from "../../hooks/useMediaScreen";
import FeedProfileInfo from "./FeedProfileInfo";
import Masonry from "@mui/lab/Masonry";

type Props = {
  url?: string;
  onIsLogin?: (callback: () => void) => void;
};

const FeedPost = ({ url, onIsLogin }: Props) => {
  const { loginToken: userLogin } = useSelector((state: RootState) => {
    return state.user;
  });

  const { ref, isLoading, dataList } = useInfinityScroll({ url, count: 6 });
  const { isMobile } = useMediaScreen();

  let checkAspect: number;
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
      {!isLoading ? (
        <>
          {dataList?.pages?.flat()?.length !== 0 ? (
            <CardBox>
              <Masonry
                sx={{ overflow: "hidden", position: "relative" }}
                columns={2}
                spacing={!isMobile ? 3.7 : 1.5}
              >
                {dataList?.pages?.flat().map((res: FeedType, index: number) => {
                  sizeAspect(res.imgAspect);

                  return (
                    <CardList
                      key={res.id}
                      onClick={() => onIsLogin(() => null)}
                    >
                      <Card
                        aspect={checkAspect}
                        to={userLogin && `/feed/detail/${res.id}`}
                      >
                        <WeatherEmojiBox>
                          <WeatherEmoji>
                            {isMobile ? res.feel.split(" ")[0] : res.feel}
                          </WeatherEmoji>
                        </WeatherEmojiBox>
                        {res.url.length > 1 && (
                          <CardLengthBox>
                            <CardLength>+{res.url.length}</CardLength>
                          </CardLengthBox>
                        )}
                        <CardImageBox>
                          <CardImage
                            onContextMenu={(e) => e.preventDefault()}
                            src={res.url[0]}
                            alt=""
                          />
                        </CardImageBox>
                      </Card>
                      <UserBox>
                        <FeedProfileInfo feed={res} />
                        <UserText>{res.text}</UserText>
                        {res?.tag?.length !== 0 && (
                          <TagList>
                            {res?.tag?.map((tag, index) => {
                              return (
                                <Tag
                                  key={index}
                                  to={`/explore/search?keyword=${tag}`}
                                >
                                  <span>#</span>
                                  <TagName>{tag}</TagName>
                                </Tag>
                              );
                            })}
                          </TagList>
                        )}
                      </UserBox>
                    </CardList>
                  );
                })}
              </Masonry>
              <div ref={ref} style={{ position: `absolute`, bottom: 0 }} />
            </CardBox>
          ) : (
            <NotInfoBox>
              <NotInfo>해당 날짜의 글이 존재하지 않습니다.</NotInfo>
            </NotInfoBox>
          )}
        </>
      ) : (
        <CardBox>
          <HomeSkeleton />
        </CardBox>
      )}
    </>
  );
};

{
}
export default FeedPost;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const CardBox = styled.div`
  width: 100%;
  padding: 10px 24px 40px;
  display: flex;
  justify-content: center;
  position: relative;

  @media (max-width: 767px) {
    padding: 0 10px;
  }
`;

const CardList = styled.div`
  /* width: 330px; */
  border-radius: 10px;
  border: 2px solid ${secondColor};
  overflow: hidden;
  margin-bottom: 30px;
  background: #fff;

  > a {
    border-bottom: 1px solid ${secondColor};
  }

  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    65% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: 767px) {
    /* width: 174px; */
    border: none;
    background: transparent;
    animation: none;
    margin-bottom: 12px;

    > a {
      border-radius: 10px;
      border: 1px solid ${fourthColor};
      overflow: hidden;
    }
  }
`;

const Card = styled(Link)<{ aspect?: number }>`
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
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
  top: 0%;
  right: 0;
  left: 0%;
  bottom: 0;
  width: 100%;
`;

const CardImage = styled.img`
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
`;

const UserBox = styled.div`
  padding: 12px;
  flex: 1;

  @media (max-width: 767px) {
    padding: 12px 0;
  }
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
`;

const TagList = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
  gap: 10px;
`;

const Tag = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 64px;
  background-color: #f5f5f5;
  padding: 8px 10px;
  color: #ff5673;

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

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

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

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const NotInfo = styled.span`
  color: ${secondColor};
`;
