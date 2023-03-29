import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import imageCompression from "browser-image-compression";
import { updateProfile } from "firebase/auth";
import {
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Point } from "react-easy-crop/types";
import toast, { Toaster } from "react-hot-toast";
import { BiLeftArrowAlt } from "react-icons/bi";
import { BsCamera, BsPersonPlusFill } from "react-icons/bs";
import { HiOutlineCamera } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { TbCamera } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { text } from "stream/consumers";
import { RootState } from "../../../app/store";
import { currentUser, UserType } from "../../../app/user";
import ColorList from "../../../assets/ColorList";
import getCroppedImg from "../../../assets/CropImage";
import { Spinner } from "../../../assets/Spinner";
import { authService, dbService } from "../../../fbase";
import useToggleFollow from "../../../hooks/useToggleFollow";
import { ImageType } from "../../../types/type";
import ProfileImageCropper from "./ProfileImageCropper";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

const ProfileEditModal = ({ modalOpen, modalClose }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [isImage, setIsImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(userObj.profileURL); // 미리보기 크롭용
  const [profileURL, setProfileURL] = useState({
    imageUrl: userObj.profileURL,
    croppedImageUrl: null,
    crop: null,
    zoom: null,
  });
  const [name, setName] = useState(userObj.name);
  const [displayName, setDisplayName] = useState(userObj.displayName);
  const [checkDisplayName, setCheckDisplayName] = useState(false);
  const [description, setDescription] = useState(userObj.description);
  const [focusName, setFocusName] = useState(false);
  const [focusDsName, setFocusDsName] = useState(false);
  const [focusDesc, setFocusDesc] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const textRef = useRef<HTMLTextAreaElement>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // zoom, crop 초기화
  useEffect(() => {
    if (!profileURL.zoom) {
      setZoom(1);
    } else {
      setZoom(profileURL.zoom);
    }
    if (!profileURL.crop) {
      setCrop({ x: 0, y: 0 });
    } else {
      setCrop(profileURL.crop);
    }
  }, [profileURL.crop, profileURL.zoom]);

  const onPrevClick = () => {
    if (isImage) {
      setProfileURL({ ...profileURL, imageUrl: userObj.profileURL });
      return setIsImage(false);
    }
    return modalClose();
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeDsName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const onChangeDesc = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value);
    },
    []
  );

  useEffect(() => {
    const q = query(collection(dbService, "users"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      //  본인 제외 노출
      const exceptArray = usersArray.filter(
        (obj) => obj.displayName !== userObj.displayName
      );
      const checkFilter = exceptArray.filter(
        (asd) => asd.displayName === displayName
      );
      setCheckDisplayName(checkFilter.length === 0);
    });

    return () => unsubscribe();
  }, [displayName, userObj.displayName]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkDisplayName) {
      await updateDoc(doc(dbService, "users", userObj.displayName), {
        name: name,
        displayName: displayName,
        description: description,
        profileURL: profileURL.croppedImageUrl
          ? profileURL.croppedImageUrl
          : profileURL.imageUrl,
      });
      await updateProfile(authService.currentUser, {
        displayName: displayName,
      });
      dispatch(
        currentUser({
          ...userObj,
          name: name,
          displayName: displayName,
          description: description,
          profileURL: profileURL.croppedImageUrl
            ? profileURL.croppedImageUrl
            : profileURL.imageUrl,
        })
      );
      toast.success("수정이 완료 되었습니다.");
      modalClose();
      return navigate(`${displayName}/post`, { state: userObj.email });
    } else {
      alert("사용자 이름이 중복입니다.");
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;

    const reader = new FileReader(); // 파일 이름 읽기

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
    Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (files) {
      reader.readAsDataURL(files[0]);
    }

    reader.onloadend = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;

      setPreviewImage(result as string); // 미리보기
    };

    setIsImage(true);
  };

  const setCroppedImageFor = async (
    imageUrl: string,
    crop?: Point,
    zoom?: number,
    croppedImageUrl?: string
  ) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 150,
    };

    // 1) 크롭된 이미지 주소(BlobUrl: string)를 File 형태로 변환
    const CroppedImageUrlToFile = await imageCompression.getFilefromDataUrl(
      croppedImageUrl,
      "profile"
    );

    // 2) 1)에서 변환된 File을 압축
    const compressedFile = await imageCompression(
      CroppedImageUrlToFile,
      options
    );

    // 3) 압축된 File을 다시 이미지 주소로 변환
    const compressedCroppedImage = await imageCompression.getDataUrlFromFile(
      compressedFile
    );

    setProfileURL({
      imageUrl,
      crop,
      zoom,
      croppedImageUrl: compressedCroppedImage,
    });
  };

  const onCrop = async () => {
    const croppedImageUrl = await getCroppedImg(
      previewImage,
      croppedAreaPixels
    );
    setCroppedImageFor(profileURL.imageUrl, crop, zoom, croppedImageUrl);
    setIsImage(false);
  };

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={false}>
      <>
        <Container onSubmit={onSubmit}>
          <Header>
            <IconBox onClick={onPrevClick}>
              <BiLeftArrowAlt />
            </IconBox>
            <Category>내 정보 수정</Category>
            {isImage ? (
              <EditBtn type="button" onClick={onCrop}>
                <EditTextEng>CROP</EditTextEng>
              </EditBtn>
            ) : (
              <EditBtn
                type="submit"
                disabled={
                  userObj.name === name &&
                  userObj.displayName === displayName &&
                  userObj.description === description &&
                  profileURL.croppedImageUrl == null
                }
              >
                <EditText>수정 완료</EditText>
              </EditBtn>
            )}
          </Header>
          {isImage ? (
            <ProfileImageCropper
              previewImage={previewImage}
              zoom={zoom}
              crop={crop}
              setZoom={setZoom}
              setCrop={setCrop}
              setCroppedAreaPixels={setCroppedAreaPixels}
            />
          ) : (
            <UserListBox>
              {userObj.profileURL ? (
                <UserList>
                  <ProfileImagesBox htmlFor="attach-file">
                    <ProfileImageBox>
                      <ProfileImage
                        src={
                          profileURL.croppedImageUrl
                            ? profileURL.croppedImageUrl
                            : profileURL.imageUrl
                        }
                        alt="profile image"
                      />
                    </ProfileImageBox>
                    <ProfileImageIcon>
                      <TbCamera />
                    </ProfileImageIcon>
                    <InputImage
                      id="attach-file"
                      accept="image/*"
                      type="file"
                      onChange={onFileChange}
                    />
                  </ProfileImagesBox>
                  <ProfileInfoBox>
                    <ProfileInfo>
                      <ProfileCategory htmlFor="name">이름</ProfileCategory>
                      <ProfileName
                        type="text"
                        id="name"
                        value={name}
                        maxLength={20}
                        onChange={onChangeName}
                        focus={focusName}
                        onFocus={() => setFocusName(true)}
                        onBlur={() => setFocusName(false)}
                        placeholder="이름"
                      />
                    </ProfileInfo>
                    <ProfileInfo>
                      <ProfileCategory htmlFor="dpName">
                        사용자 이름
                      </ProfileCategory>
                      <ProfileName
                        type="text"
                        id="dpName"
                        value={displayName}
                        onChange={onChangeDsName}
                        focus={focusDsName}
                        onFocus={() => setFocusDsName(true)}
                        onBlur={() => setFocusDsName(false)}
                        placeholder="사용자 이름"
                      />
                    </ProfileInfo>
                    <ProfileInfo>
                      <ProfileCategory htmlFor="desc">
                        자기 소개
                      </ProfileCategory>
                      <ProfileDesc
                        spellCheck="false"
                        id="desc"
                        maxLength={120}
                        value={description}
                        onChange={onChangeDesc}
                        focus={focusDesc}
                        onFocus={() => setFocusDesc(true)}
                        onBlur={() => setFocusDesc(false)}
                        ref={textRef}
                        placeholder="자기소개를 입력해 주세요"
                      />
                      <TextAreaLength>
                        <TextAreaLengthColor>
                          {description.trim().length}
                        </TextAreaLengthColor>
                        /120
                      </TextAreaLength>
                    </ProfileInfo>
                  </ProfileInfoBox>
                </UserList>
              ) : (
                <Spinner />
              )}
            </UserListBox>
          )}
        </Container>
      </>
    </Modal>
  );
};

export default ProfileEditModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 480px;
  height: 600px;
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
  box-shadow: 12px 12px 0 -2px #6f4ccf, 12px 12px ${secondColor};
  overflow: hidden;

  @media (max-width: 767px) {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    transform: translate(0, 0);
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
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

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  /* position: absolute; */
  /* right: 0; */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover,
  &:active {
    color: #6f4ccf;
  }

  svg {
    font-size: 24px;
  }
`;

const EditBtn = styled.button`
  user-select: none;
  height: 32px;
  margin-right: 12px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  border: 1px solid #6f4ccf;
  color: #6f4ccf;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:not(:disabled) {
    :hover {
      background: #6f4ccf;
      color: #fff;
      border: 1px solid #6f4ccf;
    }
  }

  &:disabled {
    color: ${thirdColor};
    cursor: default;
    border: 1px solid ${thirdColor};
  }
`;

const EditText = styled.p`
  /* font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important; */
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

const ProfileCategory = styled.label`
  display: block;
  font-size: 14px;
  margin-left: 2px;
  margin-bottom: 8px;
`;

const ProfileName = styled.input<{ focus: boolean }>`
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
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
  border-radius: 8px;
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

const TextAreaLengthColor = styled.span`
  color: #6f4ccf;
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
