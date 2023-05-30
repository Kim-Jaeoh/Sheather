import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CurrentUserType, NoticeArrType } from "../../../types/type";
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
} from "firebase/firestore";
import { dbService } from "../../../fbase";
import DetailFeedHeader from "./DetailFeedHeader";
import DetailFeedCommentBox from "./DetailFeedCommentBox";
import DetailFeedImage from "./DetailFeedImage";
import DetailFeedInfo from "./DetailFeedInfo";
import useUserAccount from "../../../hooks/useUserAccount";
import useFeedQuery from "../../../hooks/useQuery/useFeedQuery";

interface DocsType {
  id: string;
  like: string[];
  notice: NoticeArrType[];
}

const DetailFeed = () => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [userAccount, setUserAccount] = useState(null);
  const [detailInfo, setDetailInfo] = useState([]);
  const [documentLike, setDocumentLike] = useState([]);
  const [documentNotice, setDocumentNotice] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [isFeedEdit, setIsFeedEdit] = useState(false);
  const { onIsLogin } = useUserAccount();
  const { feedData } = useFeedQuery({ refetch: false });
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (feedData?.length) {
      let filterData = feedData?.filter((res) => postId === res?.id);
      if (!filterData.length) {
        navigate("/feed/following");
        toast.error("존재하지 않는 글입니다.", {
          id: `not-feed`, // 중복 방지
        });
      } else {
        setDetailInfo(filterData);
      }
    }
  }, [feedData, navigate, postId]);

  // 상대 계정 정보 가져오기
  useEffect(() => {
    if (detailInfo?.length) {
      const unsubcribe = onSnapshot(
        doc(dbService, "users", detailInfo[0]?.email),
        (doc) => {
          setUserAccount(doc.data());
        }
      );
      return () => unsubcribe();
    }
  }, [detailInfo]);

  // 1-1. 해당 글 값 가지고 있는 필드 값 검색
  useEffect(() => {
    const q = query(collection(dbService, "users"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: DocsType[] = querySnapshot.docs.map((doc) => {
        return { id: doc.id, like: doc.data().like, notice: doc.data().notice };
      });
      const likeFilter = data.filter((res) =>
        res.like.some((id) => id === postId)
      );
      const noticeFilter = data.filter((res) =>
        res.notice.some((notice) => notice.postId === postId)
      );

      setDocumentLike(likeFilter);
      setDocumentNotice(noticeFilter);
    });

    return () => unsubscribe();
  }, [postId]);

  // 1-2. 해당 글 값이 있으면 삭제
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

  // 1-3. 게시글 지울 때 관련된 것들 삭제 (좋아요, 댓글)
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
        toast.success("삭제가 완료 되었습니다.");
        onFbFieldDelete();
        onMoreClick();
        navigate(-1);
      },
    }
  );

  // 피드 삭제 핸들러
  const onFeedDelete = () => {
    if (isMore) {
      const ok = window.confirm("게시물을 삭제하시겠어요?");
      if (ok) {
        mutateFeedDelete();
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
      {detailInfo?.map((res, index) => {
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
              <DetailFeedCategory feed={res} />
              <DetailFeedImage feed={res} />
              <DetailFeedInfo feed={res} user={userAccount} />
              <DetailFeedCommentBox
                feed={res}
                userAccount={userAccount}
                onIsLogin={() => onIsLogin(() => null)}
              />
            </Container>
          </Wrapper>
        );
      })}
    </>
  );
};

export default DetailFeed;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  background: #ff5673;
  border-top: 2px solid var(--second-color);
  padding: 40px;

  @media (max-width: 767px) {
    border-top: none;
    padding: 16px;
  }
`;

const Container = styled.div`
  position: relative;
  border: 2px solid var(--second-color);
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
    border: 1px solid var(--second-color);
    box-shadow: none;
  }
`;
