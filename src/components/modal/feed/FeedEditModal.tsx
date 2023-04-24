import Flicking from "@egjs/react-flicking";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import ColorList from "../../../assets/data/ColorList";
import { FeedType } from "../../../types/type";
import ShareWeatherCategory from "../shareWeather/ShareWeatherCategory";
import ShareWeatherForm from "../shareWeather/ShareWeatherForm";

type Props = {
  feed: FeedType;
  modalOpen: boolean;
  modalClose: () => void;
};

const FeedEditModal = ({ feed, modalOpen, modalClose }: Props) => {
  const [checkTag, setCheckTag] = useState({
    feel: feed.feel,
    outer: feed.wearInfo.outer,
    top: feed.wearInfo.top,
    innerTop: feed.wearInfo.innerTop,
    bottom: feed.wearInfo.bottom,
    etc: feed.wearInfo.etc,
  });
  const [text, setText] = useState(feed.text);
  const [tags, setTags] = useState(feed.tag);
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const onPrevClick = () => {
    return modalClose();
  };

  // 피드 업로드
  const { mutate } = useMutation(
    (response: FeedType) =>
      axios.patch(
        `${process.env.REACT_APP_SERVER_PORT}/api/feed/${feed.id}`,
        response
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
        toast.success("수정이 완료 되었습니다.");
        modalClose();
      },
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      ...feed,
      text: text,
      feel: checkTag.feel,
      wearInfo: {
        outer: checkTag.outer,
        top: checkTag.top,
        innerTop: checkTag.innerTop,
        bottom: checkTag.bottom,
        etc: checkTag.etc,
      },
      editAt: +new Date(),
      tag: tags,
    });
  };

  const bgColor = useMemo(() => {
    if (pathname.includes("feed")) {
      return "#ff5673";
    }
    if (pathname.includes("profile")) {
      return "#6f4ccf";
    }
  }, [pathname]);

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={false}>
      <Container bgColor={bgColor} onSubmit={onSubmit}>
        <Header>
          <IconBox bgColor={bgColor} onClick={onPrevClick}>
            <BiLeftArrowAlt />
          </IconBox>
          <Category>피드 정보 수정</Category>
          <EditBtn bgColor={bgColor} type="submit">
            <EditText>수정 완료</EditText>
          </EditBtn>
        </Header>

        <ImageWrapper>
          <Flicking
            onChanged={(e) => console.log(e)}
            moveType="freeScroll"
            bound={true}
            align="prev"
          >
            <ImageContainerBox>
              {Array.from({ length: feed.url.length })?.map((res, index) => {
                return (
                  <ImageContainer key={index}>
                    {feed.url[index] ? (
                      <ImageBox length={feed.url.length}>
                        <ImageWrap>
                          <Images src={feed.url[index]} alt="" />
                        </ImageWrap>
                      </ImageBox>
                    ) : (
                      <ImageBox style={{ background: "#dbdbdb" }} />
                    )}
                  </ImageContainer>
                );
              })}
            </ImageContainerBox>
          </Flicking>
        </ImageWrapper>

        <ShareWeatherCategory
          bgColor={bgColor}
          checkTag={checkTag}
          setCheckTag={setCheckTag}
        />
        <ShareWeatherForm
          bgColor={bgColor}
          text={text}
          tags={tags}
          setText={setText}
          setTags={setTags}
        />
      </Container>
    </Modal>
  );
};

export default FeedEditModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.form<{ bgColor: string }>`
  display: flex;
  flex-direction: column;
  width: 480px;
  /* height: 100%; */
  box-sizing: border-box;
  position: absolute;
  color: ${secondColor};
  outline: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${(props) => props.bgColor},
    12px 12px ${secondColor};
  /* overflow: hidden; */

  @media (max-width: 767px) {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    transform: translate(0, 0);
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
`;

const Header = styled.header`
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid ${thirdColor};
  position: relative;
`;

const ImageWrapper = styled.div<{ length?: number }>`
  display: flex;
  width: 100%;
  gap: 12px;
  padding: 12px;
  align-items: center;
  overflow: hidden;
  position: relative;
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

const ImageContainerBox = styled.div`
  display: flex;
  user-select: none;
  flex: nowrap;
  gap: 12px;
`;

const ImageContainer = styled.div`
  font-size: 12px;
  display: flex;
  flex: 0 0 auto;
`;
const ImageBox = styled.div<{ length?: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 6px;
  border: 1px solid ${fourthColor};
  overflow: hidden;
  background: #fff;
  &:hover,
  &:active {
    background: #f1f1f1;
  }
  transition: all 0.2s;
`;

const ImageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Images = styled.img`
  object-fit: cover;
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  cursor: pointer;
`;

const IconBox = styled.div<{ bgColor: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover,
  &:active {
    color: ${(props) => props.bgColor};
  }

  svg {
    font-size: 24px;
  }
`;

const EditBtn = styled.button<{ bgColor: string }>`
  user-select: none;
  height: 32px;
  margin-right: 12px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  border: 1px solid ${(props) => props.bgColor};
  color: ${(props) => props.bgColor};
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:not(:disabled) {
    :hover {
      background: ${(props) => props.bgColor};
      color: #fff;
      border: 1px solid ${(props) => props.bgColor};
    }
  }

  &:disabled {
    color: ${thirdColor};
    cursor: default;
    border: 1px solid ${thirdColor};
  }
`;

const EditText = styled.p`
  /* font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important; */
`;

const Category = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 14px;
`;
