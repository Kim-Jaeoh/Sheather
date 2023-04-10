import { useMemo } from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/data/ColorList";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FeedType } from "../../types/type";
import TagListSkeleton from "../../assets/skeleton/TagListSkeleton";
import { feedApi } from "../../apis/api";

interface Count {
  [key: string]: number;
}

type Props = {
  modalOpen?: boolean;
  modalClose?: () => void;
};

const TagListBox = ({ modalOpen, modalClose }: Props) => {
  // 피드 리스트 가져오기
  const { data: feedData, isLoading } = useQuery<FeedType[]>(
    ["feed"],
    feedApi,
    {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 5, // 5분
      onError: (e) => console.log(e),
    }
  );

  // 태그 숫자
  const tagList = useMemo(() => {
    const arr = feedData?.map((data) => data.tag).flat();
    if (!arr) {
      return null;
    }

    const result = arr?.reduce((accu: Count, curr: string) => {
      accu[curr] = (accu[curr] || 0) + 1;
      return accu;
    }, {});

    // 키, 값 배열로 객체에 담기
    const arrayMap = Object.entries(result);

    return arrayMap
      .map((res) => ({
        name: res[0],
        count: res[1],
      }))
      .sort((a, b) => b.count - a.count);
  }, [feedData]);

  const onClick = () => {
    if (modalOpen) {
      modalClose();
    }
  };

  return (
    <Container>
      <CategoryBox>
        <Category>태그</Category>
        <AllClick to={`/explore/tag`} onClick={onClick}>
          더 보기
        </AllClick>
      </CategoryBox>
      {tagList ? (
        tagList?.map((res: { name: string; count: number }, index) => (
          <div key={res.name}>
            {index < 5 && (
              <TagList
                to={`/explore/search?keyword=${res.name}`}
                onClick={onClick}
              >
                <TagRank>{index + 1}</TagRank>
                <TagInfo>
                  <TagName>#{res.name}</TagName>
                  <TagCount>{res.count} 피드</TagCount>
                </TagInfo>
              </TagList>
            )}
          </div>
        ))
      ) : (
        <TagListSkeleton />
      )}
    </Container>
  );
};

export default TagListBox;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.article`
  min-height: 278px;
  border: 2px solid ${secondColor};
  margin-top: 30px;
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: 956px) {
    min-height: auto;
    /* padding: 20px; */
    margin-top: 0;
    border: none;
    border-radius: 0;
  }
`;

const CategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;

  @media (max-width: 956px) {
    padding: 20px 20px 12px;
    /* padding: 20px; */
    /* margin-bottom: 12px; */
  }
`;

const Category = styled.h2`
  font-weight: 700;
  font-size: 18px;
`;

const AllClick = styled(Link)`
  font-weight: 700;
  font-size: 12px;
  padding: 0;
  margin: 0;
  color: ${mainColor};
  cursor: pointer;

  &:hover,
  &:active {
    color: #3188df;
  }
`;
const TagList = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  transition: all 0.15s linear;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }

  @media (max-width: 956px) {
    padding: 16px 20px;
    /* padding: 12px 0px; */
  }
`;

const TagRank = styled.span`
  font-size: 12px;
  color: ${thirdColor};
  margin-right: 18px;
`;

const TagInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TagName = styled.span`
  margin-right: 8px;
  font-size: 16px;
  font-weight: 500;
`;

const TagCount = styled.span`
  font-size: 12px;
`;
