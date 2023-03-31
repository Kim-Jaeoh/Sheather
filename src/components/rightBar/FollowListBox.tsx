import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FeedType } from "../../types/type";
import axios from "axios";
import TagListSkeleton from "../../assets/skeleton/TagListSkeleton";
import {
  query,
  collection,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { dbService } from "../../fbase";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { CurrentUserType } from "../../app/user";
import useToggleFollow from "../../hooks/useToggleFollow";
import AuthFormModal from "../modal/auth/AuthFormModal";
import { cloneDeep } from "lodash";
import FollowListSkeleton from "../../assets/skeleton/FollowListSkeleton";

type Props = {
  modalClose?: () => void;
};

const FollowListBox = ({ modalClose }: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [users, setUsers] = useState<CurrentUserType[] | DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModal, setIsAuthModal] = useState(false);
  const { toggleFollow } = useToggleFollow();

  const usersArr = useRef([]);

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
      const notFollowed = filter.filter(
        (res) =>
          !res.follower.some(
            (asd: { displayName: string }) =>
              asd.displayName === userObj.displayName
          )
      );

      // 렌더링이 2번 돼서 cloneDeep으로 해결
      let cloneArr = cloneDeep(notFollowed);
      usersArr.current.push(...cloneArr);
      // randomArray(cloneArr); // 배열 랜덤
      setUsers(cloneArr);
      setIsLoading(true);
    });
  }, [userObj.displayName]);

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

  const onLogState = () => {
    if (!userLogin) {
      setIsAuthModal(true);
    }
    modalClose();
  };

  const onAuthModal = () => {
    setIsAuthModal((prev) => !prev);
  };

  return (
    <>
      <Container>
        {isAuthModal && (
          <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
        )}
        <CategoryBox>
          <Category>추천</Category>
          {users.length > 0 && (
            <AllClick to={`explore/people`}>더 보기</AllClick>
          )}
        </CategoryBox>
        <UserListBox>
          {isLoading ? (
            users.map((res: any, index: number) => (
              <UserList onClick={onLogState} key={index}>
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
                      </ProfileInfoBox>
                    </User>
                    {res?.email !== userObj.email && (
                      <FollowBtnBox
                        onClick={() =>
                          userLogin && toggleFollow(res.displayName)
                        }
                      >
                        {userObj?.following?.filter((obj) =>
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
              </UserList>
            ))
          ) : (
            <FollowListSkeleton />
          )}
          {users.length === 0 && <NotUser>추천할 유저가 없습니다.</NotUser>}
        </UserListBox>
      </Container>
    </>
  );
};

export default FollowListBox;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.article`
  max-height: 278px;
  border: 2px solid ${secondColor};
  margin-top: 30px;
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: 767px) {
    max-height: auto;
    padding: 20px;
    margin-top: 0;
    border: none;
    border-top: 1px solid ${fourthColor};
    border-radius: 0;
  }
`;

const CategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;

  @media (max-width: 767px) {
    padding: 0;
    width: 100%;
    margin-bottom: 12px;
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

const UserListBox = styled.ul``;

const UserList = styled.li`
  position: relative;
`;

const User = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 12px 16px;
  height: 56px;
  transition: all 0.15s linear;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }

  @media (max-width: 767px) {
    padding: 12px 0px;
  }
`;

const ProfileImageBox = styled.div`
  width: 32px;
  height: 32px;
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
  padding-right: 20px;
  @media (max-width: 767px) {
    padding-right: 0;
  }
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  font-weight: 500;
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 12px;
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
  font-size: 12px;
  padding: 6px 10px;
  color: #fff;
  border-radius: 8px;
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

const NotUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${thirdColor};
  padding: 12px 16px;
  height: 60px;
`;
