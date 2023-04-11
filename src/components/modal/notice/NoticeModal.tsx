import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import ColorList from "../../../assets/data/ColorList";
import { Spinner } from "../../../assets/spinner/Spinner";
import { dbService } from "../../../fbase";
import { NoticeArrType } from "../../../types/type";
import useTimeFormat from "../../../hooks/useTimeFormat";
import { SlBell } from "react-icons/sl";
import useNoticeCheck from "../../../hooks/useNoticeCheck";
import { useEffect } from "react";
import useGetMyAccount from "../../../hooks/useGetMyAccount";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

const NoticeModal = ({ modalOpen, modalClose }: Props) => {
  const { timeToString } = useTimeFormat();
  const navigate = useNavigate();
  const { result, isLoading } = useNoticeCheck();
  const { userLogin, userObj, myAccount } = useGetMyAccount();

  // 읽음 처리
  useEffect(() => {
    if (myAccount) {
      const checkNotice = async () => {
        await updateDoc(doc(dbService, "users", userObj.email), {
          notice: myAccount?.notice?.map((res: NoticeArrType) => {
            return { ...res, isRead: true };
          }),
        });
      };

      checkNotice();
    }
  }, [myAccount, userObj.email]);

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

  const onModalClosedAfterRead = async () => {
    modalClose();
  };

  return (
    <Modal
      open={modalOpen}
      onClose={onModalClosedAfterRead}
      disableScrollLock={true}
    >
      <Container>
        <Header>
          <Category>알림</Category>
          <CloseBox onClick={onModalClosedAfterRead}>
            <IoMdClose />
          </CloseBox>
        </Header>
        {myAccount?.notice.length ? (
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
                          onContextMenu={(e) => e.preventDefault()}
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
                          <NoticeImage
                            onContextMenu={(e) => e.preventDefault()}
                            src={res.imgUrl}
                          />
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
