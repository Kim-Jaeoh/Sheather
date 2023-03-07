import styled from "@emotion/styled";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FeedType } from "../../types/type";
import { FrameGrid } from "@egjs/react-grid";
import { Spinner } from "../../assets/Spinner";

type props = {
  myPost: FeedType[];
  email: string;
  cat: string;
  postLength: number;
};

const ProfilePost = React.forwardRef<HTMLDivElement, props>(
  ({ myPost, email, cat, postLength }, ref) => {
    const [notInfoText, setNotInfoText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (postLength !== 0) {
        setNotInfoText("게시물을 공유하면 회원님의 프로필에 표시됩니다.");
      }
      if (cat.includes("like")) {
        setNotInfoText("사람들의 게시물에 좋아요를 누르면 여기에 표시됩니다.");
      }
      if (cat.includes("bookmark")) {
        setNotInfoText("사람들의 게시물에 북마크를 누르면 여기에 표시됩니다.");
      }
    }, [cat, postLength]);

    return (
      <>
        {myPost?.length !== 0 ? (
          myPost?.map((res, index) => {
            return (
              <Card key={res?.id}>
                <Link
                  to={"/profile/detail"}
                  state={{ id: res.id, email: email }}
                >
                  <WeatherEmojiBox>
                    <WeatherEmoji>{res.feel.split(" ")[0]}</WeatherEmoji>
                  </WeatherEmojiBox>
                  {res.url.length > 1 && (
                    <CardLengthBox>
                      <CardLength>+{res.url.length}</CardLength>
                    </CardLengthBox>
                  )}
                  <CardImage src={res.url[0]} alt="upload Image" />
                </Link>
                <div
                  ref={ref}
                  // style={{
                  //   position: "absolute",
                  //   bottom: "-100px",
                  // }}
                />
              </Card>
            );
          })
        ) : (
          <NotInfoBox>
            <NotInfo>{notInfoText}</NotInfo>
          </NotInfoBox>
        )}
      </>
    );
  }
);

export default ProfilePost;

const Card = styled.li`
  cursor: pointer;
  border-radius: 8px;
  display: block;
  width: 184px;
  height: 184px;
  max-height: 100%;
  position: relative;
  /* position: absolute; */
  border: 1px solid #eee;
  overflow: hidden;
  border: 2px solid #222;
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
  justify-content: center;
  padding: 4px;
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
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NotInfoBox = styled.div`
  width: 100%;
  height: 200px;
  /* margin: 0 auto; */
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
