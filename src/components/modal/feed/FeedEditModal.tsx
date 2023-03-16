import Flicking from "@egjs/react-flicking";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Point } from "react-easy-crop/types";
import toast, { Toaster } from "react-hot-toast";
import { BiLeftArrowAlt } from "react-icons/bi";
import { BsCamera, BsPersonPlusFill } from "react-icons/bs";
import { HiOutlineCamera } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { TbCamera } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { text } from "stream/consumers";
import { RootState } from "../../../app/store";
import { currentUser, UserType } from "../../../app/user";
import ColorList from "../../../assets/ColorList";
import getCroppedImg from "../../../assets/CropImage";
import { Spinner } from "../../../assets/Spinner";
import { dbService } from "../../../fbase";
import useToggleFollow from "../../../hooks/useToggleFollow";
import { FeedType, ImageType } from "../../../types/type";
import ShareWeatherCategory from "../shareWeather/ShareWeatherCategory";
import ShareWeatherForm from "../shareWeather/ShareWeatherForm";

type Props = {
  info: FeedType;
  modalOpen: boolean;
  modalClose: () => void;
};

const FeedEditModal = ({ info, modalOpen, modalClose }: Props) => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [checkTag, setCheckTag] = useState({
    feel: info.feel,
    outer: info.wearInfo.outer,
    top: info.wearInfo.top,
    innerTop: info.wearInfo.innerTop,
    bottom: info.wearInfo.bottom,
    etc: info.wearInfo.etc,
  });
  const [text, setText] = useState(info.text);
  const [tags, setTags] = useState(info.tag);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const onPrevClick = () => {
    return modalClose();
  };

  // 피드 업로드
  const { mutate } = useMutation(
    (response: FeedType) =>
      axios.patch(
        `${process.env.REACT_APP_SERVER_PORT}/api/feed/${info.id}`,
        response
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
        toast.success("수정이 완료 되었습니다.");
        modalClose();
      },
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      ...info,
      text: text,
      feel: checkTag.feel,
      wearInfo: {
        outer: checkTag.outer,
        top: checkTag.top,
        innerTop: checkTag.innerTop,
        bottom: checkTag.bottom,
        etc: checkTag.etc,
      },
      editAt: +new Date(),
      tag: tags,
    });
  };

  const bgColor = useMemo(() => {
    if (pathname.includes("feed")) {
      return "#ff5673";
    }
    if (pathname.includes("profile")) {
      return "#6f4ccf";
    }
  }, [pathname]);

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={false}>
      <>
        <Container bgColor={bgColor} onSubmit={onSubmit}>
          <Header>
            <IconBox bgColor={bgColor} onClick={onPrevClick}>
              <BiLeftArrowAlt />
            </IconBox>
            <Category>피드 정보 수정</Category>
            <EditBtn bgColor={bgColor} type="submit">
              <EditText>수정 완료</EditText>
            </EditBtn>
          </Header>

          <ImageWrapper>
            <Flicking
              onChanged={(e) => console.log(e)}
              moveType="freeScroll"
              bound={true}
              align="prev"
            >
              <ImageContainerBox>
                {Array.from({ length: info.url.length })?.map((res, index) => {
                  return (
                    <ImageContainer key={index}>
                      {info.url[index] ? (
                        <ImageBox length={info.url.length}>
                          <ImageWrap>
                            <Images src={info.url[index]} alt="" />
                          </ImageWrap>
                        </ImageBox>
                      ) : (
                        <ImageBox style={{ background: "#dbdbdb" }} />
                      )}
                    </ImageContainer>
                  );
                })}
              </ImageContainerBox>
            </Flicking>
          </ImageWrapper>

          <ShareWeatherCategory
            bgColor={bgColor}
            checkTag={checkTag}
            setCheckTag={setCheckTag}
          />
          <ShareWeatherForm
            bgColor={bgColor}
            text={text}
            tags={tags}
            setText={setText}
            setTags={setTags}
          />
        </Container>
      </>
    </Modal>
  );
};

export default FeedEditModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.form<{ bgColor: string }>`
  display: flex;
  flex-direction: column;
  width: 480px;
  /* height: 100%; */
  box-sizing: border-box;
  position: absolute;
  color: ${secondColor};
  outline: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${(props) => props.bgColor},
    12px 12px ${secondColor};
  /* overflow: hidden; */
`;

const Header = styled.header`
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid ${thirdColor};
  position: relative;
`;

const ImageWrapper = styled.div<{ length?: number }>`
  display: flex;
  width: 100%;
  gap: 12px;
  padding: 12px;
  align-items: center;
  /* justify-content: center; */
  /* justify-content: space-evenly; */
  overflow: hidden;
  position: relative;
  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fafafa);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  }
`;

const ImageContainerBox = styled.div`
  display: flex;
  user-select: none;
  flex: nowrap;
  gap: 12px;
`;

const ImageContainer = styled.div`
  font-size: 12px;
  display: flex;
  flex: 0 0 auto;
`;
const ImageBox = styled.div<{ length?: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 6px;
  border: 1px solid ${fourthColor};
  overflow: hidden;
  background: #fff;
  &:hover,
  &:active {
    background: #f1f1f1;
  }
  transition: all 0.2s;
`;

const ImageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CropBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 6px;
  user-select: none;
  cursor: pointer;
  padding: 6px 8px;
  font-size: 12px;
  background: rgb(34, 34, 34, 0.9);
  color: #fff;
  border-radius: 9999px;
  transition: all 0.2s;
  z-index: 99;
  svg {
    margin-right: 4px;
  }
`;

const ImageRemove = styled.div`
  align-items: center;
  background-color: ${secondColor};
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  justify-content: center;
  position: absolute;
  right: 4px;
  top: 4px;
  padding: 2px;
  z-index: 10;
`;

const Images = styled.img`
  object-fit: cover;
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  cursor: pointer;
`;

const IconBox = styled.div<{ bgColor: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover,
  &:active {
    color: ${(props) => props.bgColor};
  }

  svg {
    font-size: 24px;
  }
`;

const EditBtn = styled.button<{ bgColor: string }>`
  user-select: none;
  height: 32px;
  margin-right: 12px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  border: 1px solid ${(props) => props.bgColor};
  color: ${(props) => props.bgColor};
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:not(:disabled) {
    :hover {
      background: ${(props) => props.bgColor};
      color: #fff;
      border: 1px solid ${(props) => props.bgColor};
    }
  }

  &:disabled {
    color: ${thirdColor};
    cursor: default;
    border: 1px solid ${thirdColor};
  }
`;

const EditText = styled.p`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
`;

const EditTextEng = styled(EditText)`
  margin-bottom: -4px;
`;

const Category = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 14px;
`;

const CloseBox = styled.button`
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 0;
  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 8px;
  }
`;

const UserListBox = styled.div`
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
`;

const ProfileImagesBox = styled.label`
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 20px;
  cursor: pointer;
`;

const ProfileImageBox = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${thirdColor};
  border-radius: 50%;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const ProfileImageIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6f4ccf;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    font-size: 20px;
    color: #fff;
  }
`;

const InputImage = styled.input`
  display: none;
  opacity: 0;
`;

const ProfileInfoBox = styled.div`
  overflow: hidden;
  padding: 0 30px;
`;

const ProfileInfo = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const ProfileCategory = styled.p`
  font-size: 14px;
  margin-bottom: 8px;
`;

const ProfileName = styled.input<{ focus: boolean }>`
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  padding: 12px;
  border: 1px solid ${(props) => (props.focus ? "#6f4ccf" : fourthColor)};
  transition: all 0.1s linear;
  outline: none;
`;

const ProfileDesc = styled.textarea<{ focus: boolean }>`
  display: block;
  width: 100%;
  height: 170px;
  font-size: 14px;
  line-height: 24px;
  resize: none;
  outline: none;
  border: none;
  padding: 12px;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.1s linear;
  border: 1px solid ${(props) => (props.focus ? "#6f4ccf" : fourthColor)};
  &::placeholder {
    font-size: 14px;
  }
  &:focus::placeholder {
    opacity: 0.4;
    color: ${thirdColor};
    transition: all 0.2s;
  }
  /* font-size: 14px;
  margin-top: 6px;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis; */
`;

const TextAreaLength = styled.p`
  margin-top: 8px;
  font-size: 14px;
  float: right;
`;

const TextAreaLengthColor = styled.span<{ bgColor: string }>`
  color: ${(props) => props.bgColor};
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
  border-radius: 20px;
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

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;

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
