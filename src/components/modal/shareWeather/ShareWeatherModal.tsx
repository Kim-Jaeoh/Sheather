import { Modal } from "@mui/material";
import styled from "@emotion/styled";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import toast from "react-hot-toast";
import ColorList from "../../../assets/data/ColorList";
import { useEffect, useRef, useState } from "react";
import { BsCheck, BsFillImageFill } from "react-icons/bs";
import { BiLeftArrowAlt } from "react-icons/bi";
import ShareImageCropper from "./ShareImageCropper";
import { Point } from "react-easy-crop/types";
import imageCompression from "browser-image-compression";
import ShareWeatherCategory from "./ShareWeatherCategory";
import axios from "axios";
import useCurrentLocation from "../../../hooks/useCurrentLocation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdPlace } from "react-icons/md";
import uuid from "react-uuid";
import ShareWeatherForm from "./ShareWeatherForm";
import { FeedType } from "../../../types/type";
import Flicking from "@egjs/react-flicking";
import { regionApi } from "../../../apis/api";

type Props = {
  shareBtn: boolean;
  setShareBtn: React.Dispatch<React.SetStateAction<boolean>>;
};

interface TagType {
  feel: string;
  outer: string;
  top: string;
  innerTop: string;
  bottom: string;
  etc: string;
}

const ShareWeatherModal = ({ shareBtn, setShareBtn }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const shareWeatherData = useSelector((state: RootState) => {
    return state.weather;
  });
  const [tags, setTags] = useState<string[]>([]);
  const [checkTag, setCheckTag] = useState<TagType>();
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageNum, setSelectedImageNum] = useState(0);
  const fileInput = useRef<HTMLInputElement>();
  const [fileName, setFileName] = useState([]);
  const [text, setText] = useState("");
  const [isNextClick, setIsNextClick] = useState(false);
  const { location } = useCurrentLocation();
  const queryClient = useQueryClient();
  const cropRef = useRef(null);

  // 현재 주소 받아오기
  const { data: regionData, isLoading: isLoading2 } = useQuery(
    ["RegionApi", location],
    () => regionApi(location),
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location),
    }
  );

  // 이미지 추가 시 view 렌더 시 이미지 노출
  useEffect(() => {
    setSelectedImage(attachments[selectedImageNum]);
  }, [attachments, selectedImageNum]);

  // 이미지 파일 추가
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNextClick(false);
    const {
      currentTarget: { files },
    } = e;

    if (!files) return;
    if (attachments.length + files.length > 4) {
      fileInput.current.value = ""; // 파일 문구 없애기
      return toast.error("최대 4장의 사진만 첨부할 수 있습니다.");
    }

    for (let i = 0; i < files.length; i++) {
      if (fileName.find((file) => files[i].name === file)) {
        return toast.error("중복된 사진은 첨부할 수 없습니다.");
      }

      const reader = new FileReader(); // 파일 이름 읽기

      /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
        Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
      if (files[i]) {
        reader.readAsDataURL(files[i]);
      }

      reader.onloadend = (finishedEvent) => {
        const {
          target: { result },
        } = finishedEvent;

        setAttachments((prev) => [
          ...prev,
          {
            imageUrl: result,
            croppedImageUrl: null,
            crop: null,
            zoom: null,
            aspect: null,
            name: files[i].name,
          },
        ]);
      };
      setFileName((prev) => {
        return [...prev, files[i].name];
      });
    }
  };

  const setCroppedImageFor = async (
    name: string,
    crop?: Point,
    zoom?: number,
    aspect?: { value: number; text: string },
    croppedImageUrl?: string
  ) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1120,
    };

    // 1) 크롭된 이미지 주소(BlobUrl: string)를 File 형태로 변환
    const CroppedImageUrlToFile = await imageCompression.getFilefromDataUrl(
      croppedImageUrl,
      "feed image"
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

    const newAttachmentList = [...attachments];
    const attachmentIndex = attachments.findIndex((x) => x?.name === name);
    const attachment = attachments[attachmentIndex];
    const newAttachment = {
      ...attachment,
      name,
      crop,
      zoom,
      aspect,
      croppedImageUrl: compressedCroppedImage,
    };
    newAttachmentList[attachmentIndex] = newAttachment;
    setAttachments(newAttachmentList);
    // setSelectedImage(null);
  };

  // 이미지 삭제
  const onRemoveImage = (res: { imageUrl: string; name: string }) => {
    setAttachments(
      attachments.filter((image) => image.imageUrl !== res.imageUrl)
    );
    setSelectedImage(null);
    const filter = fileName.filter((name) => res.name !== name);
    setFileName(filter);
    // fileInput.current.value = "";
  };

  // 다음 버튼
  const onNextClick = () => {
    if (attachments.some((res) => res?.croppedImageUrl == null)) {
      cropRef?.current?.focus();
      toast.error("자르기 버튼을 눌러주세요.", {
        id: `not-cropped`, // 중복 방지
      });
    } else {
      setIsNextClick((prev) => !prev);
    }
  };

  // 이전 버튼
  const onPrevClick = () => {
    if (isNextClick) {
      return setIsNextClick(false);
    }
    if (attachments.length === 0) {
      return setShareBtn(false);
    }
    return shareBtnClick();
  };

  // 피드 업로드
  const { mutate } = useMutation(
    (response: FeedType) =>
      axios.post(`${process.env.REACT_APP_SERVER_PORT}/api/feed`, response),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed"]);
        setShareBtn(false);
      },
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNextClick) {
      mutate({
        id: uuid(),
        url: attachments.map((res) =>
          res.croppedImageUrl ? res.croppedImageUrl : res.imageUrl
        ),
        imgAspect: attachments[0].aspect.text,
        displayName: userObj.displayName,
        email: userObj.email,
        createdAt: +new Date(),
        like: [],
        text: text,
        feel: checkTag.feel,
        wearInfo: {
          outer: checkTag.outer,
          top: checkTag.top,
          innerTop: checkTag.innerTop,
          bottom: checkTag.bottom,
          etc: checkTag.etc,
        },
        weatherInfo: {
          temp: Math.round(shareWeatherData?.main.temp),
          wind: Math.round(shareWeatherData?.wind.speed),
          weatherIcon: shareWeatherData?.weather[0].icon,
          weather: shareWeatherData?.weather[0].description,
        },
        region: regionData?.data?.documents[0]?.address?.region_1depth_name,
        reply: [],
        tag: tags,
      });
      toast.success("업로드 되었습니다.");
    }
  };

  // 모달 닫기
  const shareBtnClick = () => {
    if (attachments.length !== 0) {
      const ok = window.confirm(
        "게시물을 삭제하시겠어요? 지금 나가면 수정 내용이 저장되지 않습니다."
      );
      if (ok) {
        setShareBtn(false);
      }
    } else {
      setShareBtn(false);
    }
  };

  return (
    <Modal open={shareBtn} onClose={shareBtnClick} disableScrollLock={false}>
      <Container onSubmit={onSubmit}>
        <Header>
          <IconBox onClick={onPrevClick}>
            <BiLeftArrowAlt />
          </IconBox>
          <WeatherInfoBox>
            <DateBox>
              <MdPlace />
              <WeatherCategorySub>
                {!isLoading2 &&
                  regionData?.data?.documents[0]?.address?.region_1depth_name}
              </WeatherCategorySub>
            </DateBox>
            <WeatherIcon>
              <img
                src={`/image/weather/${shareWeatherData?.weather[0].icon}.png`}
                // src={`https://openweathermap.org/img/wn/${shareWeatherData?.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </WeatherIcon>
            <WeatherCategorySub>
              {shareWeatherData?.weather[0].description}
            </WeatherCategorySub>
            <WeatherCategorySub>
              {Math.round(shareWeatherData?.main.temp)}º
            </WeatherCategorySub>
            <WeatherCategorySub>
              {Math.round(shareWeatherData?.wind.speed)}
              <span>m/s</span>
            </WeatherCategorySub>
          </WeatherInfoBox>

          {!isNextClick ? (
            <NextBtn
              type="button"
              disabled={
                attachments.length === 0
                // || attachments.filter((res) => res?.croppedImageUrl == null)
                //   .length !== 0
              }
              onClick={onNextClick}
            >
              <EditText>다음</EditText>
            </NextBtn>
          ) : (
            <EditBtn
              type="submit"
              value={"SHARE"}
              disabled={
                text.length === 0 ||
                checkTag.feel == null ||
                checkTag.outer == null ||
                checkTag.top == null ||
                checkTag.innerTop == null ||
                checkTag.bottom == null ||
                (checkTag.top !== "원피스" && checkTag.bottom === "없음") ||
                checkTag.etc == null
              }
            >
              <EditText>공유</EditText>
            </EditBtn>
          )}
        </Header>
        {!isNextClick && (
          <>
            <ShareImageCropper
              attachments={attachments}
              selectedImage={selectedImage}
              setCroppedImageFor={setCroppedImageFor}
              ref={cropRef}
            />
            <ImageWrapper length={attachments.length}>
              <InputImageLabel htmlFor="attach-file">
                <ImageBox style={{ flexDirection: "column" }}>
                  <EmojiBox>
                    <EmojiIcon>
                      <BsFillImageFill
                        style={{
                          color: `${mainColor}`,
                          width: "24px",
                          height: "24px",
                        }}
                      />
                    </EmojiIcon>
                    <InputImage
                      id="attach-file"
                      accept="image/*"
                      name="attach-file"
                      multiple
                      ref={fileInput}
                      type="file"
                      onChange={onFileChange}
                    />
                  </EmojiBox>
                  <ImageLength>
                    <ImageLengthColor>{attachments.length}</ImageLengthColor>/4
                  </ImageLength>
                </ImageBox>
              </InputImageLabel>

              <Flicking
                onChanged={(e) => console.log(e)}
                moveType="freeScroll"
                bound={true}
                align="prev"
              >
                <ImageContainerBox>
                  {Array.from({ length: 4 })?.map((res, index) => {
                    return (
                      <ImageContainer key={index}>
                        {attachments[index] ? (
                          <ImageBox length={attachments?.length}>
                            <ImageWrap>
                              {Boolean(attachments[index].croppedImageUrl) && (
                                <CropBtn>
                                  <BsCheck />
                                </CropBtn>
                              )}
                              <ImageRemove
                                onClick={() => {
                                  onRemoveImage(attachments[index]);
                                  setIsNextClick(false);
                                }}
                              >
                                <IoMdClose />
                              </ImageRemove>
                              <Images
                                onClick={() => {
                                  !isNextClick && setSelectedImageNum(index);
                                }}
                                src={
                                  attachments[index]?.croppedImageUrl
                                    ? attachments[index]?.croppedImageUrl
                                    : attachments[index]?.imageUrl
                                }
                                alt=""
                              />
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
          </>
        )}

        {isNextClick && (
          <>
            <ShareWeatherCategory
              bgColor={"#48A3FF"}
              checkTag={checkTag}
              setCheckTag={setCheckTag}
            />
            <ShareWeatherForm
              bgColor={"#48A3FF"}
              text={text}
              setText={setText}
              setTags={setTags}
            />
          </>
        )}
      </Container>
    </Modal>
  );
};

export default ShareWeatherModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.form`
  display: flex;
  outline: none;
  flex-direction: column;
  width: 480px;
  min-height: -webkit-fill-available;
  /* height: 736px; */
  box-sizing: border-box;
  position: absolute;
  color: ${secondColor};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${mainColor}, 12px 12px ${secondColor};
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 767px) {
    left: 0;
    top: 0;
    transform: translate(0, 0);
    width: 100%;
    height: 100%;
    overflow-y: auto;
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
  padding-right: 14px;
  border-bottom: 1px solid ${thirdColor};
  position: sticky;
  top: 0px;
  z-index: 10;

  @media (max-width: 767px) {
    background: #fff;
  }
`;

const WeatherInfoBox = styled.div`
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: -0.8px;
  }
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ImageWrapper = styled.div<{ length?: number }>`
  display: flex;
  width: 100%;
  height: 128px;
  gap: 12px;
  padding: 14px;
  align-items: center;
  /* justify-content: space-evenly; */
  overflow: hidden;
  position: relative;
  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    position: absolute;
    top: 0px;
    z-index: 10;
    border-radius: 0 0 8px 0;
    height: 100%;
    width: 20px;
    content: "";
  }
`;

const InputImageLabel = styled.label`
  cursor: pointer;
  flex: 1;
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

const EmojiBox = styled.div`
  width: 36px;
  height: 36px;
  position: relative;
`;

const EmojiIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const InputImage = styled.input`
  display: none;
  opacity: 0;
`;

const ImageLength = styled.p`
  font-size: 14px;
`;

const ImageLengthColor = styled.span`
  color: ${mainColor};
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

const ImageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  display: flex;
  flex: 0 0 auto;
`;

const CropBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  user-select: none;
  /* cursor: pointer; */
  bottom: 0px;
  /* border-radius: 9999px; */
  width: 100%;
  font-size: 16px;
  background: rgba(72, 163, 255, 0.7);
  color: #fff;
  transition: all 0.2s;
  z-index: 99;
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
  -webkit-user-drag: none;
  cursor: pointer;
`;

const DateBox = styled.div`
  svg {
    margin-right: 2px;
    font-size: 12px;
    color: ${thirdColor};
  }
`;

const NextBtn = styled.button`
  user-select: none;
  padding: 8px 10px;
  margin-left: auto;
  border-radius: 9999px;
  border: 1px solid ${mainColor};
  color: ${mainColor};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:not(:disabled) {
    &:hover {
      background: ${mainColor};
      color: #fff;
      border: 1px solid ${mainColor};
    }
  }

  &:disabled {
    color: ${thirdColor};
    cursor: default;
    border: 1px solid ${thirdColor};
  }
`;

const EditBtn = styled.button`
  user-select: none;
  padding: 6px 10px;
  margin-left: auto;
  border: 1px solid ${mainColor};
  color: ${mainColor};
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:not(:disabled) {
    :hover {
      background: ${mainColor};
      color: #fff;
      border: 1px solid ${mainColor};
    }
  }

  &:disabled {
    color: ${thirdColor};
    cursor: default;
    border: 1px solid ${thirdColor};
  }
`;

const EditText = styled.p`
  font-weight: 500;
  /* font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px; */
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
    color: ${mainColor};
  }

  svg {
    font-size: 24px;
  }
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin: 0 -14px 0 -10px;
  img {
    display: block;
    width: 100%;
  }
`;

const WeatherCategorySub = styled.span`
  user-select: text;

  font-size: 14px;
  svg {
    font-size: 20px;
  }
  span {
    font-size: 12px;
  }
`;
