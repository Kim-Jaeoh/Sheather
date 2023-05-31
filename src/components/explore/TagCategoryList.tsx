import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useUserAccount from "../../hooks/useUserAccount";
import AuthFormModal from "../modal/auth/AuthFormModal";
import { ImageList } from "@mui/material";
import useMediaScreen from "../../hooks/useMediaScreen";
import useFeedQuery from "../../hooks/useQuery/useFeedQuery";
import TagCategoryListSkeleton from "../../assets/skeleton/TagCategoryListSkeleton";

const TagCategoryList = () => {
  const { loginToken: userLogin } = useSelector((state: RootState) => {
    return state.user;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useMediaScreen();
  const { feedData } = useFeedQuery({ refetch: true });
  const { isAuthModal, onAuthModal, onIsLogin } = useUserAccount();

  // 태그 숫자
  const tagList = useMemo(() => {
    const arr = feedData?.map((data) => data.tag).flat();
    if (!arr) {
      return null;
    }

    const result = arr?.reduce((accu, curr) => {
      // 저장된 값(accu)에 현재 값(curr)이 존재하는지 체크. 없다면 -1 반환
      const index = accu?.findIndex((res) => res.name === curr);

      if (index !== -1) {
        accu[index].count += 1;
      } else {
        accu.push({ name: curr, count: 1 });
      }

      return accu;
    }, []);
    setIsLoading(true);
    return result.sort((a, b) => b.count - a.count);
  }, [feedData]);

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      <Container>
        <CategoryBox>
          <SelectName>태그</SelectName>
        </CategoryBox>
        <ListBox>
          <ImageList
            sx={{ overflow: "hidden" }}
            cols={2}
            gap={isMobile ? 10 : 20}
          >
            <>
              {!isLoading ? (
                <TagCategoryListSkeleton />
              ) : (
                <>
                  {tagList?.slice(0, 20).map((res, index) => {
                    // 해당 태그가 피드 리스트에 포함되어 있는지 필터링
                    const filterUser = feedData?.filter((feed) =>
                      feed.tag.includes(res.name)
                    );
                    // 필터링 된 피드들 인기순으로 정렬
                    const sortArr = filterUser?.sort(
                      (a, b) => b.like.length - a.like.length
                    );
                    return (
                      <List
                        key={res.name}
                        onClick={() => onIsLogin(() => null)}
                      >
                        <Tag
                          to={
                            userLogin && `/explore/search?keyword=${res.name}`
                          }
                        >
                          <TagRank>{index + 1}</TagRank>
                          <ListProfileBox>
                            <ListProfile
                              onContextMenu={(e) => e.preventDefault()}
                              src={sortArr[0].url[0]}
                              alt="Feed Image"
                            />
                          </ListProfileBox>
                          <TagInfo>
                            <TagName>#{res.name}</TagName>
                            <TagCount>{res.count} 피드</TagCount>
                          </TagInfo>
                        </Tag>
                      </List>
                    );
                  })}
                </>
              )}
            </>
          </ImageList>
        </ListBox>
      </Container>
    </>
  );
};

export default TagCategoryList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: var(--explore-color);

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const CategoryBox = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px solid var(--second-color);
  border-bottom: 2px solid var(--second-color);
  box-sizing: border-box;
  background: var(--second-color);
  color: #fff;
  z-index: 20;

  @media (max-width: 767px) {
    position: relative;
    margin: 0 auto;
    width: auto;
    height: auto;
    padding: 8px 14px;
    border-radius: 9999px;
    border: 1px solid var(--second-color);
    box-shadow: 0px 4px var(--second-color);
    color: var(--second-color);
    background: #fff;
  }
`;

const SelectName = styled.h2`
  font-weight: 700;
  font-size: 18px;

  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

const ListBox = styled.div`
  width: 100%;
  padding: 40px;

  @media (max-width: 767px) {
    padding: 20px 0 0px;
  }
`;

const List = styled.li`
  border: 2px solid var(--second-color);
  flex: 1 1 40%;
  border-radius: 20px;
  background: #fff;
  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  width: 100%;
  height: 90px;
  overflow: hidden;

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

  @media (max-width: 767px) {
    animation: none;
    border-width: 1px;
    height: 70px;
    border-radius: 10px;
    height: 100%;
  }
`;

const Tag = styled(Link)`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  border: none;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const ListProfileBox = styled.div`
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 2px solid var(--second-color);

  @media (max-width: 767px) {
    border: none;
    width: 172px;
    height: 172px;
  }
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
  height: 100%;
  font-size: 12px;
  font-weight: 500;
  /* border-radius: 16px 0 0 16px; */
  padding: 10px;
  color: #fff;
  background: var(--second-color);

  @media (max-width: 767px) {
    width: 100%;
    padding: 6px;
    /* border-radius: 10px 10px 0 0; */
  }
`;

const TagInfo = styled.div`
  padding-left: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  height: 100%;

  @media (max-width: 767px) {
    /* padding-left: 14px; */
    gap: 8px;
    padding: 0;
    margin: 10px 0;
    text-align: center;
  }
`;

const TagName = styled.span`
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const TagCount = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: var(--third-color);
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;
