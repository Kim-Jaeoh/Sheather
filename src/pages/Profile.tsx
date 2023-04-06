import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import ColorList from "../assets/ColorList";
import ProfileEditModal from "../components/modal/profile/ProfileEditModal";
import ProfileFollowModal from "../components/modal/profile/ProfileFollowModal";
import DeskProfileActInfo from "../components/profile/DeskProfileActInfo";
import MobileProfileActInfo from "../components/profile/MobileProfileActInfo";
import ProfilePost from "../components/profile/ProfilePost";
import { dbService } from "../fbase";
import useInfinityScroll from "../hooks/useInfinityScroll";
import useMediaScreen from "../hooks/useMediaScreen";
import { FeedType } from "../types/type";
import AuthFormModal from "../components/modal/auth/AuthFormModal";
import useUserAccount from "../hooks/useUserAccount";

const Profile = () => {
  const [selectCategory, setSelectCategory] = useState(0);
  const [post, setPost] = useState(null);
  const [notInfoText, setNotInfoText] = useState("");
  const [account, setAccount] = useState(null);
  const [followInfo, setFollowInfo] = useState(null);
  const [followCategory, setFollowCategory] = useState("");
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { id, "*": type } = useParams();
  const {
    dataList: feedArray,
    isLoading: isLoading2,
    ref,
  } = useInfinityScroll({
    url: `${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`,
    count: 9,
  });
  const { isMobile } = useMediaScreen();
  const { isAuthModal, setIsAuthModal, onAuthModal, onIsLogin, onLogOutClick } =
    useUserAccount();

  const feedApi = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_PORT}/api/feed`
    );
    return data;
  };

  // 피드 리스트 가져오기
  const { data: feedData } = useQuery<FeedType[]>(["feed"], feedApi, {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
  });

  // 게시글 숫자
  const myPost: FeedType[] = useMemo(() => {
    const filter = feedData?.filter((res) => res.email === account?.email);
    return filter;
  }, [feedData, account?.email]);

  // 계정 정보 가져오기
  useEffect(() => {
    const unsubcribe = onSnapshot(doc(dbService, "users", id), (doc) => {
      setAccount(doc.data());
    });
    return () => unsubcribe();
  }, [id]);

  useEffect(() => {
    if (type === "post") {
      return setSelectCategory(0);
    }
    if (type === "like") {
      return setSelectCategory(1);
    }
    if (type === "bookmark") {
      return setSelectCategory(2);
    }
  }, [type]);

  useEffect(() => {
    if (selectCategory === 0) {
      const postFilter = feedArray?.pages
        ?.flat()
        ?.filter((res) => res.email === account?.email)
        .sort((a, b) => b.createdAt - a.createdAt);
      return setPost(postFilter);
    }

    if (selectCategory === 1) {
      const likeFilter = account?.like
        ?.map((res: string) => {
          return feedArray?.pages?.flat()?.filter((res) => res.id === res);
        })
        .flat();

      return setPost(likeFilter);
    }

    if (selectCategory === 2) {
      const bookmarkFilter = account?.bookmark
        ?.map((res: string) => {
          return feedArray?.pages?.flat()?.filter((res) => res.id === res);
        })
        .flat();

      return setPost(bookmarkFilter);
    }
  }, [
    account?.bookmark,
    account?.email,
    account?.like,
    feedArray?.pages,
    selectCategory,
  ]);

  useEffect(() => {
    if (myPost?.length !== 0) {
      setNotInfoText("게시물을 공유하면 회원님의 게시글에 표시됩니다.");
    }
    if (selectCategory === 1) {
      setNotInfoText("사람들의 게시물에 좋아요를 누르면\n이곳에 표시됩니다.");
    }

    if (selectCategory === 2) {
      setNotInfoText("사람들의 게시물에 북마크를 누르면\n이곳에 표시됩니다.");
    }
  }, [myPost?.length, selectCategory]);

  const onModalClick = () => {
    setFollowModalOpen((prev) => !prev);
  };

  const onEditModalClick = () => {
    setEditModalOpen((prev) => !prev);
  };

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      {account && (
        <Wrapper>
          {editModalOpen && (
            <ProfileEditModal
              modalOpen={editModalOpen}
              modalClose={onEditModalClick}
            />
          )}
          {followModalOpen && (
            <ProfileFollowModal
              accountName={account?.displayName}
              modalOpen={followModalOpen}
              followInfo={followInfo}
              followLength={
                followCategory === "팔로워"
                  ? account?.follower.length
                  : account?.following.length
              }
              followCategory={followCategory}
              modalClose={onModalClick}
            />
          )}
          <Container>
            {!isMobile ? (
              <DeskProfileActInfo
                myPost={myPost?.length}
                account={account}
                onModalClick={onModalClick}
                setFollowInfo={setFollowInfo}
                setFollowCategory={setFollowCategory}
                onEditModalClick={onEditModalClick}
                onIsLogin={onIsLogin}
                onLogOutClick={onLogOutClick}
              />
            ) : (
              <MobileProfileActInfo
                myPost={myPost?.length}
                account={account}
                onModalClick={onModalClick}
                setFollowInfo={setFollowInfo}
                setFollowCategory={setFollowCategory}
                onEditModalClick={onEditModalClick}
                onIsLogin={onIsLogin}
                onLogOutClick={onLogOutClick}
              />
            )}

            <CategoryBox>
              <Category
                onClick={() => setSelectCategory(0)}
                select={selectCategory}
                num={0}
                to={`post`}
              >
                <MdGridOn />
                <CategoryText>게시물</CategoryText>
              </Category>
              <Category
                onClick={() => setSelectCategory(1)}
                select={selectCategory}
                num={1}
                to={`like`}
              >
                <FaRegHeart />
                <CategoryText>좋아요</CategoryText>
              </Category>
              <Category
                onClick={() => setSelectCategory(2)}
                select={selectCategory}
                num={2}
                to={`bookmark`}
                state={account?.id}
              >
                <FaRegBookmark />
                <CategoryText>북마크</CategoryText>
              </Category>
            </CategoryBox>

            <ProfilePost
              myPost={post}
              loading={isLoading2}
              notInfoText={notInfoText}
              ref={ref}
            />
          </Container>
        </Wrapper>
      )}
    </>
  );
};

export default Profile;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 40px;
  border-top: 2px solid ${secondColor};
  background: #6f4ccf;

  @media (max-width: 767px) {
    border: none;
    padding: 16px;
    /* height: calc(100vh - 112px); */
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  padding: 20px;
  border: 2px solid ${secondColor};
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: ${(props) => {
    let shadow = "";
    for (let i = 1; i < 63; i++) {
      shadow += `#422a83 ${i}px ${i}px,`;
    }
    shadow += `#422a83 63px 63px`;
    return shadow;
  }};

  @media (max-width: 767px) {
    padding: 0;
    border: 1px solid ${secondColor};
  }
`;

const CategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
  border-top: 1px solid ${fourthColor};

  @media (max-width: 767px) {
    gap: 30px;
    margin-top: 0;
    /* margin-bottom: 20px; */
    justify-content: space-evenly;
    border-bottom: 1px solid ${fourthColor};
  }
`;

const Category = styled(Link)<{ select: number; num: number }>`
  padding: 16px 0 30px;
  font-weight: ${(props) => props.num === props.select && "bold"};
  color: ${(props) => props.num !== props.select && thirdColor};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
    width: 12px;
    height: 12px;
  }

  @media (max-width: 767px) {
    width: 33.33%;
    padding: 10px 0;
    color: ${(props) => (props.num === props.select ? `#4e2fa3` : thirdColor)};

    svg {
      width: 22px;
      height: 22px;
    }

    &::after {
      display: none;
    }
  }
`;

const CategoryText = styled.span`
  @media (max-width: 767px) {
    display: none;
  }
`;
