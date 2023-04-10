import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FeedType } from "../../types/type";
import ProfileSkeleton from "../../assets/skeleton/ProfileSkeleton";
import ColorList from "../../assets/data/ColorList";
import useMediaScreen from "../../hooks/useMediaScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

type props = {
  myPost: FeedType[];
  loading: boolean;
  notInfoText: string;
  onIsLogin: (callback: () => void) => void;
  // ref: (node?: Element) => void;
};

const ProfilePost = React.forwardRef<HTMLInputElement, props>(
  ({ myPost, loading, notInfoText, onIsLogin }, ref) => {
    const { loginToken: userLogin } = useSelector((state: RootState) => {
      return state.user;
    });
    const [arrState, setArrState] = useState(myPost?.length);
    const { isMobile } = useMediaScreen();

    // 개수 홀수 시 flex 레이아웃 유지하기 (배열 개수 추가)
    useEffect(() => {
      // 3의 배수가 아니고, 3개 중 2개 모자랄 때
      if (myPost?.length % 3 === 1) {
        setArrState(myPost?.length + 2);
      }

      // 3의 배수가 아니고, 3개 중 1개 모자랄 때
      if (myPost?.length % 3 === 2) {
        setArrState(myPost?.length + 1);
      }
    }, [myPost?.length]);

    return (
      <>
        {!loading ? (
          <>
            {myPost?.length !== 0 ? (
              <>
                <CardBox>
                  {Array.from({ length: arrState })?.map((res, index) => (
                    <Card key={index} exist={Boolean(myPost[index])}>
                      {myPost[index] ? (
                        <Link
                          onClick={() => onIsLogin(() => null)}
                          onContextMenu={(e) => e.preventDefault()}
                          to={userLogin && `/feed/detail/${myPost[index].id}`}
                        >
                          <WeatherEmojiBox>
                            <WeatherEmoji>
                              {isMobile
                                ? myPost[index].feel.split(" ")[0]
                                : myPost[index].feel}
                            </WeatherEmoji>
                          </WeatherEmojiBox>
                          {myPost[index].url.length > 1 && (
                            <CardLengthBox>
                              <CardLength>
                                +{myPost[index].url.length}
                              </CardLength>
                            </CardLengthBox>
                          )}
                          <CardImage
                            src={myPost[index].url[0]}
                            alt="upload Image"
                          />
                        </Link>
                      ) : (
                        <NulLCard />
                      )}
                    </Card>
                  ))}
                </CardBox>
                <div ref={ref} />
              </>
            ) : (
              <NotInfoBox>
                <NotInfo>{notInfoText}</NotInfo>
              </NotInfoBox>
            )}
          </>
        ) : (
          <CardBox>
            <ProfileSkeleton />
          </CardBox>
        )}
      </>
    );
  }
);

export default ProfilePost;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const CardBox = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;

  @media (max-width: 767px) {
    gap: 10px;
  }

  @media (max-width: 600px) {
    gap: 4px;
  }
`;

const Card = styled.li<{ exist?: boolean }>`
  cursor: pointer;
  border-radius: 20px;
  display: block;
  flex: 1 0 30%;
  position: relative;
  overflow: hidden;
  border: ${(props) => (props?.exist ? `2px solid ${secondColor}` : `none`)};
  -webkit-user-drag: none;

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

  a {
    position: relative;
    display: block;
    padding-bottom: 100%;
  }

  @media (max-width: 767px) {
    border: none;
    border-radius: 0;
    animation: none;
  }
`;

const NulLCard = styled.div``;

const WeatherEmojiBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
  background-color: rgba(34, 34, 34, 0.4);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  -webkit-user-drag: none;
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
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
`;

const NotInfoBox = styled.div`
  flex: 1;
  width: 100%;
  /* height: 200px; */
  /* margin: 0 auto; */
  display: flex;
  align-items: center;
  justify-content: center;

  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
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

const NotInfo = styled.p`
  text-align: center;
  white-space: pre-line;
  line-height: 22px;
`;
