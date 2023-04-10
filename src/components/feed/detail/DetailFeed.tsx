import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/data/ColorList";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FeedType } from "../../../types/type";
import useToggleLike from "../../../hooks/useToggleLike";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import FeedEditModal from "../../modal/feed/FeedEditModal";
import toast from "react-hot-toast";
import FeedMoreSelectModal from "../../modal/feed/FeedMoreSelectModal";
import DetailFeedCategory from "./DetailFeedCategory";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../../fbase";
import DetailFeedHeader from "./DetailFeedHeader";
import DetailFeedReplyBox from "./DetailFeedReplyBox";
import DetailFeedImage from "./DetailFeedImage";
import DetailFeedInfo from "./DetailFeedInfo";
import useUserAccount from "../../../hooks/useUserAccount";
import { feedApi } from "../../../apis/api";

const DetailFeed = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [userAccount, setUserAccount] = useState(null);
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
        doc(dbService, "users", detailInfo[0]?.displayName),
        (doc) => {
          setUserAccount(doc.data());
        }
      );
      return () => unsubcribe();
    }
  }, [detailInfo]);

  // 피드 삭제
  const { mutate: mutateFeedDelete } = useMutation(
    () =>
      axios.delete(`${process.env.REACT_APP_SERVER_PORT}/api/feed/${postId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
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
                    info={res}
                  />
                )}
                <Container>
                  <DetailFeedHeader
                    userObj={userObj}
                    res={res}
                    onMoreClick={onMoreClick}
                  />
                  <DetailFeedCategory res={res} />
                  <DetailFeedImage res={res} />
                  <DetailFeedInfo
                    res={res}
                    userObj={userObj}
                    toggleLike={toggleLike}
                  />
                  <DetailFeedReplyBox
                    res={res}
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

  /* box-shadow: 12px 12px 0 -2px #be374e, 12px 12px #be374e; */

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
  }
`;
