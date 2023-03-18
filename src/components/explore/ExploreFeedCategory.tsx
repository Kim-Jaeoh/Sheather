import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
import ColorList from "../../assets/ColorList";
import { FeedType } from "../../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useToggleBookmark from "../../hooks/useToggleBookmark";
import useToggleLike from "../../hooks/useToggleLike";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import { useEffect, useRef, useState } from "react";
import { FrameGrid } from "@egjs/react-grid";
import ExploreSkeleton from "../../assets/skeleton/ExploreSkeleton";
import { cloneDeep } from "lodash";
import AuthFormModal from "../modal/auth/AuthFormModal";

type Props = {
  feed?: FeedType[];
  url?: string;
};

const ExploreFeedCategory = ({ url, feed }: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [isGridRender, setIsGridRender] = useState(false);
  const [isAuthModal, setIsAuthModal] = useState(false);
  const [randomFeed, setRandomFeed] = useState(null);
  const { ref, isLoading, dataList } = useInfinityScroll({ url, count: 10 });

  //  랜덤화
  useEffect(() => {
    // 객체 깊은 복사
    let arr = cloneDeep(dataList?.pages.flat()); // 렌더링이 2번 돼서 cloneDeep으로 해결

    // const randomArray = (array: FeedType[]) => {
    //   // (피셔-예이츠)
    //   for (let index = array?.length - 1; index > 0; index--) {
    //     // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
    //     const randomPosition = Math.floor(Math.random() * (index + 1));

    //     // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
    //     const temporary = array[index];
    //     array[index] = array[randomPosition];
    //     array[randomPosition] = temporary;
    //   }
    // };

    // randomArray(arr);
    setRandomFeed(arr);
  }, [dataList]);

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
      {!isLoading ? (
        <>
          {randomFeed?.length !== 0 ? (
            <CardBox>
              <FrameGrid
                className="container"
                gap={16}
                defaultDirection={"end"}
                frame={[
                  [1, 1, 2, 2, 3, 3],
                  [1, 1, 2, 2, 3, 3],
                  [4, 4, 5, 5, 3, 3],
                  [4, 4, 5, 5, 3, 3],
                  [6, 6, 7, 7, 8, 8],
                  [6, 6, 7, 7, 8, 8],
                  [6, 6, 9, 9, 10, 10],
                  [6, 6, 9, 9, 10, 10],
                ]}
                onRenderComplete={() => setIsGridRender(true)}
              >
                {randomFeed?.map((res: FeedType, index: number) => {
                  // sizes(res.imgAspect);
                  return (
                    <CardList
                      render={isGridRender}
                      onClick={onLogState}
                      // size={checkSize}
                      key={res.id}
                    >
                      <Card
                        // aspect={checkAspect}
                        to={userLogin && "/feed/detail"}
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
                    </CardList>
                  );
                })}
              </FrameGrid>
              <div
                ref={ref}
                // style={{
                //   position: "absolute",
                //   bottom: "-100px",
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
        <CardBox>
          <ExploreSkeleton />
        </CardBox>
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
  padding: 10px 40px 40px;
  /* padding: 0 16px 16px; */
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr 1fr; */
  /* grid-auto-rows: auto; */
`;

const CardList = styled.li<{ render?: boolean; size?: number }>`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: ${(props) => props.render && `2px solid ${secondColor}`};
  overflow: hidden;
  /* box-shadow: 0px 6px 0 -2px #30c56e, 0px 6px ${secondColor}; */

  /* box-shadow: 1px 1px ${secondColor}, 2px 2px ${secondColor}, */
  /* 3px 3px ${secondColor}, 4px 4px ${secondColor}; */

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
  /* padding-top: ${(props) => `${props.aspect}%`}; */
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
  object-fit: cover;
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
`;

const NotInfoBox = styled.div`
  width: 100%;
  flex: 1;
  /* height: 200px; */
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
