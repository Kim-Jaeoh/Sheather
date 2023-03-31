import styled from "@emotion/styled";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ColorList from "../../../assets/ColorList";
import { FeedType } from "../../../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import useToggleBookmark from "../../../hooks/useToggleBookmark";
import useToggleLike from "../../../hooks/useToggleLike";
import useInfinityScroll from "../../../hooks/useInfinityScroll";
import { useEffect, useRef, useState } from "react";
import { FrameGrid } from "@egjs/react-grid";
import ExploreSkeleton from "../../../assets/skeleton/ExploreSkeleton";
import { cloneDeep } from "lodash";
import useMediaScreen from "../../../hooks/useMediaScreen";

type Props = {
  state?: string;
};

const SearchResult = () => {
  const [isGridRender, setIsGridRender] = useState(false);
  const [randomFeed, setRandomFeed] = useState(null);
  const [searchParams] = useSearchParams();
  const { ref, isLoading, dataList } = useInfinityScroll({
    url: `${
      process.env.REACT_APP_SERVER_PORT
    }/api/search?keyword=${searchParams.get("keyword")}&`,
    count: 10,
  });
  const { isMobile } = useMediaScreen();

  //  랜덤화
  useEffect(() => {
    // 객체 깊은 복사
    let arr = cloneDeep(dataList?.pages?.flat()); // 렌더링이 2번 돼서 cloneDeep으로 해결

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
    const sort = arr?.sort((a, b) => a.createdAt - b.createdAt);
    setRandomFeed(sort);
  }, [dataList?.pages]);

  return (
    <>
      {!isLoading ? (
        <>
          <CardBox>
            <TagCategory>
              <TagCategoryText># {searchParams.get("keyword")}</TagCategoryText>
            </TagCategory>
            {randomFeed?.length !== 0 ? (
              <>
                <FrameGrid
                  className="container"
                  gap={isMobile ? 10 : 20}
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
                      <CardList render={isGridRender} key={res.id}>
                        <Card
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
              </>
            ) : (
              <NotInfoBox>
                <NotInfo>해당 태그에 관한 글이 존재하지 않습니다.</NotInfo>
              </NotInfoBox>
            )}
          </CardBox>
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
export default SearchResult;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const TagCategory = styled.div`
  margin-top: 10px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;

  @media (max-width: 767px) {
    padding: 0;
    margin: 10px 0 30px;
  }
`;

const TagCategoryText = styled.h2`
  font-size: 22px;
  text-align: center;
  font-weight: 700;
  color: ${secondColor};
  padding: 8px 14px;
  border: 2px solid ${secondColor};
  border-radius: 9999px;
  box-shadow: 0px 4px 0 -2px #222, 0px 4px ${secondColor};
  background: #fff;

  @media (max-width: 767px) {
    border-width: 1px;
    font-size: 18px;
  }
`;

const CardBox = styled.ul`
  width: 100%;
  height: 100%;
  padding: 20px 40px 40px;
  border-top: 2px solid ${secondColor};
  background: #30c56e;
  /* padding: 0 16px 16px; */
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr 1fr; */
  /* grid-auto-rows: auto; */
  @media (max-width: 767px) {
    border: none;
    padding: 16px;
  }
`;

const CardList = styled.li<{ render?: boolean; size?: number }>`
  display: flex;
  flex-direction: column;
  /* margin: 4px; */
  border-radius: 20px;
  border: ${(props) => props.render && `2px solid ${secondColor}`};
  overflow: hidden;
  /* position: absolute; */
  /* grid-row-end: span ${(props) => (props.size ? props.size : 43)}; */
  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  /* box-shadow: 4px 4px 0px rgba(15, 87, 45, 0.3); */

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

  @media (max-width: 767px) {
    animation: none;
    border-width: 1px;
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
