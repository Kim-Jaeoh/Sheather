import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { RootState } from "../app/store";
import ColorList from "../assets/ColorList";
import ProfilePost from "../components/profile/ProfilePost";
import { FeedType } from "../types/type";

type Props = {};

const Profile = (props: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [selectCategory, setSelectCategory] = useState(0);
  const [post, setPost] = useState(null);

  const feedApi = async () => {
    const { data } = await axios.get("http://localhost:4000/api/feed");
    return data;
  };

  // 피드 리스트 가져오기
  const { data: feedData, isLoading } = useQuery<FeedType[]>(
    ["feed"],
    feedApi,
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
    }
  );

  const myPost: FeedType[] = useMemo(() => {
    const filter = feedData?.filter((res) => res.email === userObj.email);
    return filter;
  }, [feedData, userObj.email]);

  useEffect(() => {
    if (selectCategory === 0) {
      const myPostfilter = feedData?.filter(
        (res) => res.email === userObj.email
      );
      setPost(myPostfilter);
    }
    if (selectCategory === 1) {
      const myLikeFilter = feedData?.filter((res) =>
        userObj.like.includes(res.id)
      );
      setPost(myLikeFilter);
    }
    if (selectCategory === 2) {
      const myBookmarkFilter = feedData?.filter((res) =>
        userObj.bookmark.includes(res.id)
      );
      setPost(myBookmarkFilter);
    }
  }, [feedData, selectCategory, userObj.bookmark, userObj.email, userObj.like]);

  const onImageClick = () => {};

  return (
    <Wrapper>
      <Container>
        <ProfileBox>
          <ProfileImageBox>
            <ProfileImage src={userObj.profileURL} alt="profile" />
          </ProfileImageBox>
          <ProfileDetailBox>
            <ProfileDetail>
              <ProfileInfoBox>
                <ProfileName>{userObj.displayName}</ProfileName>
                <ProfileDesc>{userObj.description}</ProfileDesc>
              </ProfileInfoBox>
              <ProfileEditBtn>프로필 수정</ProfileEditBtn>
            </ProfileDetail>
            <ProfileActBox>
              <ProfileLike>게시글 {myPost?.length}</ProfileLike>
              <ProfileLike>팔로워 {userObj.follower.length}</ProfileLike>
              <ProfileLike>팔로잉 {userObj.following.length}</ProfileLike>
            </ProfileActBox>
            <ProfileEditBox></ProfileEditBox>
          </ProfileDetailBox>
        </ProfileBox>
        <CategoryBox>
          <Category
            onClick={() => setSelectCategory(0)}
            select={selectCategory}
            num={0}
            to="post"
          >
            <MdGridOn />
            게시글
          </Category>
          <Category
            onClick={() => setSelectCategory(1)}
            select={selectCategory}
            num={1}
            to="like"
          >
            <FaRegHeart />
            좋아요
          </Category>
          <Category
            onClick={() => setSelectCategory(2)}
            select={selectCategory}
            num={2}
            to="bookmark"
          >
            <FaRegBookmark />
            북마크
          </Category>
        </CategoryBox>
        <CardList length={post?.length}>
          <Routes>
            <Route path="post" element={<ProfilePost myPost={post} />} />
            <Route path="like" element={<ProfilePost myPost={post} />} />
            <Route path="bookmark" element={<ProfilePost myPost={post} />} />
          </Routes>
        </CardList>
      </Container>
    </Wrapper>
  );
};

export default Profile;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding: 34px;
  background: #6f4ccf;
`;

const Container = styled.div`
  position: relative;
  padding: 20px;
  border: 2px solid ${secondColor};
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: #422a83 1px 1px, #422a83 0px 0px, #422a83 1px 1px, #422a83 2px 2px,
    #422a83 3px 3px, #422a83 4px 4px, #422a83 5px 5px, #422a83 6px 6px,
    #422a83 7px 7px, #422a83 8px 8px, #422a83 9px 9px, #422a83 10px 10px,
    #422a83 11px 11px, #422a83 12px 12px, #422a83 13px 13px, #422a83 14px 14px,
    #422a83 15px 15px, #422a83 16px 16px, #422a83 17px 17px, #422a83 18px 18px,
    #422a83 19px 19px, #422a83 20px 20px, #422a83 21px 21px, #422a83 22px 22px,
    #422a83 23px 23px, #422a83 24px 24px, #422a83 25px 25px, #422a83 26px 26px,
    #422a83 27px 27px, #422a83 28px 28px, #422a83 29px 29px, #422a83 30px 30px,
    #422a83 31px 31px, #422a83 32px 32px, #422a83 33px 33px, #422a83 34px 34px,
    #422a83 35px 35px, #422a83 36px 36px, #422a83 37px 37px, #422a83 38px 38px,
    #422a83 39px 39px, #422a83 40px 40px, #422a83 41px 41px, #422a83 42px 42px,
    #422a83 43px 43px, #422a83 44px 44px, #422a83 45px 45px, #422a83 46px 46px,
    #422a83 47px 47px, #422a83 48px 48px, #422a83 49px 49px, #422a83 50px 50px,
    #422a83 51px 51px, #422a83 52px 52px, #422a83 53px 53px, #422a83 54px 54px,
    #422a83 55px 55px, #422a83 56px 56px, #422a83 57px 57px, #422a83 58px 58px,
    #422a83 59px 59px, #422a83 60px 60px, #422a83 61px 61px, #422a83 62px 62px,
    #422a83 63px 63px;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfileImageBox = styled.div`
  width: 120px;
  height: 120px;
  border: 1px solid ${thirdColor};
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const ProfileDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const ProfileDetail = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const ProfileInfoBox = styled.div`
  flex: 1;
  padding-right: 20px;
`;

const ProfileName = styled.p`
  font-size: 20px;
  margin-bottom: 10px;
`;

const ProfileDesc = styled.p`
  font-size: 14px;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const ProfileActBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfileLike = styled.div``;

const ProfileEditBox = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const ProfileEditBtn = styled.button`
  padding: 8px 10px;
  border: 1px solid #6f4ccf;
  color: #6f4ccf;
  font-weight: bold;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s linear;

  &:hover,
  &:active {
    background-color: #6f4ccf;
    color: #fff;
  }
`;

const CategoryBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
  border-top: 1px solid ${thirdColor};
`;

const Category = styled(Link)<{ select: number; num: number }>`
  padding: 16px 0 20px;
  /* border-top: ${(props) =>
    props.num === props.select && `2px solid ${secondColor}`}; */
  font-weight: ${(props) => props.num === props.select && "bold"};
  /* margin-top: ${(props) => props.num === props.select && "-1px"}; */
  color: ${(props) => props.num !== props.select && thirdColor};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;

  &::after {
    content: "";
    display: ${(props) => (props.num === props.select ? "block" : "none")};
    position: absolute;
    top: 0;
    width: 100%;
    height: 2px;
    background: ${(props) => props.num === props.select && secondColor};
  }

  svg {
    max-width: 12px;
    max-height: 12px;
  }
`;

const CardList = styled.ul<{ length: number }>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  /* justify-content: ${(props) =>
    props.length > 3 ? "space-between" : "flex-start"}; */
  /* gap: 20px; */
`;

const Card = styled.li`
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  margin-bottom: 30px;
  border: 1px solid #eee;
  /* width: 33%; */
  /* height: 33%; */
  width: 180px;
  height: 180px;
  overflow: hidden;
`;

const WeatherEmojiBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
  background-color: rgba(34, 34, 34, 0.4);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const WeatherEmoji = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;

const CardLengthBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  background-color: rgba(34, 34, 34, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const CardLength = styled.span`
  display: inline-block;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
