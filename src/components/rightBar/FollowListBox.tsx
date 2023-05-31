import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { query, collection, getDocs, DocumentData } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useToggleFollow from "../../hooks/actions/useToggleFollow";
import { cloneDeep } from "lodash";
import FollowListSkeleton from "../../assets/skeleton/FollowListSkeleton";
import { CurrentUserType } from "../../types/type";

type Props = {
  modalOpen?: boolean;
  modalClose?: () => void;
  onIsLogin?: (callback: () => void) => void;
};

const FollowListBox = ({ modalOpen, modalClose, onIsLogin }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      const notFollowed = filter.filter(
        (res) =>
          !res.follower.some(
            (follower: { displayName: string }) =>
              follower.displayName === userObj.displayName
          )
      );

      // 렌더링이 2번 돼서 cloneDeep으로 해결
      let cloneArr = cloneDeep(notFollowed);
      randomArray(cloneArr); // 배열 랜덤
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

  const onClick = () => {
    if (modalOpen) {
      modalClose();
    }
  };

  const onFollowClick = (user: CurrentUserType, index: number) => {
    onIsLogin(() => {
      toggleFollow(user);
    });
  };

  return (
    <>
      <Container>
        <CategoryBox>
          <Category>추천</Category>
          {users.length > 0 && (
            <AllClick to={`explore/people`} onClick={onClick}>
              더 보기
            </AllClick>
          )}
        </CategoryBox>
        <UserListBox>
          {isLoading ? (
            users.slice(0, 5).map((res, index) => (
              <UserList key={res.email} onClick={onClick}>
                <User to={`/profile/${res.displayName}/post`} state={res.email}>
                  <ProfileImageBox>
                    <ProfileImage
                      onContextMenu={(e) => e.preventDefault()}
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
                  <FollowBtnBox onClick={() => onFollowClick(res, index)}>
                    {userObj?.following?.filter((obj) =>
                      obj?.displayName?.includes(res?.displayName)
                    ).length !== 0 ? (
                      <FollowingBtn>팔로잉</FollowingBtn>
                    ) : (
                      <FollowBtn>팔로우</FollowBtn>
                    )}
                  </FollowBtnBox>
                )}
              </UserList>
            ))
          ) : (
            <FollowListSkeleton />
          )}
          {isLoading && users.length === 0 && (
            <NotUser>추천할 유저가 없습니다.</NotUser>
          )}
        </UserListBox>
      </Container>
    </>
  );
};

export default FollowListBox;

const Container = styled.article`
  /* max-height: 282px; */
  border: 2px solid var(--second-color);
  margin-top: 30px;
  border-radius: 20px;
  overflow: hidden;
  overflow-y: auto;

  @media (max-width: 956px) {
    max-height: auto;
    /* padding: 20px; */
    margin-top: 0px;
    border: none;
    border-top: 1px solid var(--fourth-color);
    border-radius: 0;
  }
`;

const CategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;

  @media (max-width: 956px) {
    padding: 0;
    padding: 20px 20px 12px;
    width: 100%;
  }
`;

const Category = styled.h2`
  font-weight: 700;
  font-size: 16px;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const AllClick = styled(Link)`
  font-weight: 700;
  font-size: 12px;
  padding: 0;
  margin: 0;
  color: var(--weather-color);
  cursor: pointer;

  &:hover,
  &:active {
    color: #3188df;
  }
`;

const UserListBox = styled.ul``;

const UserList = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  /* height: 56px; */
  transition: all 0.15s linear;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }

  @media (max-width: 956px) {
    padding: 12px 20px;
  }
`;

const User = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  flex: 1;
`;

const ProfileImageBox = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid var(--fourth-color);
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
  /* cursor: pointer; */
  /* flex: 1; */
  /* padding-right: 20px;
  @media (max-width: 956px) {
    padding-right: 0;
  } */
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  font-weight: 500;
  /* width: 120px; */
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 12px;
  color: var(--third-color);
  /* width: 120px; */
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
  /* position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%); */
`;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 6px 10px;
  color: #fff;
  border-radius: 8px;
  border: 1px solid var(--second-color);
  background: var(--second-color);
  cursor: pointer;
  transition: all 0.1s linear;
  &:hover,
  &:active {
    background: #000;
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

const NotUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--third-color);
  padding: 12px 16px;
  height: 60px;
`;
