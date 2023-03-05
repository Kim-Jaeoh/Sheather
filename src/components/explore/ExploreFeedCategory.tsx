import styled from "@emotion/styled";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import ColorList from "../../assets/ColorList";
import { FeedType } from "../../types/type";
import defaultAccount from "../../assets/account_img_default.png";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useToggleBookmark from "../../hooks/useToggleBookmark";
import useToggleLike from "../../hooks/useToggleLike";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import HomeSkeleton from "../../assets/skeleton/HomeSkeleton";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { UserType } from "../../app/user";
import { dbService } from "../../fbase";
import FeedProfileImage from "../feed/FeedProfileImage";
import FeedProfileDisplayName from "../feed/FeedProfileDisplayName";

type Props = {
  feed?: FeedType[];
  url?: string;
};

const ExploreFeedCategory = ({ url, feed }: Props) => {
  const { toggleLike } = useToggleLike(); // 좋아요 커스텀 훅
  const { toggleBookmark } = useToggleBookmark(); // 좋아요 커스텀 훅
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const { ref, isLoading, dataList } = useInfinityScroll({ url, count: 6 });

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
      return (checkAspect = 74.6);
    }
    if (aspect === "1/1") {
      return (checkAspect = 100);
    }
    if (aspect === "3/4") {
      return (checkAspect = 132.6);
    }
  };

  return (
    <>
      {!isLoading ? (
        <>
          {dataList?.pages?.flat().length !== 0 ? (
            <CardBox>
              {dataList?.pages?.flat().map((res: FeedType, index: number) => {
                sizes(res.imgAspect);
                sizeAspect(res.imgAspect);

                return (
                  <CardList size={checkSize} key={res.id}>
                    <Card
                      aspect={checkAspect}
                      to={"/feed/detail"}
                      state={{ id: res.id, email: res.email }}
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
                    {/* <UserBox>
                      <UserInfoBox>
                        <UserImageBox
                          to={`/profile/${res.displayName}/post`}
                          state={res.email}
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <FeedProfileImage displayName={res.displayName} />
                        </UserImageBox>
                        <UserNameBox
                          to={`/profile/${res.displayName}/post`}
                          state={res.email}
                        >
                          <FeedProfileDisplayName
                            displayName={res.displayName}
                          />
                        </UserNameBox>
                        <UserReactBox>
                          <UserIconBox>
                            <UserIcon onClick={() => toggleLike(res)}>
                              {userObj?.like?.filter((id) => id === res.id)
                                .length > 0 ? (
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
                    </UserBox> */}
                  </CardList>
                );
              })}
              <div
                ref={ref}
                // style={{
                //   position: "absolute",
                //   bottom: "100px",
                // }}
              />
            </CardBox>
          ) : (
            <NotInfoBox>
              <NotInfo>해당 의류에 관한 글이 존재하지 않습니다.</NotInfo>
            </NotInfoBox>
          )}
        </>
      ) : (
        <HomeSkeleton />
      )}
    </>
  );
};

{
}
export default ExploreFeedCategory;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const CardBox = styled.ul`
  width: 100%;
  padding: 0 16px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: auto;
`;

const CardList = styled.li<{ size?: number }>`
  display: flex;
  flex-direction: column;
  margin: 4px;
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
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  /* border-bottom: 2px solid ${secondColor}; */
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
  left: 0%;
  /* transform: translate(-50%, -50%); */
  width: 100%;
  height: 100%;
  font-size: 0;
  line-height: 0; ;
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

const UserImageBox = styled(Link)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${fourthColor};
  object-fit: cover;
  cursor: pointer;
  position: relative;
`;

const UserImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  image-rendering: auto;
`;

const UserNameBox = styled(Link)`
  cursor: pointer;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  flex: 1;
  padding: 8px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.15px;

  color: ${secondColor};
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
  margin: 0 auto;
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
`;

const NotInfo = styled.div``;
