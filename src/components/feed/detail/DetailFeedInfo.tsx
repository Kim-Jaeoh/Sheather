import styled from "@emotion/styled";
import { CurrentUserType, FeedType } from "../../../types/type";
import { BiCopy } from "react-icons/bi";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useToggleBookmark from "../../../hooks/useToggleBookmark";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import useToggleLike from "../../../hooks/useToggleLike";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { dbService } from "../../../fbase";

type Props = {
  feed: FeedType;
  user: CurrentUserType;
};

const DetailFeedInfo = ({ feed, user }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });

  const [account, setAccount] = useState(null);
  const { toggleBookmark } = useToggleBookmark();
  const { toggleLike } = useToggleLike({ user: account });

  // 계정 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(dbService, "users", feed.email), (doc) =>
      setAccount(doc.data())
    );
    return () => unsubscribe();
  }, [feed]);

  // 복사
  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toast.success("클립보드에 복사했습니다.");
    } catch (error) {
      toast.error("클립보드에 복사되지 않았습니다.");
    }
  };

  return (
    <>
      {feed && (
        <InfoBox>
          <TextBox>
            <UserReactBox>
              <IconBox>
                <Icon onClick={() => toggleLike(feed)}>
                  {userObj.like.some((res) => res === feed.id) ? (
                    <FaHeart style={{ color: `#ff5673` }} />
                  ) : (
                    <FaRegHeart />
                  )}
                </Icon>
                <Icon onClick={() => toggleBookmark(feed.id)}>
                  {userObj?.bookmark?.some((id) => id === feed.id) ? (
                    <FaBookmark style={{ color: `#ff5673` }} />
                  ) : (
                    <FaRegBookmark />
                  )}
                </Icon>
              </IconBox>
              <Icon onClick={() => handleCopyClipBoard()}>
                <BiCopy />
              </Icon>
            </UserReactBox>
            <UserReactNum>공감 {feed?.like?.length}개</UserReactNum>
            <UserTextBox>
              <UserText>{feed?.text}</UserText>
            </UserTextBox>
            {feed?.tag?.length > 0 && (
              <TagList>
                {feed?.tag?.map((tag, index) => {
                  return (
                    <Tag key={index} to={`/explore/search?keyword=${tag}`}>
                      <span>#</span>
                      <TagName>{tag}</TagName>
                    </Tag>
                  );
                })}
              </TagList>
            )}
          </TextBox>
        </InfoBox>
      )}
    </>
  );
};

export default DetailFeedInfo;

const InfoBox = styled.div`
  padding: 20px;
  border-top: 1px solid var(--fourth-color);
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
  font-size: 14px;
  color: var(--feed-color);

  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
  span {
    margin-right: 4px;
  }

  @media (max-width: 767px) {
    font-size: 10px;
    padding: 6px 8px;
    span {
      margin-right: 2px;
    }
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
  color: ${`var(--third-color)`};
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
  color: ${`var(--third-color)`};
  svg {
    font-size: 24px;
  }
  @media (max-width: 767px) {
    width: 24px;
    height: 24px;
    svg {
      font-size: 20px;
    }
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
