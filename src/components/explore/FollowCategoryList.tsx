import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useQuery } from "@tanstack/react-query";
import { FeedType } from "../../types/type";
import axios from "axios";
import { DocumentData, query, collection, getDocs } from "firebase/firestore";
import { cloneDeep } from "lodash";
import { CurrentUserType } from "../../app/user";
import { dbService } from "../../fbase";
import useToggleFollow from "../../hooks/useToggleFollow";

interface Count {
  [key: string]: number;
}

const FollowCategoryList = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [users, setUsers] = useState<CurrentUserType[] | DocumentData[]>([]);
  const [arrState, setArrState] = useState(false);
  const { toggleFollow } = useToggleFollow();

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
            (asd: { displayName: string }) =>
              asd.displayName === userObj.displayName
          )
      );

      // 렌더링이 2번 돼서 cloneDeep으로 해결
      let cloneArr = cloneDeep(notFollowed);

      randomArray(cloneArr); // 배열 랜덤

      setUsers(cloneArr);
    });
  }, [userObj.displayName]);

  // 개수 홀수 시 flex 레이아웃 유지하기 (배열 개수 추가)
  useEffect(() => {
    // 2의 배수가 아니고, 2개 중 1개 모자랄 때
    if (users?.length % 2 === 1) {
      setArrState(true);
    }
  }, [users?.length]);

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
  return (
    <Container>
      <CategoryBox>
        <SelectName>추천</SelectName>
      </CategoryBox>
      <ListBox>
        <>
          {users?.map((res, index) => {
            // 해당 태그가 피드 리스트에 포함되어 있는지 필터링
            return (
              <List key={index}>
                {index < 5 && (
                  <>
                    <User
                      to={userLogin && `/profile/${res.displayName}/post`}
                      state={res.displayName}
                    >
                      <ProfileImageBox>
                        <ProfileImage
                          src={res.profileURL}
                          alt="profile image"
                        />
                      </ProfileImageBox>
                      <ProfileInfoBox>
                        <ProfileDsName>{res.displayName}</ProfileDsName>
                        {res.name && <ProfileName>{res.name}</ProfileName>}
                        {res.description && (
                          <ProfileName>{res.description}</ProfileName>
                        )}
                      </ProfileInfoBox>
                    </User>
                    {res?.email !== userObj.email && (
                      <FollowBtnBox
                        onClick={() =>
                          userLogin && toggleFollow(res.displayName)
                        }
                      >
                        {userObj.following.filter((obj) =>
                          obj?.displayName?.includes(res?.displayName)
                        ).length !== 0 ? (
                          <FollowingBtn>팔로잉</FollowingBtn>
                        ) : (
                          <FollowBtn>팔로우</FollowBtn>
                        )}
                      </FollowBtnBox>
                    )}
                  </>
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

export default FollowCategoryList;

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
  /* justify-content: center; */
  flex-wrap: wrap;
  width: 100%;
  padding: 40px;
  gap: 20px;
`;

const List = styled.li`
  position: relative;
  height: 90px;
  overflow: hidden;
  border: 2px solid ${secondColor};
  border-radius: 20px;
  background: #fff;
  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  flex: 1 0 40%;
`;

const NullCard = styled.div`
  flex: 1 0 40%;
`;

const User = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 12px 16px;
  height: 100%;
  transition: all 0.15s linear;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }
`;

const ProfileImageBox = styled.div`
  width: 44px;
  height: 44px;
  border: 1px solid ${fourthColor};
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const ProfileInfoBox = styled.div`
  cursor: pointer;
  flex: 1;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  gap: 2px;
  /* padding-right: 20px; */
`;

const ProfileDsName = styled.p`
  font-size: 16px;
  font-weight: 500;
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 14px;
  color: ${thirdColor};
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileDesc = styled.p`
  font-size: 14px;
  margin-top: 6px;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const FollowBtnBox = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
`;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 14px;
  color: #fff;
  border-radius: 20px;
  border: 1px solid ${secondColor};
  background: ${secondColor};
  cursor: pointer;
  transition: all 0.1s linear;
  &:hover,
  &:active {
    background: #000;
  }
`;

const FollowingBtn = styled(FollowBtn)`
  border: 1px solid ${thirdColor};
  background: #fff;
  color: ${secondColor};

  &:hover,
  &:active {
    background: ${fourthColor};
  }
`;
