import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useLocation } from "react-router-dom";
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
    feel: feed?.feel,
    outer: feed?.wearInfo?.outer,
    top: feed?.wearInfo?.top,
    innerTop: feed?.wearInfo?.innerTop,
    bottom: feed?.wearInfo?.bottom,
    etc: feed?.wearInfo?.etc,
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
      return "var(--feed-color)";
    }
    if (pathname.includes("profile")) {
      return "var(--profile-color)";
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

const Container = styled.form<{ bgColor: string }>`
  display: flex;
  flex-direction: column;
  width: 480px;
  box-sizing: border-box;
  position: absolute;
  color: var(--second-color);
  outline: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  border: 2px solid var(--second-color);
  box-shadow: 12px 12px 0 -2px ${(props) => props.bgColor},
    12px 12px var(--second-color);

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
  border-bottom: 1px solid var(--third-color);
  position: relative;
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
    color: var(--third-color);
    cursor: default;
    border: 1px solid var(--third-color);
  }
`;

const EditText = styled.p`
  /* font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important; */
`;

const Category = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 16px;
  user-select: none;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;
