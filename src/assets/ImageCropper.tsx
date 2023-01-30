import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "@emotion/styled";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import getCroppedImg from "./CropImage";
import { Modal } from "@mui/material";
import ColorList from "./ColorList";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { BiLeftArrowAlt } from "react-icons/bi";
import { MdOutlineRotateLeft } from "react-icons/md";

interface AspectRatio {
  value: number;
  text: string;
}

type Props = {
  onOpen: boolean;
  imageUrl: string;
  croppedImage: string; // crop할 이미지
  cropInit: Point;
  zoomInit: number;
  aspectInit: AspectRatio;
  onCancel?: MouseEventHandler<HTMLDivElement>;
  setCroppedImageFor?: (
    imageUrl: string,
    crop?: any,
    zoom?: number,
    aspect?: AspectRatio,
    croppedImageUrl?: string
  ) => void;
  resetImage?: (imageUrl: string) => void;
};

const ImageCropper = ({
  onOpen,
  imageUrl,
  croppedImage, // crop할 이미지
  cropInit,
  zoomInit,
  aspectInit,
  onCancel,
  setCroppedImageFor,
  resetImage,
}: Props) => {
  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState<Point>(cropInit);
  const [aspect, setAspect] = useState<AspectRatio>(aspectInit);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const aspectRatios = [
    { value: 1 / 1, text: "1/1" },
    { value: 3 / 4, text: "3/4" },
    { value: 4 / 3, text: "4/3" },
  ];

  useEffect(() => {
    if (zoomInit == null) {
      setZoom(1);
    }
    if (cropInit == null) {
      setCrop({ x: 0, y: 0 });
    }
    if (aspectInit == null) {
      setAspect(aspectRatios[0]);
    }
  }, [aspectInit, cropInit, zoomInit]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onAspectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e?.target?.value;
    const ratio = aspectRatios.find((ratio) => ratio.value === Number(value));
    setAspect(ratio);
  };

  const onCrop = async () => {
    const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
    setCroppedImageFor(imageUrl, crop, zoom, aspect, croppedImageUrl);
  };

  const onResetImage = () => {
    resetImage(imageUrl);
  };

  const [num, setNum] = useState(0);

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
    <Modal open={onOpen} onClose={onCancel} disableScrollLock={false}>
      <Container>
        <Header>
          <HeaderCategory onClick={onCrop}>
            <CropText>CROP</CropText>
          </HeaderCategory>
          <CloseBox onClick={onCancel}>
            <BiLeftArrowAlt />
          </CloseBox>
        </Header>
        {crop && zoom && aspect && (
          <CropBox>
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect.value}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </CropBox>
        )}
        <Controls>
          <ResetBtn onClick={onResetImage}>
            <ResetText>RESET</ResetText>
          </ResetBtn>

          <AspectBox>
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
      </Container>
    </Modal>
  );
};

export default ImageCropper;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  width: 480px;
  height: 700px;
  background: #fff;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  outline: none;
  border-radius: 12px;
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${mainColor}, 12px 12px #222222;
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

const CropBox = styled.div`
  position: absolute;
  top: 48px;
  left: 50%;
  right: 0;
  bottom: 0;
  transform: translate(-50%, 0%);
  width: 100%;
  height: 600px;
  margin: 0 auto;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    right: 0;
    bottom: 0;
    transform: translate(-50%, -50%);
  }
`;

const Controls = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
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
