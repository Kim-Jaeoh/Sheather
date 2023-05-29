import Flicking from "@egjs/react-flicking";
import "../../../styles/DetailFlicking.css";
import styled from "@emotion/styled";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FeedType } from "../../../types/type";
import { useState } from "react";
import useFlickingArrow from "../../../hooks/useFlickingArrow";
import useMediaScreen from "../../../hooks/useMediaScreen";

type Props = {
  feed: FeedType;
};

const DetailFeedImage = ({ feed }: Props) => {
  const [onMouse, setOnMouse] = useState(false);
  const { isMobile } = useMediaScreen();

  // 이미지 여러장 캐러셀
  const {
    flickingRef,
    slideIndex,
    visible,
    visible2,
    setSlideIndex,
    onClickArrowPrev,
    onClickArrowNext,
  } = useFlickingArrow({
    dataLength: feed && feed.url.length,
    lastLength: 1,
  });

  return (
    <>
      {feed.url.length > 1 ? (
        <FlickingImageBox
          onMouseOver={() => setOnMouse(true)}
          onMouseLeave={() => setOnMouse(false)}
        >
          {!isMobile && onMouse && (
            <>
              <PrevArrow onClick={onClickArrowPrev} visible={visible}>
                <ArrowIcon>
                  <IoIosArrowBack />
                </ArrowIcon>
              </PrevArrow>
              <NextArrow onClick={onClickArrowNext} visible={visible2}>
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
            {feed.url.map((res, index) => {
              return (
                <Card key={index}>
                  <CardImage src={res} alt="" />
                </Card>
              );
            })}
          </Flicking>
          <PaginationButton>
            {Array.from({ length: feed.url.length }, (value, index) => (
              <PaginationSpan key={index} slideIndex={slideIndex}>
                <span />
              </PaginationSpan>
            ))}
          </PaginationButton>
        </FlickingImageBox>
      ) : (
        <Card onContextMenu={(e) => e.preventDefault()}>
          <CardImage src={feed.url[0]} alt="" />
        </Card>
      )}
    </>
  );
};

export default DetailFeedImage;

const FlickingCategoryBox = styled.div`
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

const Card = styled.div`
  display: block;
  position: relative;
  height: auto;
  user-select: none;
  outline: none;
  overflow: hidden;
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: auto;
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
    }
  }
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

const NextArrow = styled(Arrow)<{ visible: boolean }>`
  right: 20px;
  color: ${(props) => (!props.visible ? `var(--third-color)` : `#ff5673`)};
  border-color: ${(props) =>
    !props.visible ? `var(--third-color)` : `#ff5673`};
  cursor: ${(props) => !props.visible && "default"};
  span {
    svg {
      padding-left: 2px;
    }
  }
`;

const PrevArrow = styled(Arrow)<{ visible: boolean }>`
  left: 20px;
  color: ${(props) => (!props.visible ? `var(--third-color)` : "#ff5673")};
  border-color: ${(props) =>
    !props.visible ? `var(--third-color)` : "#ff5673"};
  cursor: ${(props) => !props.visible && "default"};
  span {
    svg {
      padding-right: 2px;
    }
  }
`;
