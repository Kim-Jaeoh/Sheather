import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { onSnapshot, doc } from "firebase/firestore";
import { dbService } from "../../fbase";
import defaultAccount from "../../assets/account_img_default.png";
import useTimeFormat from "../../hooks/useTimeFormat";
import ColorList from "../../assets/ColorList";
import { IoMdClose } from "react-icons/io";
import { replyType } from "../../types/type";

type Props = {
  reply: replyType;
  onDelete: (text: replyType) => void;
};

const DetailFeedReply = ({ reply, onDelete }: Props) => {
  const [replyCreatorInfo, setReplyCreatorInfo] = useState(null);
  const { timeToString, timeToString2 } = useTimeFormat();

  //  map 처리 된 유저 정보들
  useEffect(() => {
    onSnapshot(doc(dbService, "users", reply.email), (doc) => {
      setReplyCreatorInfo(doc.data());
    });
  }, [reply.email]);

  return (
    <ReplyBox>
      <UserInfoBox>
        <UserImageBox>
          <UserImage src={replyCreatorInfo?.profileURL} alt="" />
        </UserImageBox>
        <UserWriteInfo>
          <ReplyInfoBox>
            <ReplyId>{reply.displayName}</ReplyId>
            <ReplyText>{reply.text}</ReplyText>
          </ReplyInfoBox>
          <WriteDate>{timeToString(Number(reply.replyAt))}</WriteDate>
        </UserWriteInfo>
        <CloseBox onClick={() => onDelete(reply)}>
          <IoMdClose />
        </CloseBox>
      </UserInfoBox>
    </ReplyBox>
  );
};

export default DetailFeedReply;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const ReplyBox = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  padding-top: 12px;
  margin-bottom: 6px;
`;

const UserInfoBox = styled.div`
  position: relative;
  display: flex;
  /* align-items: center; */
`;

const UserImageBox = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${fourthColor};
  object-fit: cover;
  cursor: pointer;
`;

const UserImage = styled.img`
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserWriteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
`;

const WriteDate = styled.span`
  font-size: 12px;
  color: ${thirdColor};
`;

const ReplyInfoBox = styled.div`
  display: inline;
  align-items: center;
  color: ${secondColor};
`;

const ReplyId = styled.p`
  display: inline;
  margin-right: 8px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  cursor: pointer;
`;

const ReplyText = styled.span`
  font-size: 14px;
  line-height: 18px;
  white-space: pre-wrap;
`;

const CloseBox = styled.div`
  padding: 8px;
  margin-right: -8px;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover,
  &:active {
    color: ${mainColor};
  }

  svg {
    font-size: 24px;
  }
`;
