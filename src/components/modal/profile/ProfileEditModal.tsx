import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import imageCompression from "browser-image-compression";
import { updateProfile } from "firebase/auth";
import {
  onSnapshot,
  doc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Point } from "react-easy-crop/types";
import toast from "react-hot-toast";
import { BiLeftArrowAlt } from "react-icons/bi";
import { TbCamera } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../app/store";
import { currentUser } from "../../../app/user";
import getCroppedImg from "../../ImageCropper/CropImage";
import { Spinner } from "../../../assets/spinner/Spinner";
import { authService, dbService } from "../../../fbase";
import ProfileImageCropper from "./ProfileImageCropper";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import ProfileImageModal from "./ProfileImageModal";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

type ArrStringType = {
  [key: string]: string;
};

type ArrBooleanType = {
  [key: string]: boolean;
};

const ProfileEditModal = ({ modalOpen, modalClose }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [selectImageModal, setSelectImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(userObj.profileURL); // 미리보기 크롭용
  const [profileURL, setProfileURL] = useState({
    imageUrl: userObj.profileURL !== "" ? userObj.profileURL : null,
    croppedImageUrl: null,
    crop: null,
    zoom: null,
  });
  const [inputs, setInputs] = useState<ArrStringType>({
    name: userObj.name,
    dpName: userObj.displayName,
    desc: userObj.description,
  });
  const [duplicationName, setDulicationName] = useState(false);
  const [focus, setFocus] = useState<ArrBooleanType>({
    name: false,
    dpName: false,
    desc: false,
  });
  const [error, setError] = useState("");
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
    return shareBtnClick();
  };

  // 닉네임 중복 체크
  useEffect(() => {
    const q = query(
      collection(dbService, "users"),
      where(`displayName`, `!=`, userObj.displayName)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersArray = snapshot.docs.map((doc) => doc.data());

      const checkFilter = usersArray.some(
        (res) => res.displayName === inputs.dpName
      );
      setDulicationName(checkFilter);
    });

    return () => {
      unsubscribe();
    };
  }, [inputs.dpName, userObj.displayName]);

  // 정규식 체크
  useEffect(() => {
    const dpNameRegex = /^[a-z0-9_.]+$/;
    const check = dpNameRegex.test(inputs.dpName);

    if (inputs.dpName !== "") {
      if (!check) {
        return setError(
          "사용자 이름에는 문자, 숫자, 밑줄 및 마침표만 사용할 수 있습니다."
        );
      }
      if (!isLoading && duplicationName) {
        return setError("중복된 닉네임입니다.");
      }
      return setError("");
    }
  }, [duplicationName, inputs.dpName, isLoading]);

  // 수정 완료
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!duplicationName) {
      const updateUserInfo = () =>
        updateDoc(doc(dbService, "users", userObj.email), {
          name: inputs.name,
          displayName: inputs.dpName,
          description: inputs.desc,
          profileURL: profileURL.croppedImageUrl
            ? profileURL.croppedImageUrl
            : profileURL.imageUrl,
        });

      const updateProfileInfo = () =>
        updateProfile(authService.currentUser, {
          displayName: inputs.dpName,
        });

      await Promise.all([updateUserInfo(), updateProfileInfo()]).then(() => {
        dispatch(
          currentUser({
            ...userObj,
            name: inputs.name,
            displayName: inputs.dpName,
            description: inputs.desc,
            profileURL: profileURL.croppedImageUrl
              ? profileURL.croppedImageUrl
              : profileURL.imageUrl,
          })
        );
        setIsLoading(false);
        toast.success("수정이 완료 되었습니다.");
        modalClose();
        return navigate(`/profile/${inputs.dpName}/post`, {
          state: userObj.email,
        });
      });
    } else {
      toast.error("사용자 이름이 중복입니다.");
    }
  };

  // 이미지 변경
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectImageModal(false);

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

  // 이미지 리사이징 변환
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

    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  // 자르기
  const onCrop = async () => {
    const croppedImageUrl = await getCroppedImg(
      previewImage,
      croppedAreaPixels
    );
    setCroppedImageFor(profileURL.imageUrl, crop, zoom, croppedImageUrl);
    setIsImage(false);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = e;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: boolean
  ) => {
    const {
      target: { name },
    } = e;
    setFocus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 모달 닫기
  const shareBtnClick = () => {
    if (
      userObj.name !== inputs.name ||
      userObj.displayName !== inputs.dpName ||
      userObj.description !== inputs.desc ||
      profileURL.croppedImageUrl !== null
    ) {
      const ok = window.confirm(
        "게시물을 삭제하시겠어요? 지금 나가면 수정 내용이 저장되지 않습니다."
      );
      if (ok) {
        modalClose();
      }
    } else {
      modalClose();
    }
  };

  const toggleImageModal = () => {
    setSelectImageModal(() => !selectImageModal);
  };

  const isExistsImage = () => {
    if (profileURL.imageUrl || profileURL.croppedImageUrl) {
      setSelectImageModal(true);
    } else {
      setSelectImageModal(false);
    }
  };

  const deleteImage = () => {
    setProfileURL({ ...profileURL, imageUrl: "", croppedImageUrl: "" });
    setSelectImageModal(false);
  };

  return (
    <Modal open={modalOpen} onClose={shareBtnClick} disableScrollLock={false}>
      <>
        {isLoading && (
          <LoadingBox>
            <Spinner />
          </LoadingBox>
        )}
        {selectImageModal && (
          <ProfileImageModal
            modalOpen={selectImageModal}
            modalClose={toggleImageModal}
            deleteImage={deleteImage}
            onFileChange={onFileChange}
          />
        )}
        <Container onSubmit={onSubmit} isLoading={isLoading}>
          <Header>
            <IconBox onClick={onPrevClick}>
              <BiLeftArrowAlt />
            </IconBox>
            <Category>내 정보 수정</Category>
            {isImage ? (
              <EditBtn type="button" onClick={onCrop}>
                <EditText>자르기</EditText>
              </EditBtn>
            ) : (
              <EditBtn
                type="submit"
                disabled={
                  (userObj.name === inputs.name &&
                    userObj.displayName === inputs.dpName &&
                    userObj.description === inputs.desc &&
                    profileURL.croppedImageUrl == null) ||
                  duplicationName
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
              {userObj.defaultProfileUrl ? (
                <UserList>
                  <ProfileImagesBox
                    htmlFor="image-file"
                    onClick={isExistsImage}
                  >
                    <ProfileImageBox>
                      <ProfileImage
                        src={
                          profileURL.imageUrl || profileURL.croppedImageUrl
                            ? profileURL.croppedImageUrl
                              ? profileURL.croppedImageUrl
                              : profileURL.imageUrl
                            : userObj.defaultProfileUrl
                        }
                        alt="profile image"
                      />
                    </ProfileImageBox>
                    <ProfileImageIcon>
                      <TbCamera />
                    </ProfileImageIcon>
                    {!profileURL.imageUrl && !profileURL.croppedImageUrl && (
                      <InputImage
                        id="image-file"
                        accept="image/*"
                        type="file"
                        onChange={onFileChange}
                      />
                    )}
                  </ProfileImagesBox>
                  <ProfileInfoBox>
                    <ProfileInfo>
                      <ProfileCategory htmlFor="dpName">
                        사용자 이름
                      </ProfileCategory>
                      <InputBox focus={focus.dpName}>
                        <IdBox>@</IdBox>
                        <ProfileDpName
                          type="text"
                          id="dpName"
                          name="dpName"
                          autoComplete="off"
                          value={inputs.dpName}
                          onChange={onChange}
                          onFocus={(e) => onFocus(e, true)}
                          onBlur={(e) => onFocus(e, false)}
                          placeholder="사용자 이름"
                          maxLength={20}
                        />
                        {inputs.dpName !== "" &&
                          userObj.displayName !== inputs.dpName && (
                            <InputCheckBox check={error}>
                              {error === "" ? (
                                <IoCheckmarkCircleOutline />
                              ) : (
                                <IoCloseCircleOutline />
                              )}
                            </InputCheckBox>
                          )}
                      </InputBox>
                      {error !== "" && <ErrorText>{error}</ErrorText>}
                    </ProfileInfo>
                    <ProfileInfo>
                      <ProfileCategory htmlFor="name">이름</ProfileCategory>
                      <ProfileName
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="off"
                        value={inputs.name}
                        onChange={onChange}
                        focus={focus.name}
                        onFocus={(e) => onFocus(e, true)}
                        onBlur={(e) => onFocus(e, false)}
                        placeholder="이름"
                        maxLength={20}
                      />
                    </ProfileInfo>
                    <ProfileInfo>
                      <ProfileCategory htmlFor="desc">
                        자기 소개
                      </ProfileCategory>
                      <ProfileDesc
                        spellCheck="false"
                        id="desc"
                        name="desc"
                        maxLength={120}
                        autoComplete="off"
                        value={inputs.desc}
                        onChange={onChange}
                        focus={focus.desc}
                        onFocus={(e) => onFocus(e, true)}
                        onBlur={(e) => onFocus(e, false)}
                        ref={textRef}
                        placeholder="자기소개를 입력해 주세요"
                      />
                      <TextAreaLength>
                        <TextAreaLengthColor>
                          {inputs.desc.trim().length}
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

const Container = styled.form<{ isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  width: 480px;
  min-height: 600px;
  box-sizing: border-box;
  position: absolute;
  color: var(--second-color);
  outline: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  border: 2px solid var(--second-color);
  box-shadow: 12px 12px 0 -2px #6f4ccf, 12px 12px var(--second-color);
  overflow: hidden;
  filter: ${(props) => (props.isLoading ? `brightness(0.5)` : "none")};

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
  border-bottom: 1px solid var(--third-color);
  position: relative;
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
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
    color: var(--third-color);
    cursor: default;
    border: 1px solid var(--third-color);
  }
`;

const EditText = styled.p``;

const Category = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 14px;
`;

const UserListBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileImagesBox = styled.label`
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 24px;
  cursor: pointer;
`;

const ProfileImageBox = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid var(--third-color);
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
  position: relative;
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

const InputCheckBox = styled.div<{ check?: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.check === "" ? `rgb(111, 76, 207,0.8)` : `rgba(255, 0, 0, 0.8)`};
  svg {
    font-size: 24px;
  }
`;

const ProfileName = styled.input<{ focus: boolean }>`
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid
    ${(props) => (props.focus ? "#6f4ccf" : `var(--fourth-color)`)};
  transition: all 0.1s linear;
  outline: none;
`;

const InputBox = styled.div<{ focus: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  border: 1px solid
    ${(props) => (props.focus ? "#6f4ccf" : `var(--fourth-color)`)};
  transition: all 0.1s linear;
  overflow: hidden;
`;

const IdBox = styled.div`
  cursor: default;
  user-select: none;
  font-size: 14px;
  font-weight: 400;
  padding: 0 2px 0px 12px;
  opacity: 0.7;
`;

const ProfileDpName = styled.input`
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  padding: 12px 12px 12px 0;
  border: none;
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
  font-weight: 400;
  border-radius: 8px;
  transition: all 0.1s linear;
  border: 1px solid
    ${(props) => (props.focus ? "#6f4ccf" : `var(--fourth-color)`)};
  &::placeholder {
    font-size: 14px;
  }
  &:focus::placeholder {
    opacity: 0.4;
    color: var(--third-color);
    transition: all 0.2s;
  }
`;

const TextAreaLength = styled.p`
  margin-top: 8px;
  font-size: 14px;
  float: right;
`;

const TextAreaLengthColor = styled.span`
  color: #6f4ccf;
`;

const ErrorText = styled.p`
  display: block;
  text-align: center;
  font-size: 12px;
  color: rgb(235, 0, 0);
  letter-spacing: -0.5px;
  margin: 12px 0 24px;
`;

const LoadingBox = styled.div`
  position: absolute;
  border-radius: 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  overflow: hidden;

  svg {
    width: 40px;
    height: 40px;
    stroke: #fff;
  }
`;
