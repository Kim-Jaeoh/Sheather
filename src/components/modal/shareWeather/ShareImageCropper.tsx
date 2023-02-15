import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "@emotion/styled";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import getCroppedImg from "../../../assets/CropImage";
import { Modal } from "@mui/material";
import ColorList from "../../../assets/ColorList";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { BiCrop, BiLeftArrowAlt } from "react-icons/bi";
import { MdOutlineRotateLeft } from "react-icons/md";
import { AspectRatio, ImageType } from "../../../types/type";

type Props = {
  imageUrl: string;
  cropInit: Point;
  zoomInit: number;
  aspectInit: AspectRatio;
  onCancel?: MouseEventHandler<HTMLDivElement>;
  setCroppedImageFor?: (
    imageUrl: string,
    crop?: Point,
    zoom?: number,
    aspect?: AspectRatio,
    croppedImageUrl?: string
  ) => void;
  resetImage?: (imageUrl: string) => void;
  // onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  attachments?: ImageType[];
  isNextClick: boolean;
};

const aspectRatios = [
  // padding-top 계산 = (세로/가로 * 100)
  { value: 1 / 1, text: "1/1", paddingTop: 100 },
  { value: 3 / 4, text: "3/4", paddingTop: 132.8 },
  { value: 4 / 3, text: "4/3", paddingTop: 74.8 },
];

const ShareImageCropper = ({
  imageUrl,
  cropInit,
  zoomInit,
  aspectInit,
  attachments,
  isNextClick,
  onCancel,
  setCroppedImageFor,
  // onCropComplete,
  resetImage,
}: Props) => {
  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState<Point>(cropInit);
  const [aspect, setAspect] = useState<AspectRatio>(aspectInit);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [vieImage, setViewImage] = useState(null);
  const [num, setNum] = useState(0);

  useEffect(() => {
    // 비율 통일
    if (attachments) {
      attachments.map((res) => {
        res.aspect = aspect;
        res.crop = crop;
        res.zoom = zoom;
        return res;
      });
    }
  }, [aspect, attachments, crop, zoom]);

  useEffect(() => {
    if (zoomInit == null) {
      setZoom(1);
    } else {
      setZoom(zoomInit);
    }
    if (cropInit == null) {
      setCrop({ x: 0, y: 0 });
    } else {
      setCrop(cropInit);
    }
    if (aspectInit == null) {
      setAspect(aspectRatios[0]);
    } else {
      setAspect(aspectInit);
    }
  }, [aspectInit, cropInit, zoomInit]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
    setCroppedImageFor(imageUrl, crop, zoom, aspect, croppedImageUrl);
    // attachments.forEach(async (res) => {
    //   const croppedImageUrl = await getCroppedImg(
    //     res.imageUrl,
    //     croppedAreaPixels
    //   );
    //   setCroppedImageFor(
    //     res.imageUrl,
    //     res.crop,
    //     res.zoom,
    //     res.aspect,
    //     croppedImageUrl
    //   );
    // });
  };

  const onResetImage = () => {
    resetImage(imageUrl);
  };

  useEffect(() => {
    if (aspect?.value === aspectRatios[0].value) {
      setNum(0);
    } else if (aspect?.value === aspectRatios[1].value) {
      setNum(1);
    } else if (aspect?.value === aspectRatios[2].value) {
      setNum(2);
    }
  }, [aspect]);

  return (
    <Container>
      <CropBox attachments={imageUrl}>
        {imageUrl ? (
          <Cropper
            image={imageUrl}
            objectFit="vertical-cover"
            crop={crop}
            zoom={zoom}
            aspect={aspect?.value}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        ) : (
          <PutImageBox>하단의 이미지 버튼을 눌러 추가해주세요</PutImageBox>
        )}
      </CropBox>
      {imageUrl && (
        <Controls>
          <ResetBtn onClick={onCrop}>
            <ResetText>CROP</ResetText>
          </ResetBtn>

          <AspectBox>
            <ResetBtn onClick={onResetImage}>
              <ResetText>RESET</ResetText>
            </ResetBtn>
            <AspectValue
              onClick={() => setAspect(aspectRatios[0])}
              num={num}
              select={0}
              style={{
                padding: "12px",
                width: "24px",
                height: "24px",
              }}
            >
              1:1
            </AspectValue>
            <AspectValue
              onClick={() => setAspect(aspectRatios[1])}
              num={num}
              select={1}
              style={{
                padding: "16px 12px",
                width: "24px",
                height: "32px",
              }}
            >
              3:4
            </AspectValue>
            <AspectValue
              onClick={() => setAspect(aspectRatios[2])}
              num={num}
              select={2}
              style={{
                padding: "12px 16px",
                width: "32px",
                height: "24px",
              }}
            >
              4:3
            </AspectValue>
          </AspectBox>
        </Controls>
      )}
    </Container>
  );
};

export default ShareImageCropper;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  width: 100%;
  /* height: 100%; */
  /* height: 736px; */
  /* background: blue;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  outline: none;
  border-radius: 12px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${mainColor}, 12px 12px #222222; */
`;

const Header = styled.header`
  height: 52px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid ${secondColor};
  padding: 0 12px;
  position: sticky;
  background: rgba(255, 255, 255, 0.808);
  top: 0px;
  backdrop-filter: blur(12px);
  z-index: 10;
`;

const HeaderCategory = styled.button`
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

const CropText = styled.p`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px;
`;

const CloseBox = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover,
  &:focus {
    color: #48a3ff;
  }

  svg {
    font-size: 24px;
  }
`;

const CropBox = styled.div<{ attachments?: string }>`
  /* position: absolute;
  top: 52px;
  left: 50%;
  right: 0;
  bottom: 0;
  transform: translate(-50%, 0%); */
  width: 100%;
  /* height: 476px; */
  height: ${(props) => (props.attachments ? "476px" : "540px")};
  margin: 0 auto;
  border-bottom: 1px solid ${thirdColor};
  position: relative;

  div {
    width: 100%;
    height: 100%;
    /* position: absolute;
    top: 50%;
    left: 50%;
    right: 0;
    bottom: 0;
    z-index: 999;
    transform: translate(-50%, -50%); */
  }
`;

const PutImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  /* position: absolute;
  left: 0;
  bottom: 0; */
  width: 100%;
  /* height: 60px; */
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid ${thirdColor};
`;

const AspectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const AspectValue = styled.div<{ select: number; num: number }>`
  display: flex;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  border: 2px solid ${secondColor};
  border-radius: 2px;
  font-weight: bold;
  color: ${(props) => (props.select === props.num ? "#fff" : secondColor)};
  background: ${(props) => (props.select === props.num ? secondColor : "#fff")};
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
`;

const ImageContainer = styled.div``;

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

const ResetBtn = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 4px 8px;
  border-radius: 9999px;
  border: 1px solid ${thirdColor};
  color: ${thirdColor};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${thirdColor};
    color: #fff;
    border: 1px solid ${thirdColor};
  }
`;

const ResetText = styled.p`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -3px;
`;
