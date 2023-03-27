import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdGridOn } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../app/store";
import { CurrentUserType } from "../app/user";
import ColorList from "../assets/ColorList";
import ProfileEditModal from "../components/modal/profile/ProfileEditModal";
import ProfileFollowModal from "../components/modal/profile/ProfileFollowModal";
import ProfilePost from "../components/profile/ProfilePost";
import { dbService } from "../fbase";
import useCreateChat from "../hooks/useCreateChat";
import useInfinityScroll from "../hooks/useInfinityScroll";
import useLogout from "../hooks/useLogout";
import useToggleFollow from "../hooks/useToggleFollow";
import { FeedType } from "../types/type";

const Profile = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [selectCategory, setSelectCategory] = useState(0);
  const [post, setPost] = useState(null);
  const [notInfoText, setNotInfoText] = useState("");
  const [account, setAccount] = useState(null);
  const [followInfo, setFollowInfo] = useState(null);
  const [followCategory, setFollowCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { onLogOutClick } = useLogout();
  const { toggleFollow } = useToggleFollow();
  const { id, "*": type } = useParams();
  const {
    dataList: feedArray,
    isLoading: isLoading2,
    ref,
  } = useInfinityScroll({
    url: `${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`,
    count: 9,
  });
  const { clickInfo, onCreateChatClick } = useCreateChat();

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
      onError: (e) => console.log(e),
    }
  );

  // 게시글 숫자
  const myPost: FeedType[] = useMemo(() => {
    const filter = feedData?.filter((res) => res.email === account?.email);
    return filter;
  }, [feedData, account?.email]);

  // 계정 정보 가져오기
  // 팔로우 모달 -> 상대 프로필 이동 -> 팔로우 버튼을 누를 때마다 렌더링이 되며 본인 프로필과 상대의 프로필이 겹쳐 보였음
  // => if문을 사용하여 본인 프로필이 아닐 경우에만 Firebase에서 타 계정 정보 받아오기
  useEffect(() => {
    if (userObj.displayName !== id) {
      const unsubcribe = onSnapshot(doc(dbService, "users", id), (doc) => {
        setAccount(doc.data());
      });
      return () => unsubcribe();
    } else {
      setAccount(userObj);
    }
  }, [id, userObj]);

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
      const recentFilter = feedArray?.pages
        ?.flat()
        ?.filter((res) => res.email === account?.email)
        .sort((a, b) => b.createdAt - a.createdAt);
      return setPost(recentFilter);
    }

    if (selectCategory === 1) {
      const likeFilter = account?.like
        ?.map((res: string) => {
          return feedArray?.pages?.flat()?.filter((asd) => asd.id === res);
        })
        .flat();

      return setPost(likeFilter);
    }

    if (selectCategory === 2) {
      const bookmarkFilter = account?.bookmark
        ?.map((res: string) => {
          return feedArray?.pages?.flat()?.filter((asd) => asd.id === res);
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
      setNotInfoText("게시물을 공유하면 회원님의 프로필에 표시됩니다.");
    }
    if (selectCategory === 1) {
      setNotInfoText("사람들의 게시물에 좋아요를 누르면 여기에 표시됩니다.");
    }

    if (selectCategory === 2) {
      setNotInfoText("사람들의 게시물에 북마크를 누르면 여기에 표시됩니다.");
    }
  }, [myPost?.length, selectCategory]);

  const onModalClick = () => {
    setModalOpen((prev) => !prev);
  };

  const onClickFollowInfo = (res: []) => {
    setFollowInfo(res);
  };

  const onEditModalClick = () => {
    setEditModalOpen((prev) => !prev);
  };

  const onMessageClick = (res: CurrentUserType) => {
    onCreateChatClick(res);
  };

  return (
    <>
      {account && (
        <Wrapper>
          {editModalOpen && (
            <ProfileEditModal
              modalOpen={editModalOpen}
              modalClose={onEditModalClick}
            />
          )}
          {modalOpen && (
            <ProfileFollowModal
              accountName={account?.displayName}
              modalOpen={modalOpen}
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
            <ProfileBox>
              <ProfileImageBox>
                <ProfileImage src={account?.profileURL} alt="profile image" />
              </ProfileImageBox>
              <ProfileDetailBox>
                <ProfileDetail>
                  <ProfileInfoBox>
                    <ProfileDsName>{account?.displayName}</ProfileDsName>
                    <ProfileActBox>
                      <ProfileAct>
                        게시글 <em>{myPost?.length}</em>
                      </ProfileAct>
                      <ProfileAct
                        onClick={() => {
                          onModalClick();
                          onClickFollowInfo(account?.follower);
                          setFollowCategory("팔로워");
                        }}
                      >
                        팔로워 <em>{account?.follower.length}</em>
                      </ProfileAct>
                      <ProfileAct
                        onClick={() => {
                          onModalClick();
                          onClickFollowInfo(account?.following);
                          setFollowCategory("팔로잉");
                        }}
                      >
                        팔로잉 <em>{account?.following.length}</em>
                      </ProfileAct>
                    </ProfileActBox>
                  </ProfileInfoBox>
                  {account?.email === userObj.email ? (
                    <BtnBox>
                      <ProfileEditBtn onClick={onEditModalClick}>
                        프로필 수정
                      </ProfileEditBtn>
                      <LogoutBtn onClick={onLogOutClick}>
                        <FiLogOut />
                      </LogoutBtn>
                    </BtnBox>
                  ) : (
                    <ActBtnBox>
                      <FollowBtnBox
                        onClick={() => toggleFollow(account?.displayName)}
                      >
                        {userObj?.following.filter((obj) =>
                          obj.displayName.includes(account.displayName)
                        ).length !== 0 ? (
                          <BtnBox>
                            <FollowingBtn>팔로잉</FollowingBtn>
                          </BtnBox>
                        ) : (
                          <BtnBox>
                            <FollowBtn>팔로우</FollowBtn>
                          </BtnBox>
                        )}
                      </FollowBtnBox>
                      <MessageBtnBox onClick={() => onMessageClick(account)}>
                        <MessageBtn>메시지 보내기</MessageBtn>
                      </MessageBtnBox>
                    </ActBtnBox>
                  )}
                </ProfileDetail>
                <ProfileIntroBox>
                  {account?.name && <ProfileName>{account.name}</ProfileName>}
                  {account?.description && (
                    <ProfileDesc>{account.description}</ProfileDesc>
                  )}
                </ProfileIntroBox>
              </ProfileDetailBox>
            </ProfileBox>
            <CategoryBox>
              <Category
                onClick={() => setSelectCategory(0)}
                select={selectCategory}
                num={0}
                to={`post`}
              >
                <MdGridOn />
                게시물
              </Category>
              <Category
                onClick={() => setSelectCategory(1)}
                select={selectCategory}
                num={1}
                to={`like`}
              >
                <FaRegHeart />
                좋아요
              </Category>
              <Category
                onClick={() => setSelectCategory(2)}
                select={selectCategory}
                num={2}
                to={`bookmark`}
                state={account?.id}
              >
                북마크
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
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
`;

const ProfileImageBox = styled.div`
  width: 120px;
  height: 120px;
  border: 2px solid ${fourthColor};
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
  gap: 14px;
  flex: 1;
  height: 108px;
`;

const ProfileDetail = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`;

const ProfileInfoBox = styled.div`
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ProfileIntroBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileDsName = styled.p`
  font-size: 20px;
  line-height: 34px;
  font-weight: 500;
`;

const ProfileName = styled.p`
  font-size: 14px;
  /* margin-top: 4px; */
`;

const ProfileDesc = styled.p`
  /* margin-top: 8px; */
  font-size: 14px;
  white-space: pre-wrap;
  color: ${thirdColor};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const ProfileActBox = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const ProfileAct = styled.div`
  font-size: 14px;
  color: ${thirdColor};
  &:not(:first-of-type) {
    cursor: pointer;
  }
  em {
    margin-left: 4px;
    color: ${secondColor};
    font-weight: 500;
  }
`;

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileEditBtn = styled.button`
  padding: 8px 10px;
  border: 1px solid #6f4ccf;
  color: #6f4ccf;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover,
  &:active {
    background-color: #6f4ccf;
    color: #fff;
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 8px;
  border: 1px solid ${thirdColor};
  color: ${thirdColor};
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover,
  &:active {
    border: 1px solid ${secondColor};
    background-color: ${secondColor};
    color: #fff;
  }
`;

const ActBtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FollowBtnBox = styled.div``;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  padding: 8px 16px;
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

const MessageBtnBox = styled.div``;

const MessageBtn = styled(FollowBtn)`
  border: 1px solid ${thirdColor};
  background: #fff;
  color: ${secondColor};

  &:hover,
  &:active {
    background: ${fourthColor};
  }
`;

const CategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
  border-top: 1px solid ${thirdColor};
`;

const Category = styled(Link)<{ select: number; num: number }>`
  padding: 16px 0 30px;
  font-weight: ${(props) => props.num === props.select && "bold"};
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
