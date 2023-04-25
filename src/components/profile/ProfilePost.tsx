import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { FeedType } from "../../types/type";
import ProfileSkeleton from "../../assets/skeleton/ProfileSkeleton";
import ColorList from "../../assets/data/ColorList";
import useMediaScreen from "../../hooks/useMediaScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { BsQuestionLg } from "react-icons/bs";
import { ImageList, ImageListItem } from "@mui/material";

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
    const { isMobile } = useMediaScreen();
    // const [arrState, setArrState] = useState(myPost?.length);

    // // 개수 홀수 시 flex 레이아웃 유지하기 (배열 개수 추가)
    // useEffect(() => {
    //   // 3의 배수가 아니고, 3개 중 2개 모자랄 때
    //   if (myPost?.length % 3 === 1) {
    //     setArrState(myPost?.length + 2);
    //   }

    //   // 3의 배수가 아니고, 3개 중 1개 모자랄 때
    //   if (myPost?.length % 3 === 2) {
    //     setArrState(myPost?.length + 1);
    //   }
    // }, [myPost?.length]);

    return (
      <>
        {!loading ? (
          <>
            {myPost?.length !== 0 ? (
              <>
                <ImageList
                  sx={{ padding: `${isMobile && "10px"}`, overflow: "hidden" }}
                  cols={3}
                  gap={!isMobile ? 20 : 10}
                >
                  {myPost?.map((res, index) => (
                    <Card key={index}>
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
                            <CardLength>+{myPost[index].url.length}</CardLength>
                          </CardLengthBox>
                        )}
                        <CardImage
                          src={myPost[index].url[0]}
                          alt="upload Image"
                        />
                      </Link>
                    </Card>
                  ))}
                  <div ref={ref} />
                </ImageList>
              </>
            ) : (
              <NotInfoBox>
                <IconBox>
                  <Icon>
                    <BsQuestionLg />
                  </Icon>
                </IconBox>
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

const CardBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;

  @media (max-width: 767px) {
    gap: 10px;
    padding: 10px;
  }

  @media (max-width: 600px) {
    padding: 4px;
    gap: 4px;
  }
`;

const Card = styled.div`
  cursor: pointer;
  border-radius: 10px;
  display: block;
  /* flex: 1 0 30%; */
  position: relative;
  overflow: hidden;
  border: 2px solid ${secondColor};
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
    border: 1px solid #ebebeb;
    animation: none;
  }
`;

const NulLCard = styled.div``;

const WeatherEmojiBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
  background-color: rgba(34, 34, 34, 0.2);
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

  @media (max-width: 767px) {
    font-size: 10px;
  }
`;

const CardLengthBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  background-color: rgba(34, 34, 34, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const CardLength = styled.span`
  display: inline-block;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;

  @media (max-width: 767px) {
    font-size: 10px;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 14px;
  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  padding-bottom: 40px;

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
  }
`;

const IconBox = styled.div`
  border: 2px solid ${secondColor};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    /* width: 100%; */
    /* height: 100%; */
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6f4ccf;

    path:not(:first-of-type) {
    }
  }
`;

const NotInfo = styled.p`
  text-align: center;
  white-space: pre-line;
  line-height: 22px;
`;
