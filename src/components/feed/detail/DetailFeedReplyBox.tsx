import React, { useCallback, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/data/ColorList";
import { CurrentUserType, FeedType, replyType } from "../../../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import DetailFeedReply from "./DetailFeedReply";
import { useHandleResizeTextArea } from "../../../hooks/useHandleResizeTextArea";
import Emoji from "../../emoji/Emoji";
import useMediaScreen from "../../../hooks/useMediaScreen";
import useReply from "../../../hooks/useReply";
import useSendNoticeMessage from "../../../hooks/useSendNoticeMessage";

type Props = {
  userAccount: CurrentUserType;
  feed: FeedType;
  onIsLogin: () => void;
};

export type ReplyPayload = {
  id?: string;
  reply?: replyType[];
};

const DetailFeedReplyBox = ({ userAccount, feed, onIsLogin }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { handleResizeHeight } = useHandleResizeTextArea(textRef);
  const { getToken } = useSendNoticeMessage(feed);
  const { replyText, setReplyText, onReply, onReplyDelete } = useReply({
    userObj,
    userAccount,
    feed,
    textRef,
    getToken,
  });
  const { isMobile } = useMediaScreen();

  // 시간순
  const dataSort = useMemo(() => {
    return feed.reply.sort(
      (a: { time: number }, b: { time: number }) => b.time - a.time
    );
  }, [feed.reply]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  // Enter 전송 / Shift + Enter 줄바꿈
  const onKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    res: FeedType
  ) => {
    if (replyText !== "" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onReply(res);
    }
  };

  return (
    <Container>
      {feed.reply.length > 0 && (
        <>
          <UserReactNum>댓글 {feed.reply.length}개</UserReactNum>
          {dataSort.map((data, index) => {
            return (
              <DetailFeedReply
                key={index}
                replyData={data}
                onReplyDelete={onReplyDelete}
              />
            );
          })}
        </>
      )}
      <ReplyEditBox onSubmit={() => onReply(feed)} onClick={onIsLogin}>
        <ReplyEditText
          spellCheck="false"
          maxLength={120}
          value={replyText}
          ref={textRef}
          onChange={onChange}
          onKeyDown={(e) => onKeyPress(e, feed)}
          onInput={handleResizeHeight}
          placeholder="댓글 달기..."
        />
        {replyText.length > 0 && (
          <ReplyEditBtn type="button" onClick={() => onReply(feed)}>
            게시
          </ReplyEditBtn>
        )}
        {!isMobile && (
          <Emoji
            setText={setReplyText}
            textRef={textRef}
            right={0}
            bottom={30}
          />
        )}
      </ReplyEditBox>
    </Container>
  );
};

export default DetailFeedReplyBox;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  padding: 0 16px 16px;
`;

const ReplyEditBox = styled.form`
  padding-top: 20px;
  margin-top: 10px;
  padding-bottom: 8px;
  width: 100%;
  height: 100%;
  border-top: 1px solid ${fourthColor};
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    padding-top: 16px;
    padding-bottom: 0;
  }
`;

const ReplyEditText = styled.textarea`
  display: block;
  width: 100%;
  height: 24px;
  max-height: 80px;
  resize: none;
  border: none;
  outline: none;
  line-height: 24px;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const ReplyEditBtn = styled.button`
  display: flex;
  flex: 1 0 auto;
  margin: 0 12px;
  padding: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  outline: none;
  font-weight: 500;
  color: #ff5673;
  font-size: 14px;
  cursor: pointer;
`;

const UserReactNum = styled.p`
  font-size: 14px;
  color: ${thirdColor};
  margin-bottom: 6px;
`;
