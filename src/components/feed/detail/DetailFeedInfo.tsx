import styled from "@emotion/styled";
import { CurrentUserType, FeedType } from "../../../types/type";
import { BiCopy } from "react-icons/bi";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import ColorList from "../../../assets/data/ColorList";
import toast from "react-hot-toast";
import useToggleBookmark from "../../../hooks/useToggleBookmark";

type Props = {
  feed: FeedType;
  userObj: CurrentUserType;
  toggleLike: (feed: FeedType) => void;
};

const DetailFeedInfo = ({ feed, userObj, toggleLike }: Props) => {
  const { toggleBookmark } = useToggleBookmark();

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
    <InfoBox>
      <TextBox>
        <UserReactBox>
          <IconBox>
            <Icon onClick={() => toggleLike(feed)}>
              {userObj?.like?.filter((id) => id === feed.id).length > 0 ? (
                <FaHeart style={{ color: `#ff5673` }} />
              ) : (
                <FaRegHeart />
              )}
            </Icon>
            <Icon onClick={() => toggleBookmark(feed.id)}>
              {userObj?.bookmark?.filter((id) => id === feed.id).length > 0 ? (
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
        <UserReactNum>공감 {feed.like.length}개</UserReactNum>
        <UserTextBox>
          <UserText>{feed.text}</UserText>
        </UserTextBox>
        {feed?.tag.length > 0 && (
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
  );
};

export default DetailFeedInfo;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const InfoBox = styled.div`
  padding: 20px;
  border-top: 1px solid ${fourthColor};
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
  color: #ff5673;

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
