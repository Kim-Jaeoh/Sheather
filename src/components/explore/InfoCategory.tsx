import { FrameGrid } from "@egjs/react-grid";
import styled from "@emotion/styled";
import { cloneDeep } from "lodash";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ColorList from "../../assets/data/ColorList";
import ExploreSkeleton from "../../assets/skeleton/ExploreSkeleton";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import useMediaScreen from "../../hooks/useMediaScreen";
import { FeedType } from "../../types/type";
import useUserAccount from "../../hooks/useUserAccount";
import AuthFormModal from "../modal/auth/AuthFormModal";
import TopButton from "../scrollButton/TopButton";
import { ImageList } from "@mui/material";

const InfoCategory = () => {
  const [url, setUrl] = useState("");
  const [randomFeed, setRandomFeed] = useState(null);
  const [dateCategory, setDateCategory] = useState("recent");
  const { search } = useLocation();
  const [searchParams] = useSearchParams();
  const { isMobile } = useMediaScreen();
  const navigate = useNavigate();
  const { isAuthModal, setIsAuthModal, onAuthModal, onIsLogin, onLogOutClick } =
    useUserAccount();
  const { ref, isLoading, dataList } = useInfinityScroll({
    url: url,
    count: 10,
  });

  useEffect(() => {
    if (search.includes("cat")) {
      setUrl(
        `${process.env.REACT_APP_SERVER_PORT}/api/${searchParams.get(
          "q"
        )}?cat=${searchParams.get("cat")}&detail=${encodeURIComponent(
          searchParams.get(`detail`)
        )}&`
      );
    } else {
      setUrl(
        `${
          process.env.REACT_APP_SERVER_PORT
        }/api/search?keyword=${encodeURIComponent(
          searchParams.get("keyword")
        )}&`
      );
    }
  }, [search, searchParams]);

  //  랜덤화
  useEffect(() => {
    // 객체 깊은 복사
    let arr = dataList?.pages?.flat(); // 렌더링이 2번 돼서 cloneDeep으로 해결
    // let arr = cloneDeep(dataList?.pages?.flat()); // 렌더링이 2번 돼서 cloneDeep으로 해결

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

    if (dateCategory === "recent") {
      const sort = arr?.sort((a, b) => b.createdAt - a.createdAt);
      return setRandomFeed(sort);
    } else {
      const sort = arr?.sort((a, b) => b.like.length - a.like.length);
      return setRandomFeed(sort);
    }
  }, [dataList?.pages, dateCategory]);

  const categoryText = useMemo(() => {
    const params = (type: string) => searchParams.get(type);

    if (params("cat") === "temp") {
      return `${searchParams.get("detail")}º`;
    }
    if (params("cat") === "wind") {
      return (
        <>
          {params("detail")}
          <span>m/s</span>
        </>
      );
    }
    if (params("cat")) {
      return params("detail");
    } else {
      return `# ${params("keyword")}`;
    }
  }, [searchParams]);

  const sortClick = (type: string) => {
    setDateCategory(type);
    if (search.includes("cat")) {
      return navigate(
        `/explore?cat=${searchParams.get("cat")}&detail=${searchParams.get(
          "detail"
        )}&sort=${type}`
      );
    } else {
      return navigate(
        `/explore/search?keyword=${searchParams.get("keyword")}&sort=${type}`
      );
    }
  };

  const onClick = (res: FeedType) => {
    onIsLogin(() => navigate(`/feed/detail/${res.id}`));
  };

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      <Container>
        {!isLoading ? (
          <Box>
            <TopButton bgColor={`#30c56e`} />
            <TagCategory>
              <TagCategoryText>{categoryText}</TagCategoryText>
            </TagCategory>
            <SelectDetailTimeBox>
              <SelectCategoryBox>
                <SelectCategoryBtn
                  select={dateCategory}
                  category={"recent"}
                  type="button"
                  onClick={() => sortClick("recent")}
                >
                  최신순
                </SelectCategoryBtn>
                <SelectCategoryBtn
                  select={dateCategory}
                  category={"popular"}
                  type="button"
                  onClick={() => sortClick("popular")}
                >
                  인기순
                </SelectCategoryBtn>
              </SelectCategoryBox>
            </SelectDetailTimeBox>
            {randomFeed?.length !== 0 ? (
              <ImageList
                sx={{ overflow: "hidden" }}
                cols={3}
                gap={!isMobile ? 20 : 10}
              >
                {randomFeed?.map((res: FeedType, index: number) => {
                  return (
                    <CardList key={index} onClick={() => onClick(res)}>
                      <Card>
                        <WeatherEmojiBox>
                          <WeatherEmoji>
                            {isMobile ? res?.feel?.split(" ")[0] : res?.feel}
                          </WeatherEmoji>
                        </WeatherEmojiBox>
                        {res?.url?.length > 1 && (
                          <CardLengthBox>
                            <CardLength>+{res?.url?.length}</CardLength>
                          </CardLengthBox>
                        )}
                        <CardImageBox>
                          <CardImage
                            onContextMenu={(e) => e.preventDefault()}
                            src={res?.url[0]}
                            alt=""
                          />
                        </CardImageBox>
                      </Card>
                    </CardList>
                  );
                })}
                <div ref={ref} />
              </ImageList>
            ) : (
              <NotInfoBox>
                <NotInfo>해당 태그에 관한 글이 존재하지 않습니다.</NotInfo>
              </NotInfoBox>
            )}
          </Box>
        ) : (
          <CardBox>
            <ExploreSkeleton />
          </CardBox>
        )}
      </Container>
    </>
  );
};

{
}
export default InfoCategory;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #30c56e;

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const Box = styled.div`
  height: 100%;
  padding: 20px 40px 40px;
  border-top: 2px solid ${secondColor};
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    background: #fff;
    padding: 16px;
    border: 1px solid #222;
    border-radius: 20px;

    /* box-shadow: ${(props) => {
      let shadow = "";
      for (let i = 1; i < 63; i++) {
        shadow += `#209b53 ${i}px ${i}px,`;
      }
      shadow += `#209b53 63px 63px`;
      return shadow;
    }}; */
  }
`;

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
  font-size: 18px;
  text-align: center;
  font-weight: 700;
  color: ${secondColor};
  padding: 8px 14px;
  border: 2px solid ${secondColor};
  border-radius: 9999px;
  box-shadow: 0px 4px ${secondColor};
  background: #fff;

  span {
    font-size: 14px;
  }

  @media (max-width: 767px) {
    border-width: 1px;
    font-size: 18px;
  }
`;

const SelectDetailTimeBox = styled.div`
  width: 100%;
  margin: 0 0 20px;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: end;
  border-top: 1px solid ${secondColor};

  @media (max-width: 767px) {
    margin: 0;
    padding: 0;
    border: none;
    /* padding: 0px 16px; */
    padding: 0;
    > div {
      border-top: 1px solid ${fourthColor};
      padding: 16px 0;
      width: 100%;
    }
  }
`;

const SelectCategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  /* gap: 12px; */
`;

const SelectCategoryBtn = styled.button<{ select: string; category: string }>`
  padding: 0;
  margin-left: 12px;
  transition: all 0.15s linear;
  font-size: 14px;
  font-weight: ${(props) =>
    props.select === props.category ? "bold" : "normal"};
  cursor: pointer;
  color: ${secondColor};
  white-space: pre;
  @media (max-width: 767px) {
    font-size: 12px;
    /* border-color: ${fourthColor}; */
  }
`;

const CardBox = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 767px) {
    border: none;
  }
`;

const CardList = styled.div`
  border-radius: 10px;
  border: 2px solid ${secondColor};
  overflow: hidden;

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

  @media (max-width: 767px) {
    animation: none;
    border: 1px solid #ebebeb;
  }
`;

const Card = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  padding-bottom: 100%;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
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
  right: 0;
  bottom: 0;
  /* transform: translate(-50%, -50%); */
  width: 100%;
  height: 100%;
  font-size: 0;
  line-height: 0;
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
