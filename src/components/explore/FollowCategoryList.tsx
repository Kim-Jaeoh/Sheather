import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { DocumentData, query, collection, getDocs } from "firebase/firestore";
import { cloneDeep } from "lodash";
import { dbService } from "../../fbase";
import useToggleFollow from "../../hooks/actions/useToggleFollow";
import useUserAccount from "../../hooks/useUserAccount";
import AuthFormModal from "../modal/auth/AuthFormModal";
import useMediaScreen from "../../hooks/useMediaScreen";
import { ImageList } from "@mui/material";
import { CurrentUserType } from "../../types/type";
import FollowCategoryListSkeleton from "../../assets/skeleton/FollowCategoryListSkeleton";

const FollowCategoryList = () => {
  const { isLoggedIn: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFollow } = useToggleFollow();
  const { isAuthModal, onAuthModal, onIsLogin } = useUserAccount();
  const { pathname } = useLocation();
  const { isMobile } = useMediaScreen();

  // 계정 정보 가져오기
  useEffect(() => {
    const querySnapshot = async () => {
      const q = query(collection(dbService, "users"));
      const getdoc = await getDocs(q);
      return getdoc.docs.map((doc) => doc.data());
    };

    querySnapshot().then((arr) => {
      // 1. 본인 제외 필터링
      const filter = arr.filter(
        (res) => res.displayName !== userObj.displayName
      );

      // 2. 1에서 팔로우 안 된 계정 필터링
      const notFollowed = filter?.filter(
        (res) =>
          !res.follower.some(
            (user: { displayName: string }) =>
              user.displayName === userObj.displayName
          )
      );

      // 렌더링이 2번 돼서 cloneDeep으로 해결
      let cloneArr = cloneDeep(notFollowed);

      randomArray(cloneArr); // 배열 랜덤

      setUsers(cloneArr);
      setIsLoading(true);
    });
  }, [userObj.displayName]);

  const bgColor = useMemo(() => {
    if (pathname.includes("people")) {
      return `var(--explore-color)`;
    } else {
      return `transparent`;
    }
  }, [pathname]);

  // 배열 랜덤
  const randomArray = (array: DocumentData[]) => {
    // (피셔-예이츠)
    for (let index = array?.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      const randomPosition = Math.floor(Math.random() * (index + 1));

      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
      const temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
  };

  const onFollowClick = (user: CurrentUserType) => {
    onIsLogin(() => {
      toggleFollow(user);
    });
  };

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      <Container bgColor={bgColor}>
        {pathname?.includes("people") && (
          <CategoryBox>
            <SelectName>추천</SelectName>
          </CategoryBox>
        )}
        <ListBox>
          <ImageList
            sx={{ overflow: "hidden" }}
            cols={2}
            gap={isMobile ? 10 : 20}
          >
            <>
              {!isLoading ? (
                <FollowCategoryListSkeleton />
              ) : (
                <>
                  {users?.slice(0, 10).map((res, index) => {
                    return (
                      <Card
                        isFeed={pathname.includes("feed")}
                        key={res.displayName}
                        onClick={() => onIsLogin(() => null)}
                      >
                        <User
                          to={userLogin && `/profile/${res.displayName}/post`}
                          state={res.displayName}
                        >
                          <ProfileImageBox>
                            <ProfileImage
                              onContextMenu={(e) => e.preventDefault()}
                              src={res.profileURL}
                              alt="profile image"
                            />
                          </ProfileImageBox>
                          <ProfileInfoBox>
                            <ProfileDsName>{res.displayName}</ProfileDsName>
                            {/* {res.name && <ProfileName>{res.name}</ProfileName>} */}
                          </ProfileInfoBox>
                        </User>
                        {res?.email !== userObj.email && (
                          <FollowBtnBox onClick={() => onFollowClick(res)}>
                            {userObj.following.filter((obj) =>
                              obj?.displayName?.includes(res?.displayName)
                            ).length !== 0 ? (
                              <FollowingBtn>팔로잉</FollowingBtn>
                            ) : (
                              <FollowBtn>팔로우</FollowBtn>
                            )}
                          </FollowBtnBox>
                        )}
                      </Card>
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

export default FollowCategoryList;

const Container = styled.div<{ bgColor: string }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: ${(props) => props.bgColor};

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const CategoryBox = styled.nav`
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
    margin-bottom: 20px;
    width: auto;
    height: auto;
    padding: 8px 14px;
    border-radius: 9999px;
    border: 1px solid var(--second-color);
    box-shadow: 0px 4px var(--second-color);
    background: #fff;
    color: var(--second-color);
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
  overflow: hidden;

  @media (max-width: 767px) {
    padding: 0;
  }
`;

const Card = styled.div<{ isFeed: boolean }>`
  flex: 1 0 40%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  position: relative;
  padding: 12px 16px;
  width: 100%;
  height: 80px;
  overflow: hidden;
  border: 2px solid var(--second-color);
  border-radius: 20px;
  background: #fff;
  transition: all 0.12s linear;
  cursor: pointer;
  &:hover,
  &:active {
    background-color: #f5f5f5;
  }

  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

  @media (max-width: 767px) {
    animation: none;
    border: 1px solid
      ${(props) =>
        props.isFeed ? `var(--fourth-color)` : `var(--second-color)`};
    border-radius: 10px;

    justify-content: normal;
    flex-direction: column;
    height: 100%;
    padding: 16px;
  }
`;

const User = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  flex: 1;
  height: 100%;

  @media (max-width: 767px) {
    display: block;
  }
`;

const ProfileImageBox = styled.div`
  width: 44px;
  height: 44px;
  border: 1px solid var(--fourth-color);
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;

  @media (max-width: 767px) {
    width: 88px;
    height: 88px;
  }
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const ProfileInfoBox = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
`;

const ProfileDsName = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 767px) {
    font-size: 12px;
    margin: 16px;
    text-align: center;
  }
`;

const ProfileName = styled.p`
  font-size: 14px;
  color: var(--third-color);
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

const FollowBtnBox = styled.div`
  white-space: pre;
`;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 10px 14px;
  color: #fff;
  border-radius: 20px;
  border: 1px solid var(--second-color);
  background: var(--second-color);
  cursor: pointer;
  transition: all 0.1s linear;
  &:hover,
  &:active {
    background: #000;
  }
  @media (max-width: 767px) {
    padding: 8px 30px;
    border-radius: 8px;
    font-size: 12px;
  }
`;

const FollowingBtn = styled(FollowBtn)`
  border: 1px solid var(--third-color);
  background: #fff;
  color: var(--second-color);

  &:hover,
  &:active {
    background: var(--fourth-color);
  }
`;
