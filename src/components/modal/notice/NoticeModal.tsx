import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { CurrentUserType } from "../../../app/user";
import ColorList from "../../../assets/ColorList";
import { Spinner } from "../../../assets/Spinner";
import { dbService } from "../../../fbase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FeedType, NoticeArrType } from "../../../types/type";
import useTimeFormat from "../../../hooks/useTimeFormat";
import { SlBell } from "react-icons/sl";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

const NoticeModal = ({ modalOpen, modalClose }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [combinedArr, setCombinedArr] = useState<NoticeArrType[]>([]);
  const [result, setResult] = useState<NoticeArrType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { timeToString } = useTimeFormat();
  const navigate = useNavigate();

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

  useEffect(() => {
    const filter: FeedType[] = feedData?.filter(
      (res) => res.displayName === userObj?.displayName
    );

    const like = filter
      .flatMap((res) => res.like)
      .map((arr) => ({
        type: "like",
        displayName: arr.displayName,
        time: arr.time,
        isRead: arr.isRead,
        postId: arr.postId,
        imgUrl: filter.filter((img) => img.id === arr.postId)[0].url[0],
      }));

    const reply = filter
      .flatMap((res) => res.reply)
      .map((arr) => ({
        type: "reply",
        displayName: arr.displayName,
        time: arr.time,
        isRead: arr.isRead,
        text: arr.text,
        postId: arr.postId,
        imgUrl: filter.filter((img) => img.id === arr.postId)[0].url[0],
      }));

    const follower = userObj.follower.map((arr) => ({
      type: "follower",
      displayName: arr.displayName,
      time: arr.time,
      isRead: arr.isRead,
    }));

    setCombinedArr([...like, ...reply, ...follower]);
  }, [feedData, userObj?.displayName, userObj.follower]);

  // 계정 정보 가져오기
  useEffect(() => {
    const getList = async (res: NoticeArrType) => {
      const docSnap = await getDoc(doc(dbService, "users", res.displayName));
      return {
        isRead: res.isRead ? res.isRead : false,
        postId: res.postId,
        type: res.type,
        time: res.time,
        text: res.text ? res.text : null,
        imgUrl: res.imgUrl ? res.imgUrl : null,
        displayName: docSnap.data().displayName,
        profileURL: docSnap.data().profileURL,
      };
    };

    const promiseList = async () => {
      const list = await Promise.all(
        combinedArr?.map(async (res) => {
          return getList(res);
        })
      );
      setResult(list);
      setIsLoading(true);
    };
    promiseList();
  }, [combinedArr]);

  // // 계정 정보 가져오기
  // useEffect(() => {
  //   combinedArr?.forEach(async (res) => {
  //     onSnapshot(doc(dbService, "users", res.displayName), (doc) => {
  //       setResult((prev: ArrType[]) => {
  //         // 중복 체크
  //         if (!prev.some((user) => user.time === res.time)) {
  //           return [
  //             ...prev,
  //             {
  //               postId: res.postId,
  //               type: res.type,
  //               time: res.time,
  //               text: res.text ? res.text : null,
  //               imgUrl: res.imgUrl ? res.imgUrl : null,
  //               displayName: doc.data().displayName,
  //               profileURL: doc.data().profileURL,
  //             },
  //           ];
  //         } else {
  //           return prev;
  //         }
  //       });
  //     });
  //   });
  //   setIsLoading(true);
  // }, [combinedArr]);

  const onClick = (res: NoticeArrType) => {
    if (res.type === `like`) {
      navigate(`/feed/detail/${res.postId}`, { state: { id: res.postId } });
    }
    if (res.type === `reply`) {
      navigate(`/feed/detail/${res.postId}`, { state: { id: res.postId } });
    }
    if (res.type === `follower`) {
      navigate(`/profile/${res.displayName}/post`);
    }
    return modalClose();
  };

  // console.log(result.map((res) => res.isRead === true));
  console.log(result);

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={true}>
      <Container>
        <Header>
          <Category>알림</Category>
          <CloseBox onClick={modalClose}>
            <IoMdClose />
          </CloseBox>
        </Header>
        {isLoading || result?.length ? (
          <UserListBox>
            {isLoading ? (
              result
                ?.sort((a, b) => b.time - a.time)
                .map((res, index) => {
                  let stateText: string = "";
                  if (res.type === "like") {
                    stateText = `님이 회원님의 게시물을 좋아합니다.`;
                  }
                  if (res.type === "reply") {
                    stateText = `님이 회원님의 게시물에 댓글을 남겼습니다: ${res.text}`;
                  }
                  if (res.type === "follower") {
                    stateText = `님이 회원님을 팔로우하기 시작했습니다.`;
                  }
                  return (
                    <UserList key={index}>
                      <ProfileImageBox
                        to={`/profile/${res.displayName}/post`}
                        state={res.displayName}
                        onClick={modalClose}
                      >
                        <ProfileImage
                          src={res.profileURL}
                          alt="profile image"
                        />
                      </ProfileImageBox>
                      <NoticeInfoBox>
                        <NoticeInfo>
                          <ProfileDsName
                            to={`/profile/${res.displayName}/post`}
                            state={res.displayName}
                            onClick={modalClose}
                          >
                            {res.displayName}
                          </ProfileDsName>
                          <NoticeText onClick={() => onClick(res)}>
                            {stateText}
                          </NoticeText>
                        </NoticeInfo>
                        <NoticeAt>{timeToString(res.time)}</NoticeAt>
                      </NoticeInfoBox>
                      {res?.imgUrl && (
                        <NoticeImageBox
                          to={`/feed/detail`}
                          state={{ id: res.postId }}
                          onClick={modalClose}
                        >
                          <NoticeImage src={res.imgUrl} />
                        </NoticeImageBox>
                      )}
                    </UserList>
                  );
                })
            ) : (
              <Spinner />
            )}
          </UserListBox>
        ) : (
          <NotInfoBox>
            <NotInfo>
              <IconBox>
                <Icon>
                  <SlBell />
                </Icon>
              </IconBox>
              <NotInfoCategory>알림</NotInfoCategory>
              <NotInfoText>
                다른 사람이 회원님의 게시물을 좋아하거나 댓글을 남기면 여기에
                표시됩니다.
              </NotInfoText>
            </NotInfo>
          </NotInfoBox>
        )}
      </Container>
    </Modal>
  );
};

export default NoticeModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  color: ${secondColor};
  outline: none;
  background: #fff;
  border-radius: 20px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px #cbdd2c, 12px 12px ${secondColor};

  @media (max-width: 767px) {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translate(0, 0);
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
`;

const Header = styled.header`
  width: 100%;
  min-height: 52px;
  display: flex;
  overflow: hidden;
  border-bottom: 1px solid ${thirdColor};
  position: relative;
`;

const Category = styled.div`
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
`;

const CloseBox = styled.button`
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
`;

const UserListBox = styled.ul`
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const UserList = styled.li`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  width: 100%;
  gap: 12px;
  cursor: pointer;
  transition: all 0.12s linear;

  &:hover,
  &:active {
    background: #f5f5f5;
  }
`;

const ProfileImageBox = styled(Link)`
  width: 44px;
  height: 44px;
  border: 1px solid ${fourthColor};
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const NoticeInfoBox = styled.div`
  flex: 1;
  padding-right: 20px;
`;

const NoticeInfo = styled.div``;

const ProfileDsName = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const NoticeText = styled.span`
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
`;

const NoticeAt = styled.span`
  font-size: 12px;
  margin-top: 6px;
  color: ${thirdColor};
`;

const NoticeImageBox = styled(Link)`
  width: 44px;
  height: 44px;
  border: 1px solid ${fourthColor};
  /* border-radius: 50%; */
  overflow: hidden;
  flex: 0 0 auto;
  cursor: pointer;
`;

const NoticeImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FollowBtnBox = styled.div``;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${thirdColor};
  background: #fff;
  color: ${secondColor};

  cursor: pointer;
  transition: all 0.1s linear;
  &:hover,
  &:active {
    background: ${fourthColor};
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

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 50px 30px;

  /* animation-name: slideDown;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out; */

  /* @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  } */
`;

const NotInfo = styled.div`
  text-align: center;
`;

const NotInfoCategory = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
`;

const IconBox = styled.div`
  border: 2px solid ${secondColor};
  border-radius: 50%;
  width: 70px;
  height: 70px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NotInfoText = styled.p`
  font-size: 14px;
  line-height: 20px;
  word-break: keep-all;
`;
