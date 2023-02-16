import { Modal } from "@mui/material";
import styled from "@emotion/styled";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import toast, { Toaster } from "react-hot-toast";
import ColorList from "../../../assets/ColorList";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TempClothes from "../../../assets/TempClothes";
import { VisibilityContext, ScrollMenu } from "react-horizontal-scrolling-menu";
import Flicking from "@egjs/react-flicking";
import "../../../styles/flicking.css";
import { CiTempHigh } from "react-icons/ci";
import { WiStrongWind } from "react-icons/wi";
import { TbWindmill } from "react-icons/tb";
import { BsFillImageFill, BsWind } from "react-icons/bs";
import { BiCrop, BiLeftArrowAlt } from "react-icons/bi";
import ShareImageCropper from "./ShareImageCropper";
import { Area, Point } from "react-easy-crop/types";
import imageCompression from "browser-image-compression";
import getCroppedImg from "../../../assets/CropImage";
import MultiImageInput from "react-multiple-image-input";
import ShareWeatherForm from "./ShareWeatherForm";
import axios from "axios";
import useCurrentLocation from "../../../hooks/useCurrentLocation";
import { useQuery } from "@tanstack/react-query";
import { MdPlace } from "react-icons/md";
import uuid from "react-uuid";

type Props = {
  shareBtn: boolean;
  setShareBtn: React.Dispatch<React.SetStateAction<boolean>>;
  shareBtnClick: () => void;
};

const ShareWeatherImage = ({ shareBtn, setShareBtn, shareBtnClick }: Props) => {
  const [select, setIsCurrentCheck] = useState(null);
  const [outerCheck, setOuterCheck] = useState(null);
  const [topCheck, setTopCheck] = useState(null);
  const [innerTopCheck, setInnerTopCheck] = useState(null);
  const [bottomCheck, setBottomCheck] = useState(null);
  const [etcCheck, setEtcCheck] = useState(null);
  const [focus, setFocus] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectImage] = useState(null);
  const fileInput = useRef<HTMLInputElement>();
  const [fileName, setFileName] = useState([]);
  const [text, setText] = useState("");
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const shareWeatherData = useSelector((state: RootState) => {
    return state.weather;
  });
  const { ClothesCategory } = TempClothes();

  const CurrentEmoji = [
    ["🥵 더워요"],
    ["😥 조금 더워요"],
    ["😄 적당해요"],
    ["😬 조금 추워요"],
    ["🥶 추워요"],
  ];

  const onClick = (index: number, name: string) => {
    if (name === "current") {
      setIsCurrentCheck(index);
    }
    if (name === "outer") {
      setOuterCheck(index);
    }
    if (name === "top") {
      setTopCheck(index);
    }
    if (name === "innerTop") {
      setInnerTopCheck(index);
    }
    if (name === "bottom") {
      setBottomCheck(index);
    }
    if (name === "etc") {
      setEtcCheck(index);
    }
  };

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

    if (attachments.length + files.length > 3) {
      fileInput.current.value = ""; // 파일 문구 없애기
      return toast.error("최대 3장의 사진만 첨부할 수 있습니다.");
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
    // setSelectImage(null);
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

  const [isNextClick, setIsNextClick] = useState(false);
  const onNextClick = () => {
    if (attachments.length !== 0) {
      setSelectImage(null);
      setIsNextClick((prev) => !prev);
    }
  };

  const onPrevClick = () => {
    if (isNextClick) {
      return setIsNextClick(false);
    }
    if (attachments.length === 0) {
      return setShareBtn(false);
    }
    return shareBtnClick();
  };

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNextClick) {
      await axios
        .post("http://localhost:4000/api/feed", {
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
          feel: CurrentEmoji[select],
          wearInfo: {
            outer: ClothesCategory.outer[outerCheck],
            top: ClothesCategory.top[topCheck],
            innerTop: ClothesCategory.innerTop[innerTopCheck],
            bottom: ClothesCategory.bottom[bottomCheck],
            etc: ClothesCategory.etc[etcCheck],
          },
          weatherInfo: {
            temp: Math.round(shareWeatherData?.main.temp),
            wind: Math.round(shareWeatherData?.wind.speed),
            weatherIcon: shareWeatherData?.weather[0].icon,
            weather: shareWeatherData?.weather[0].description,
          },
          region: regionData?.data?.documents[0]?.address?.region_1depth_name,
          reply: [],
        })
        .then((e) => {
          setShareBtn(false);
        });
    }
  };

  // 이미지 추가 시 view에 자동으로 노출하기 위함
  useEffect(() => {
    if (selectedImage == null && attachments.length !== 0) {
      setSelectImage(attachments[0]);
    }
    if (attachments.length === 0) {
      setSelectImage(null);
    }
  }, [attachments, selectedImage]);

  return (
    <Modal open={shareBtn} onClose={shareBtnClick} disableScrollLock={false}>
      <>
        <Toaster position="bottom-left" reverseOrder={false} />
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
                {/* {!shareWeatherData?.dt_txt ? (
                  "오늘 지금"
                ) : (
                  <>
                    {shareWeatherData?.dt_txt?.split("-")[2].split(" ")[0]}일
                    &nbsp;
                    {shareWeatherData?.dt_txt?.split(":")[0].split(" ")[1]}시
                  </>
                )} */}
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
                  select == null ||
                  outerCheck == null ||
                  topCheck == null ||
                  innerTopCheck == null ||
                  bottomCheck == null ||
                  etcCheck == null
                }
              >
                <EditText>SHARE</EditText>
              </EditBtn>
            )}
          </Header>
          {!isNextClick && (
            <ShareImageCropper
              imageUrl={selectedImage?.imageUrl}
              cropInit={selectedImage?.crop}
              zoomInit={selectedImage?.zoom}
              aspectInit={selectedImage?.aspect}
              isNextClick={isNextClick}
              onCancel={onCancel}
              setCroppedImageFor={setCroppedImageFor}
              resetImage={resetImage}
              attachments={attachments}
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
                  <ImageLengthColor>{attachments.length}</ImageLengthColor>/3
                </ImageLength>
              </ImageBox>
            </InputImageLabel>

            {Array.from({ length: 3 })?.map((res, index) => {
              return (
                <ImageContainer key={index}>
                  {attachments[index] ? (
                    <ImageBox length={attachments.length}>
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
                            !isNextClick && setSelectImage(attachments[index]);
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
          </ImageWrapper>
          {isNextClick && (
            <ShareWeatherForm
              text={text}
              select={select}
              outerCheck={outerCheck}
              topCheck={topCheck}
              innerTopCheck={innerTopCheck}
              bottomCheck={bottomCheck}
              etcCheck={etcCheck}
              setText={setText}
              setOuterCheck={setOuterCheck}
              setInnerTopCheck={setInnerTopCheck}
              setBottomCheck={setBottomCheck}
              setEtcCheck={setEtcCheck}
              onClick={onClick}
            />
          )}
        </Container>
      </>
    </Modal>
  );
};

export default ShareWeatherImage;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.form`
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
  width: 480px;
  height: 736px;
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
  /* justify-content: space-between; */
  border-radius: 12px 12px 0 0;
  border-bottom: 2px solid ${secondColor};
  /* padding: 0 12px; */
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
    /* font-size: 14px; */
    /* font-weight: bold; */
    /* color: ${mainColor}; */
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
  /* flex: 1; */
  width: 100%;
  /* height: 100%; */
  gap: 16px;
  padding: 20px;
  align-items: center;
  justify-content: space-evenly;
  /* height: ${(props) =>
    props.length > 0 && `calc(480px / ${props.length})`}; */
  /* min-width: 480px; */
  /* max-height: 480px; */
  overflow: hidden;
  position: relative;
  /* border-bottom: 1px solid ${thirdColor}; */
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
  /* width: ${(props) => props.length > 0 && `calc(100% / ${props.length})`};
  height: ${(props) => props.length > 0 && `calc(480px / ${props.length})`}; */
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

const ImageContainer = styled.div`
  flex: 1;
`;

const WatchImageImageWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  background: rgba(0, 0, 0, 0.8);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WatchImageBox = styled.div`
  max-width: 900px;
  max-height: 900px;
  position: relative;
`;

const WatchImage = styled.img`
  width: 100%;
  object-fit: contain;
  display: block;
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

const HeaderCategory = styled.div`
  user-select: none;
  margin-left: auto;
  padding: 8px 10px;
  border: 1px solid ${mainColor};
  color: ${mainColor};
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: ${mainColor};
    color: #fff;
    border: 1px solid ${mainColor};
  }
`;

const DateBox = styled.div`
  svg {
    margin-right: 2px;
    font-size: 14px;
    color: ${secondColor};
  }
  /* border: 1px solid ${mainColor}; */
  /* border-radius: 9999px; */
  /* padding: 4px 8px; */
  /* font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px; */
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

const WeatherCategoryBox = styled.div`
  display: flex;
  /* flex-wrap: wrap; */
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* gap: 28px; */
  padding: 12px;
  border-bottom: 2px solid ${thirdColor};
`;

const WeatherCategoryText = styled.div`
  display: flex;
  align-items: center;
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

const WeatherCategoryMain = styled.span`
  border: 1px solid ${thirdColor};
  color: ${thirdColor};
  border-radius: 9999px;
  padding: 4px 8px;
  margin-right: 10px;
  font-size: 12px;
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

const WearInfoBox = styled.section`
  width: 100%;
  border-bottom: 1px solid ${thirdColor};
`;

const WearCondition = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 12px;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${thirdColor};
  }
`;

const TagBox = styled.div`
  display: flex;
  user-select: none;
  flex: nowrap;
  gap: 8px;
`;

const Tag = styled.div`
  font-size: 12px;
  display: flex;
  flex: 0 0 auto;
`;

const TagInput = styled.input`
  margin-top: 2px;
  margin-right: 4px;
  display: none;
`;

const TagLabel = styled.label<{ select: number; index: number }>`
  gap: 12px;
  padding: 6px 8px;
  border: 1px solid
    ${(props) =>
      props.select === props.index ? `${mainColor}` : `${thirdColor}`};
  border-radius: 4px;
  cursor: pointer;
  color: ${(props) => props.select === props.index && `#fff`};
  background: ${(props) =>
    props.select === props.index ? `${mainColor}` : "transparent"};
`;

const AddTagBox = styled.div`
  padding: 0 2px;
`;

const AddTag = styled.div`
  gap: 12px;
  padding: 6px 8px;
  border: 1px solid ${thirdColor};
  border-radius: 4px;
  cursor: pointer;
`;
const WearDetailBox = styled.div`
  overflow: hidden;
  padding: 12px;
  &:not(:last-of-type) {
    /* border-bottom: 2px solid ${thirdColor}; */
  }
`;

const WearInfo = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-of-type) {
    margin-bottom: 12px;
  }
`;

const WearInfoMain = styled.div<{ select: number; select2?: number }>`
  flex: 0 0 auto;
  user-select: text;
  /* border: 1px solid ${thirdColor}; */
  /* color: ${thirdColor}; */
  font-weight: ${(props) =>
    props.select !== null || props?.select2 === 1 ? "bold" : "normal"};
  color: ${(props) =>
    props.select !== null || props?.select2 === 1 ? mainColor : thirdColor};
  /* border-radius: 9999px; */
  min-width: 55px;
  text-align: center;
  /* padding: 4px 6px; */
  padding-right: 6px;
  border-right: 1px solid ${thirdColor};
  font-size: 12px;
  margin-right: 12px;
`;

const TagButton = styled.button`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    color: ${thirdColor};
    font-size: 16px;
  }
`;
