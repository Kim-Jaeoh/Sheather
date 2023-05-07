import { useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/data/ColorList";
import { CommentType, replyType } from "../../../types/type";
import CommentReplyBox from "./CommentReplyBox";

type Props = {
  commentData: CommentType;
  onClickReply: (data: CommentType) => void;
  onCommentDelete: (res: CommentType) => void;
  onReplyDelete: (res: replyType) => void;
};

const DetailFeedComment = ({
  commentData,
  onClickReply,
  onCommentDelete,
  onReplyDelete,
}: Props) => {
  const [isShowReply, setIsShowReply] = useState(false);

  const toggleReply = () => {
    setIsShowReply((prev) => !prev);
  };

  return (
    <CommentBox>
      <CommentReplyBox
        data={commentData}
        onClickReply={onClickReply}
        onDelete={onCommentDelete}
      />
      {commentData?.reply?.length !== 0 && (
        <>
          <ShowReplyBox onClick={toggleReply}>
            <ShowReplyBar />
            <ShowReplyText>
              {!isShowReply
                ? `답글 보기 (${commentData?.reply?.length}개)`
                : `답글 숨기기`}
            </ShowReplyText>
          </ShowReplyBox>
          {isShowReply &&
            commentData?.reply?.map((res, index) => {
              return (
                <ReplyListBox key={res.time}>
                  <CommentReplyBox
                    data={res}
                    onClickReply={onClickReply}
                    onDelete={onReplyDelete}
                  />
                </ReplyListBox>
              );
            })}
        </>
      )}
    </CommentBox>
  );
};

export default DetailFeedComment;

const { thirdColor } = ColorList();

const CommentBox = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  padding: 14px 0;
`;

const ShowReplyBox = styled.button`
  margin: 14px 0 0 48px;
  padding: 0;
  border: 0;
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
`;

const ShowReplyText = styled.span`
  font-size: 12px;
  font-weight: 500;
`;

const ShowReplyBar = styled.div`
  border-bottom: 1px solid ${thirdColor};
  box-sizing: border-box;
  flex-shrink: 0;
  font: inherit;
  height: 0;
  margin-right: 16px;
  position: relative;
  width: 24px;
`;

const ReplyListBox = styled.ul`
  margin: 14px 0 0 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
