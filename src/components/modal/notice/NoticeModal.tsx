import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../../../assets/spinner/Spinner";
import { dbService } from "../../../fbase";
import { NoticeArrType } from "../../../types/type";
import useTimeFormat from "../../../hooks/useTimeFormat";
import { SlBell } from "react-icons/sl";
import useNoticeCheck from "../../../hooks/actions/useNoticeCheck";
import { useEffect } from "react";
import useGetMyAccount from "../../../hooks/useGetMyAccount";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

interface NoticeType {
  [key: string]: string;
}

const NoticeModal = ({ modalOpen, modalClose }: Props) => {
  const { timeToString } = useTimeFormat();
  const navigate = useNavigate();
  const { result, isLoading } = useNoticeCheck();
  const { myAccount } = useGetMyAccount();

  const noticeText: NoticeType = {
    like: `님이 회원님의 게시물을 좋아합니다.`,
    comment: `님이 회원님의 게시물에 댓글을 남겼습니다:`,
    reply: `님이 회원님의 게시물에 답글을 남겼습니다:`,
    follower: `님이 회원님을 팔로우하기 시작했습니다.`,
  };

  // 읽음 처리
  useEffect(() => {
    if (myAccount) {
      const checkNotice = async () => {
        await updateDoc(doc(dbService, "users", myAccount.email), {
          notice: myAccount?.notice?.map((res: NoticeArrType) => {
            return { ...res, isRead: true };
          }),
        });
      };

      checkNotice();
    }
  }, [myAccount]);

  const onClick = (res: NoticeArrType) => {
    if (res.type === `follower`) {
      navigate(`/profile/${res.displayName}/post`);
    } else {
      navigate(`/feed/detail/${res.postId}`, { state: { id: res.postId } });
    }
    modalClose();
  };

  const onModalClosedAfterRead = async () => {
    modalClose();
  };

  const onDeleteList = async (res: NoticeArrType) => {
    const ok = window.confirm("알림을 삭제하시겠어요?");

    if (ok) {
      const noticeFilter = myAccount.notice.filter(
        (list: NoticeArrType) => list.noticeId !== res.noticeId
      );

      await updateDoc(doc(dbService, "users", myAccount.email), {
        notice: noticeFilter,
      });
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={onModalClosedAfterRead}
      disableScrollLock={false}
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
                ?.sort((a, b) => b?.time - a?.time)
                .map((res, index) => {
                  let stateText = `${noticeText[res?.type]} ${res?.text ?? ""}`;

                  let replyDpName;
                  const match = stateText?.match(/@\w+/);
                  if (match) {
                    replyDpName = match;
                  }

                  return (
                    <UserList key={index}>
                      <ListInfo>
                        <ProfileImageBox
                          to={`/profile/${res?.displayName}/post`}
                          onClick={modalClose}
                        >
                          <ProfileImage
                            onContextMenu={(e) => e.preventDefault()}
                            src={res?.profileURL}
                            alt="profile image"
                          />
                        </ProfileImageBox>
                        <NoticeInfoBox>
                          <NoticeInfo>
                            <ProfileDsName
                              to={`/profile/${res?.displayName}/post`}
                              onClick={modalClose}
                            >
                              {res?.displayName}
                            </ProfileDsName>
                            <NoticeText onClick={() => onClick(res)}>
                              {/* {stateText} */}
                              {replyDpName ? (
                                <>
                                  {`${stateText.split(":")[0]}: `}
                                  <CommentDpName
                                    to={`/profile/${
                                      replyDpName[0].split("@")[1]
                                    }/post`}
                                  >
                                    {`${replyDpName[0]} `}
                                  </CommentDpName>
                                  {
                                    replyDpName["input"].split(
                                      replyDpName[0]
                                    )[1]
                                  }
                                </>
                              ) : (
                                stateText
                              )}
                            </NoticeText>
                          </NoticeInfo>
                          <NoticeAt>{timeToString(res?.time)}</NoticeAt>
                        </NoticeInfoBox>
                        {res?.imgUrl && (
                          <NoticeImageBox onClick={() => onClick(res)}>
                            <NoticeImage
                              onContextMenu={(e) => e.preventDefault()}
                              src={res?.imgUrl}
                            />
                          </NoticeImageBox>
                        )}
                      </ListInfo>
                      <ListCloseBox onClick={() => onDeleteList(res)}>
                        <IoMdClose />
                      </ListCloseBox>
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
  color: var(--second-color);
  outline: none;
  background: #fff;
  border-radius: 20px;
  border: 2px solid var(--second-color);
  box-shadow: 12px 12px 0 -2px #cbdd2c, 12px 12px var(--second-color);

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
    overflow-y: auto;
  }
`;

const Header = styled.header`
  width: 100%;
  min-height: 52px;
  display: flex;
  overflow: hidden;
  border-bottom: 1px solid var(--third-color);
  position: relative;
`;

const Category = styled.div`
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;

  @media (max-width: 767px) {
    font-size: 14px;
  }
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

const ListCloseBox = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--third-color);
  transition: all 0.12s linear;
  width: 48px;
  height: 48px;

  &:hover,
  &:active {
    color: var(--second-color);
  }

  svg {
    font-size: 18px;
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
  transition: all 0.12s linear;

  &:hover,
  &:active {
    background: #f5f5f5;
  }
`;

const ListInfo = styled.div`
  display: flex;
  padding-right: 40px;
  align-items: center;
  gap: 12px;
`;

const ProfileImageBox = styled(Link)`
  width: 44px;
  height: 44px;
  border: 1px solid var(--fourth-color);
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

const CommentDpName = styled(Link)`
  display: inline-block;
  padding: 0;
  margin: 0;
  color: #00376b;
  cursor: pointer;
  font-weight: 500;
`;

const NoticeAt = styled.span`
  font-size: 12px;
  margin-top: 6px;
  color: var(--third-color);
`;

const NoticeImageBox = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  border: 1px solid var(--fourth-color);
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

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 50px 30px;
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
  border: 2px solid var(--second-color);
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
