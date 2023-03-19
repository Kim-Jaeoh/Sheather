import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useQuery } from "@tanstack/react-query";
import { FeedType } from "../../types/type";
import axios from "axios";

interface Count {
  [key: string]: number;
}

const TagCategoryList = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [arrState, setArrState] = useState(false);

  const feedApi = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_PORT}/api/feed`
    );
    return data;
  };

  // 피드 리스트 가져오기
  const { data: feedData, isLoading } = useQuery<FeedType[]>(
    ["feed"],
    feedApi,
    {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60, // 1분
      onError: (e) => console.log(e),
    }
  );

  // 태그 숫자
  const tagList = useMemo(() => {
    const arr = feedData?.map((data) => data.tag).flat();
    if (!arr) {
      return null;
    }

    // 중복 값 개수 구하기
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

  // 개수 홀수 시 flex 레이아웃 유지하기 (배열 개수 추가)
  useEffect(() => {
    // 2의 배수가 아니고, 2개 중 1개 모자랄 때
    if (tagList?.length % 2 === 1) {
      setArrState(true);
    }
  }, [tagList?.length]);

  return (
    <Container>
      <CategoryBox>
        <SelectName>태그</SelectName>
      </CategoryBox>
      <ListBox>
        <>
          {tagList?.map((res, index) => {
            // 해당 태그가 피드 리스트에 포함되어 있는지 필터링
            const filterUser = feedData?.filter((feed) =>
              feed.tag.includes(res.name)
            );
            // 필터링 된 피드들 인기순으로 정렬
            const sortArr = filterUser?.sort(
              (a, b) => b.like.length - a.like.length
            );
            return (
              <List key={index} exist={arrState}>
                {index < 20 && (
                  <Tag
                    key={index}
                    to={userLogin && `/explore/search?keyword=${res.name}`}
                  >
                    <TagRank>{index + 1}</TagRank>
                    <ListProfileBox>
                      <ListProfile src={sortArr[0].url[0]} alt="Feed Image" />
                    </ListProfileBox>
                    <TagInfo>
                      <TagName>#{res.name}</TagName>
                      <TagCount>{res.count} 피드</TagCount>
                    </TagInfo>
                  </Tag>
                )}
              </List>
            );
          })}
          {arrState && <NullCard />}
        </>
      </ListBox>
    </Container>
  );
};

export default TagCategoryList;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: #30c56e;
`;

const CategoryBox = styled.nav`
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px solid ${secondColor};
  border-bottom: 2px solid ${secondColor};
  box-sizing: border-box;
  background: #fff;
  z-index: 20;
`;

const SelectName = styled.span`
  font-weight: 700;
  font-size: 18px;
`;

const ListBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  padding: 40px;
  gap: 14px;
`;

const List = styled.li<{ exist?: boolean }>`
  /* border: ${(props) =>
    props?.exist ? `2px solid ${secondColor}` : `none`}; */
  border: 2px solid ${secondColor};
  flex: 1 1 40%;
  /* flex: 1 1 100%; */
  border-radius: 20px;
  background: #fff;
  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    65% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media screen and (max-width: 1050px) {
    flex: 1 1 100%;
  }
`;

const NullCard = styled.div`
  flex: 1 0 40%;
`;

const Tag = styled(Link)`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  border: none;
`;

const ListProfileBox = styled.div`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
  border-right: 2px solid ${secondColor};
`;

const ListProfile = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TagRank = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 100px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 16px 0 0 16px;
  padding: 10px;
  color: #fff;
  background: ${secondColor};
`;

const TagInfo = styled.div`
  padding: 0 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  height: 100%;
`;

const TagName = styled.span`
  font-size: 18px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TagCount = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
`;
