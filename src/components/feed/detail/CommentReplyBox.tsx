import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { onSnapshot, doc } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { dbService } from "../../../fbase";
import useTimeFormat from "../../../hooks/useTimeFormat";
import { CommentType } from "../../../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

type Props = {
  data: CommentType;
  onDelete: (res: CommentType) => void;
  onClickReply?: (data: CommentType) => void;
};

const CommentReplyBox = ({ data, onClickReply, onDelete }: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [replyCreatorInfo, setReplyCreatorInfo] = useState(null);
  const { timeToString } = useTimeFormat();

  //  map 처리된 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", data.email),
      (doc) => {
        setReplyCreatorInfo(doc.data());
      }
    );
    return () => unsubscribe();
  }, [data.email]);

  const replyDpName = useMemo(() => {
    const match = data?.text?.match(/@\w+/);
    if (match) {
      return match;
    }
    return null;
  }, [data?.text]);

  return (
    <UserInfoBox>
      <UserImageBox
        to={userLogin && `/profile/${replyCreatorInfo?.displayName}/post`}
      >
        <UserImage src={replyCreatorInfo?.profileURL} alt="" />
      </UserImageBox>
      <UserWriteInfo>
        <CommentInfoBox>
          <CommentId
            to={userLogin && `/profile/${replyCreatorInfo?.displayName}/post`}
          >
            {data.displayName}
          </CommentId>
          <CommentText>
            {replyDpName ? (
              <>
                <CommentDpName
                  to={`/profile/${replyDpName[0].split("@")[1]}/post`}
                >
                  {`${replyDpName[0]} `}
                </CommentDpName>
                {replyDpName["input"].split(replyDpName[0])[1]}
              </>
            ) : (
              data?.text
            )}
          </CommentText>
        </CommentInfoBox>
        <BottomInfoBox>
          <CommentCreatedAt>{timeToString(Number(data.time))}</CommentCreatedAt>
          <WriteReply onClick={() => onClickReply(data)}>답글 달기</WriteReply>
        </BottomInfoBox>
      </UserWriteInfo>
      {userObj.displayName === data.displayName && (
        <CloseBox onClick={() => onDelete(data)}>
          <IoMdClose />
        </CloseBox>
      )}
    </UserInfoBox>
  );
};

export default CommentReplyBox;

const UserInfoBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserImageBox = styled(Link)`
  display: block;
  padding: 0;
  margin: 0;
  outline: none;
  max-width: 34px;
  max-height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--fourth-color);
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
  overflow: hidden;
`;

const BottomInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const CommentCreatedAt = styled.span`
  font-size: 12px;
  color: var(--third-color);
  font-weight: 400;
  margin-right: 12px;

  @media (max-width: 767px) {
    font-size: 10px;
  }
`;

const WriteReply = styled.button`
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
`;

const CommentInfoBox = styled.div`
  display: inline;
  align-items: center;
  color: var(--second-color);
  padding-right: 40px;
`;

const CommentId = styled(Link)`
  display: inline-block;
  margin-right: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const CommentText = styled.span`
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const CommentDpName = styled(Link)`
  display: inline-block;
  padding: 0;
  margin: 0;
  color: #00376b;
  cursor: pointer;
  font-weight: 500;
`;

const CloseBox = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--third-color);
  transition: all 0.12s linear;
  width: 30px;
  height: 30px;

  &:hover,
  &:active {
    color: var(--second-color);
  }

  svg {
    font-size: 22px;
  }

  @media (max-width: 767px) {
    width: 22px;
    height: 22px;
    svg {
      font-size: 18px;
    }
  }
`;
