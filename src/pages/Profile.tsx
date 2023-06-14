import styled from "@emotion/styled";
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProfileEditModal from "../components/modal/profile/ProfileEditModal";
import ProfileFollowModal from "../components/modal/profile/ProfileFollowModal";
import DeskProfileActInfo from "../components/profile/DeskProfileActInfo";
import MobileProfileActInfo from "../components/profile/MobileProfileActInfo";
import ProfilePost from "../components/profile/ProfilePost";
import { dbService } from "../fbase";
import useInfinityScroll from "../hooks/infinityScroll/useInfinityScroll";
import useMediaScreen from "../hooks/useMediaScreen";
import { FeedType, FollowListCategoryType } from "../types/type";
import AuthFormModal from "../components/modal/auth/AuthFormModal";
import useUserAccount from "../hooks/useUserAccount";
import { Spinner } from "../assets/spinner/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import toast from "react-hot-toast";
import useFeedQuery from "../hooks/useQuery/useFeedQuery";

const Profile = () => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [selectCategory, setSelectCategory] = useState(0);
  const [post, setPost] = useState(null);
  const [notInfoText, setNotInfoText] = useState("");
  const [account, setAccount] = useState(null);
  const [followInfo, setFollowInfo] = useState<FollowListCategoryType>({
    info: null,
    category: "",
  });
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { id: userDpName, "*": type } = useParams();
  const {
    dataList: feedArray,
    isLoading: isLoading2,
    ref,
  } = useInfinityScroll({
    url: `${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`,
    count: 9,
  });
  const { isMobile } = useMediaScreen();
  const { feedData } = useFeedQuery({ refetch: false });
  const { isAuthModal, onAuthModal, onIsLogin } = useUserAccount();
  const navigate = useNavigate();

  // 게시글 숫자
  const myPost: FeedType[] = useMemo(() => {
    const filter = feedData?.filter((res) => res.email === account?.email);
    return filter;
  }, [feedData, account?.email]);

  // 계정 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "users"),
      where(`displayName`, "==", userDpName)
    );

    // 유저 정보 없을 시 뒤로 이동
    const checkUser = async () => {
      const getDoc = await getDocs(q);
      const isExists = getDoc.docs.some((res) => res.data());
      if (!isExists) {
        toast.error("사용자를 찾을 수 없습니다.");
        return navigate(-1);
      }
    };
    checkUser();

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setAccount(doc.data());
      });
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, userDpName]);

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
        ?.filter((res) => res.email === account?.email);
      return setPost(postFilter);
    }

    if (selectCategory === 1) {
      const likeFilter = account?.like
        ?.map((likeId: string) => {
          return feedArray?.pages?.flat()?.filter((res) => res.id === likeId);
        })
        .flat();

      return setPost(likeFilter);
    }

    if (selectCategory === 2) {
      const bookmarkFilter = account?.bookmark
        ?.map((bookmarkId: string) => {
          return feedArray?.pages
            ?.flat()
            ?.filter((res) => res.id === bookmarkId);
        })
        .flat();

      return setPost(bookmarkFilter);
    }
  }, [account, feedArray?.pages, navigate, selectCategory]);

  useEffect(() => {
    if (myPost?.length === 0) {
      setNotInfoText("회원님이 공유한 게시물이 없습니다.");
    }
    if (selectCategory === 1) {
      setNotInfoText("사람들의 게시물에 좋아요를 누르면\n이곳에 표시됩니다.");
    }

    if (selectCategory === 2) {
      setNotInfoText("사람들의 게시물에 북마크를 누르면\n이곳에 표시됩니다.");
    }
  }, [myPost?.length, selectCategory]);

  const isMine = useMemo(() => {
    return userObj?.displayName === account?.displayName;
  }, [account?.displayName, userObj?.displayName]);

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
            followInfo.category === "팔로워"
              ? account?.follower.length
              : account?.following.length
          }
          modalClose={onModalClick}
        />
      )}
      <Wrapper>
        <Container>
          {account ? (
            <>
              {!isMobile ? (
                <DeskProfileActInfo
                  myPost={myPost?.length}
                  account={account}
                  onModalClick={onModalClick}
                  setFollowInfo={setFollowInfo}
                  onEditModalClick={onEditModalClick}
                  onIsLogin={onIsLogin}
                />
              ) : (
                <MobileProfileActInfo
                  myPost={myPost?.length}
                  account={account}
                  onModalClick={onModalClick}
                  setFollowInfo={setFollowInfo}
                  onEditModalClick={onEditModalClick}
                  onIsLogin={onIsLogin}
                />
              )}

              <CategoryBox isMine={isMine}>
                {isMine && (
                  <>
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
                    >
                      <FaRegBookmark />
                      <CategoryText>북마크</CategoryText>
                    </Category>
                  </>
                )}
              </CategoryBox>

              <ProfilePost
                myPost={post}
                loading={isLoading2}
                notInfoText={notInfoText}
                onIsLogin={onIsLogin}
                ref={ref}
              />
            </>
          ) : (
            <Spinner />
          )}
        </Container>
      </Wrapper>
    </>
  );
};

export default Profile;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 40px;
  border-top: 2px solid var(--second-color);
  background: var(--profile-color);

  @media (max-width: 767px) {
    border: none;
    padding: 16px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  padding: 20px;
  border: 2px solid var(--second-color);
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
    border: 1px solid var(--second-color);
    box-shadow: none;
  }
`;

const CategoryBox = styled.div<{ isMine: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin: ${(props) => (props.isMine ? `40px 0 0` : `40px 0 20px`)};
  border-top: 1px solid var(--fourth-color);

  @media (max-width: 767px) {
    gap: 0px;
    margin: 0;
    overflow: hidden;
    justify-content: space-evenly;
    border-bottom: ${(props) =>
      props.isMine && `1px solid var(--fourth-color)`};
  }
`;

const Category = styled(Link)<{ select: number; num: number }>`
  padding: 16px 0 30px;
  font-weight: ${(props) => props.num === props.select && "bold"};
  color: ${(props) => props.num !== props.select && `var(--third-color)`};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  color: ${(props) => props.num === props.select && `var(--profile-color)`};

  &::after {
    content: "";
    display: ${(props) => (props.num === props.select ? "block" : "none")};
    position: absolute;
    top: 0;
    width: 100%;
    height: 2px;
    background: ${(props) =>
      props.num === props.select && `var(--profile-color)`};
  }

  svg {
    width: 12px;
    height: 12px;
  }

  @media (max-width: 767px) {
    width: 33.33%;
    padding: 10px 0;
    color: ${(props) =>
      props.num === props.select
        ? `var(--profile-color)`
        : `var(--third-color)`};

    svg {
      width: 18px;
      height: 18px;
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
