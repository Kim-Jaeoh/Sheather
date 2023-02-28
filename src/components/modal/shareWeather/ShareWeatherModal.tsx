import { Modal } from "@mui/material";
import styled from "@emotion/styled";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import toast, { Toaster } from "react-hot-toast";
import ColorList from "../../../assets/ColorList";
import { useEffect, useRef, useState } from "react";
import TempClothes from "../../../assets/TempClothes";
import { BsFillImageFill } from "react-icons/bs";
import { BiCrop, BiLeftArrowAlt } from "react-icons/bi";
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

type Props = {
  shareBtn: boolean;
  setShareBtn: React.Dispatch<React.SetStateAction<boolean>>;
  shareBtnClick: () => void;
};

const ShareWeatherModal = ({ shareBtn, setShareBtn, shareBtnClick }: Props) => {
  const [checkTag, setCheckTag] = useState({
    feel: null,
    outer: null,
    top: null,
    innerTop: null,
    bottom: null,
    etc: null,
  });
  const [focus, setFocus] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectImage] = useState(null);
  const [selectedImageNum, setSelectImageNum] = useState(0);
  const fileInput = useRef<HTMLInputElement>();
  const [fileName, setFileName] = useState([]);
  const [text, setText] = useState("");
  const [isNextClick, setIsNextClick] = useState(false);
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const shareWeatherData = useSelector((state: RootState) => {
    return state.weather;
  });
  const { location } = useCurrentLocation();

  // 현재 주소 받아오기
  const regionApi = async () => {
    return await axios.get(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${location?.coordinates.lon}&y=${location?.coordinates.lat}&input_coord=WGS84`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
        },
      }
    );
  };

  // 현재 주소 받아오기
  const { data: regionData, isLoading: isLoading2 } = useQuery(
    ["RegionApi", location],
    regionApi,
    {
      refetchOnWindowFocus: false,
      onError: (e) => console.log(e),
      enabled: Boolean(location),
    }
  );

  // 이미지 추가 시 view 렌더 시 이미지 노출
  useEffect(() => {
    if (selectedImage == null && attachments.length !== 0) {
      setSelectImage(attachments[0]);
    }
    if (attachments.length === 0) {
      setSelectImage(null);
    }
    // 클릭한 이미지
    setSelectImage(attachments[selectedImageNum]);
  }, [attachments, selectedImage, selectedImageNum]);

  // 이미지 압축
  const compressImage = async (image: File) => {
    try {
      const options = {
        maxSizeMb: 2,
        maxWidthOrHeight: 700,
      };
      return await imageCompression(image, options);
    } catch (error) {
      console.log("에러", error);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const compressedImage = await compressImage(files[i]); // 이미지 압축
      const reader = new FileReader(); // 파일 이름 읽기

      /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
        Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
      if (files[i]) {
        reader.readAsDataURL(compressedImage);
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

  const setCroppedImageFor = (
    imageUrl: string,
    crop?: Point,
    zoom?: number,
    aspect?: { value: number; text: string },
    croppedImageUrl?: string
  ) => {
    const newAttachmentList = [...attachments];
    const attachmentIndex = attachments.findIndex(
      (x) => x?.imageUrl === imageUrl
    );
    const attachment = attachments[attachmentIndex];
    const newAttachment = {
      ...attachment,
      croppedImageUrl,
      crop,
      zoom,
      aspect,
    };
    newAttachmentList[attachmentIndex] = newAttachment;
    setAttachments(newAttachmentList);
    setSelectImage(null);
  };

  const onCancel = () => {
    setSelectImage(null);
  };

  const resetImage = (imageUrl: string) => {
    setCroppedImageFor(imageUrl);
  };

  const onRemoveImage = (res: { imageUrl: string }, index?: number) => {
    setAttachments(
      attachments.filter((image) => image.imageUrl !== res.imageUrl)
    );
    setSelectImage(null);
    const filterName = [...fileName];
    if (index === 0) {
      filterName.splice(index, 1);
    } else {
      filterName.splice(index, index);
    }
    setFileName(filterName);
    fileInput.current.value = "";
  };

  const onNextClick = () => {
    if (attachments.length !== 0) {
      setSelectImage(null);
      setIsNextClick((prev) => !prev);
    }
  };

  const onPrevClick = () => {
    setSelectImage(null);
    if (isNextClick) {
      return setIsNextClick(false);
    }
    if (attachments.length === 0) {
      return setShareBtn(false);
    }
    return shareBtnClick();
  };

  const queryClient = useQueryClient();

  // 피드 업로드
  const { mutate } = useMutation(
    (response: FeedType) =>
      axios.post("http://localhost:4000/api/feed", response),
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
      });
      toast.success("업로드 되었습니다.");
    }
  };

  return (
    <Modal open={shareBtn} onClose={shareBtnClick} disableScrollLock={false}>
      <>
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
                  src={`http://openweathermap.org/img/wn/${shareWeatherData?.weather[0].icon}@2x.png`}
                  alt="weather icon"
                />
              </WeatherIcon>
              <WeatherCategorySub>
                {shareWeatherData?.weather[0].description}
              </WeatherCategorySub>
              <WeatherCategorySub>
                {/* <CiTempHigh /> */}
                {Math.round(shareWeatherData?.main.temp)}º
              </WeatherCategorySub>
              <WeatherCategorySub>
                {/* <WiStrongWind /> */}
                {Math.round(shareWeatherData?.wind.speed)}
                <span>m/s</span>
              </WeatherCategorySub>
            </WeatherInfoBox>

            {!isNextClick ? (
              <NextBtn
                isDisabled={attachments.length === 0}
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
                  checkTag.etc == null
                }
              >
                <EditText>SHARE</EditText>
              </EditBtn>
            )}
          </Header>
          {!isNextClick && (
            <ShareImageCropper
              attachments={attachments}
              imageUrl={selectedImage?.imageUrl}
              cropInit={selectedImage?.crop}
              zoomInit={selectedImage?.zoom}
              aspectInit={selectedImage?.aspect}
              setCroppedImageFor={setCroppedImageFor}
              resetImage={resetImage}
            />
          )}

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
                          <ImageWrap
                            onMouseLeave={() => setFocus("")}
                            onMouseEnter={() => setFocus(index)}
                          >
                            {!isNextClick && focus === index && (
                              <CropBtn>
                                <BiCrop />
                                자르기
                              </CropBtn>
                            )}
                            <ImageRemove
                              onClick={() => {
                                onRemoveImage(attachments[index], index);
                                setIsNextClick(false);
                              }}
                            >
                              <IoMdClose />
                            </ImageRemove>
                            <Images
                              onClick={() => {
                                !isNextClick && setSelectImageNum(index);
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
              />
            </>
          )}
        </Container>
      </>
    </Modal>
  );
};

export default ShareWeatherModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 480px;
  /* height: 736px; */
  box-sizing: border-box;
  position: absolute;
  color: ${secondColor};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 8px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${mainColor}, 12px 12px ${secondColor};
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.header`
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  padding-right: 12px;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid ${thirdColor};
  position: sticky;
  background: rgba(255, 255, 255, 0.808);
  top: 0px;
  z-index: 10;
`;

const WeatherInfoBox = styled.div`
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: -0.8px;
  }
  font-size: 16px;
  font-weight: bold;

  user-select: none;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ImageWrapper = styled.div<{ length?: number }>`
  display: flex;
  width: 100%;
  gap: 12px;
  padding: 12px;
  align-items: center;
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
  -webkit-user-drag: none;
  cursor: pointer;
`;

const DateBox = styled.div`
  svg {
    margin-right: 2px;
    font-size: 14px;
    color: ${secondColor};
  }
`;

const NextBtn = styled.div<{ isDisabled: boolean }>`
  user-select: none;
  padding: 8px 10px;
  margin-left: auto;
  border: 1px solid ${(props) => (props.isDisabled ? thirdColor : mainColor)};
  color: ${(props) => (props.isDisabled ? thirdColor : mainColor)};
  border-radius: 9999px;
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: ${(props) => !props.isDisabled && mainColor};
    color: ${(props) => !props.isDisabled && "#fff"};
    border: ${(props) => !props.isDisabled && `1px solid ${mainColor}`};
  }
`;

const EditBtn = styled.button`
  user-select: none;
  padding: 8px 10px;
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
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px;
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
  width: 38px;
  height: 38px;
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
