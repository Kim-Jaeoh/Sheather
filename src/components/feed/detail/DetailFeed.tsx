import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/data/ColorList";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CurrentUserType, FeedType } from "../../../types/type";
import useToggleLike from "../../../hooks/useToggleLike";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import FeedEditModal from "../../modal/feed/FeedEditModal";
import toast from "react-hot-toast";
import FeedMoreSelectModal from "../../modal/feed/FeedMoreSelectModal";
import DetailFeedCategory from "./DetailFeedCategory";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { dbService } from "../../../fbase";
import DetailFeedHeader from "./DetailFeedHeader";
import DetailFeedReplyBox from "./DetailFeedReplyBox";
import DetailFeedImage from "./DetailFeedImage";
import DetailFeedInfo from "./DetailFeedInfo";
import useUserAccount from "../../../hooks/useUserAccount";
import { feedApi } from "../../../apis/api";
import user from "../../../app/user";

const DetailFeed = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [userAccount, setUserAccount] = useState(null);
  const [documentLike, setDocumentLike] = useState([]);
  const [documentNotice, setDocumentNotice] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const { isAuthModal, onAuthModal, setIsAuthModal, onIsLogin, onLogOutClick } =
    useUserAccount();
  const [isFeedEdit, setIsFeedEdit] = useState(false);
  const { id: postId } = useParams();
  const { toggleLike } = useToggleLike({ user: userAccount });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 피드 리스트 가져오기
  const { data: feedData } = useQuery<FeedType[]>(["feed"], feedApi, {
    refetchOnWindowFocus: false,
    onError: (e) => console.log(e),
  });

  const detailInfo = useMemo(() => {
    return feedData?.filter((res) => postId === res.id);
  }, [feedData, postId]);

  // 상대 계정 정보 가져오기
  useEffect(() => {
    if (detailInfo) {
      const unsubcribe = onSnapshot(
        doc(dbService, "users", detailInfo[0]?.email),
        (doc) => {
          setUserAccount(doc.data());
        }
      );
      return () => unsubcribe();
    }
  }, [detailInfo]);

  // 해당 글 값 가지고 있는 필드 값 검색
  useEffect(() => {
    const userCollection = collection(dbService, "users");
    const q = query(userCollection);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: any = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const likeFilter = data.filter((res: CurrentUserType) =>
        res.like.some((id) => id === postId)
      );
      const noticeFilter = data.filter((res: CurrentUserType) =>
        res.notice.some((notice) => notice.postId === postId)
      );

      setDocumentLike(likeFilter);
      setDocumentNotice(noticeFilter);
    });

    return () => unsubscribe();
  }, [postId]);

  // 해당 글 값이 있으면 삭제
  const fbFieldFilter = async (user: CurrentUserType, type: string) => {
    if (type === "notice") {
      const noticeFilter = user.notice.filter((res) => res.postId !== postId);
      await updateDoc(doc(dbService, "users", user.email), {
        notice: noticeFilter,
      });
    }
    if (type === "like") {
      const likeFilter = user.like.filter((res) => res !== postId);
      await updateDoc(doc(dbService, "users", user.email), {
        like: likeFilter,
      });
    }
  };

  // 게시글 지울 때 관련된 것들 삭제 (좋아요, 댓글)
  const onFbFieldDelete = async () => {
    const noticePromises = documentNotice.map((user) =>
      fbFieldFilter(user, "notice")
    );
    const likePromises = documentLike.map((user) =>
      fbFieldFilter(user, "like")
    );
    await Promise.all([noticePromises, likePromises]); // 병렬 처리
  };

  // 피드 삭제
  const { mutate: mutateFeedDelete } = useMutation(
    () =>
      axios.delete(`${process.env.REACT_APP_SERVER_PORT}/api/feed/${postId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
        onFbFieldDelete();
        onMoreClick();
        navigate("/");
      },
    }
  );

  // 피드 삭제 핸들러
  const onFeedDelete = () => {
    if (isMore) {
      const ok = window.confirm("게시물을 삭제하시겠어요?");
      if (ok) {
        mutateFeedDelete();
        toast.success("삭제가 완료 되었습니다.");
      }
    }
  };

  // 더 보기
  const onMoreClick = () => {
    setIsMore((prev) => !prev);
  };

  // 피드 수정
  const onFeedEditClick = () => {
    setIsFeedEdit((prev) => !prev);
    setIsMore(false);
  };

  return (
    <>
      {feedData && (
        <>
          {detailInfo.map((res, index) => {
            return (
              <Wrapper key={res.id}>
                {isMore && !isFeedEdit ? (
                  <FeedMoreSelectModal
                    modalOpen={isMore}
                    modalClose={onMoreClick}
                    onFeedEditClick={onFeedEditClick}
                    onFeedDelete={onFeedDelete}
                  />
                ) : (
                  <FeedEditModal
                    modalOpen={isFeedEdit}
                    modalClose={onFeedEditClick}
                    feed={res}
                  />
                )}
                <Container>
                  <DetailFeedHeader
                    userObj={userObj}
                    feed={res}
                    onMoreClick={onMoreClick}
                  />
                  <DetailFeedCategory res={res} />
                  <DetailFeedImage res={res} />
                  <DetailFeedInfo
                    feed={res}
                    userObj={userObj}
                    toggleLike={toggleLike}
                  />
                  <DetailFeedReplyBox
                    feed={res}
                    userAccount={userAccount}
                    onIsLogin={() => onIsLogin(() => null)}
                  />
                </Container>
              </Wrapper>
            );
          })}
        </>
      )}
    </>
  );
};

export default DetailFeed;
const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  background: #ff5673;
  border-top: 2px solid ${secondColor};
  padding: 40px;

  @media (max-width: 767px) {
    border-top: none;
    padding: 16px;
  }
`;

const Container = styled.div`
  position: relative;
  border: 2px solid ${secondColor};
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: ${(props) => {
    let shadow = "";
    for (let i = 1; i < 63; i++) {
      shadow += `#be374e ${i}px ${i}px,`;
    }
    shadow += `#be374e 63px 63px`;
    return shadow;
  }};

  @media (max-width: 767px) {
    border: 1px solid ${secondColor};
    box-shadow: none;
  }
`;
