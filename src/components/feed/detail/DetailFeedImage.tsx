import Flicking from "@egjs/react-flicking";
import "../../../styles/DetailFlicking.css";
import styled from "@emotion/styled";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import ColorList from "../../../assets/data/ColorList";
import { FeedType } from "../../../types/type";
import { useState } from "react";
import useFlickingArrow from "../../../hooks/useFlickingArrow";

type Props = {
  res: FeedType;
};

const DetailFeedImage = ({ res }: Props) => {
  const [onMouse, setOnMouse] = useState(false);

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
    dataLength: res && res.url.length,
    lastLength: 1,
  });

  return (
    <>
      {res.url.length > 1 ? (
        <FlickingImageBox
          onMouseOver={() => setOnMouse(true)}
          onMouseLeave={() => setOnMouse(false)}
        >
          {onMouse && (
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
            {res.url.map((res, index) => {
              return (
                <Card key={index}>
                  <CardImage src={res} alt="" />
                </Card>
              );
            })}
          </Flicking>
          <PaginationButton>
            {Array.from({ length: res.url.length }, (value, index) => (
              <PaginationSpan key={index} slideIndex={slideIndex}>
                <span />
              </PaginationSpan>
            ))}
          </PaginationButton>
        </FlickingImageBox>
      ) : (
        <Card onContextMenu={(e) => e.preventDefault()}>
          <CardImage src={res.url[0]} alt="" />
        </Card>
      )}
    </>
  );
};

export default DetailFeedImage;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

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

  @media (max-width: 767px) {
    /* width: 136px; */
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
    }
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

  @media (max-width: 767px) {
    padding: 6px 8px;
  }
`;

const TagName = styled.div`
  font-weight: 500;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserReactBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: -2px;
  margin-bottom: 16px;
`;

const UserReactNum = styled.p`
  font-size: 14px;
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
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const UserText = styled.span`
  font-size: 16px;
  white-space: pre-wrap;
  @media (max-width: 767px) {
    font-size: 14px;
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
  color: ${(props) => (!props.visible ? thirdColor : `#ff5673`)};
  border-color: ${(props) => (!props.visible ? thirdColor : `#ff5673`)};
  cursor: ${(props) => !props.visible && "default"};
  span {
    svg {
      padding-left: 2px;
    }
  }
`;

const PrevArrow = styled(Arrow)<{ visible: boolean }>`
  left: 20px;
  color: ${(props) => (!props.visible ? thirdColor : "#ff5673")};
  border-color: ${(props) => (!props.visible ? thirdColor : "#ff5673")};
  cursor: ${(props) => !props.visible && "default"};
  span {
    svg {
      padding-right: 2px;
    }
  }
`;
