import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import getCroppedImg from "../../../assets/CropImage";
import ColorList from "../../../assets/ColorList";
import { AspectRatio, ImageType } from "../../../types/type";

type Props = {
  attachments?: ImageType[];
  // // imageUrl: string;
  // cropInit: Point;
  // zoomInit: number;
  // aspectInit: AspectRatio;
  setCroppedImageFor?: (
    imageUrl: string,
    crop?: Point,
    zoom?: number,
    aspect?: AspectRatio,
    croppedImageUrl?: string
  ) => void;

  imageUrl: string;
  zoom: number;
  crop: Point;
  aspect: AspectRatio;
  setCrop: React.Dispatch<React.SetStateAction<Point>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setAspect: React.Dispatch<React.SetStateAction<AspectRatio>>;
  setCroppedAreaPixels: React.Dispatch<any>;
  // resetImage?: (imageUrl: string) => void;
};

const aspectRatios = [
  // padding-top 계산 = (세로/가로 * 100)
  { value: 1 / 1, text: "1/1", paddingTop: 100 },
  { value: 3 / 4, text: "3/4", paddingTop: 132.8 },
  { value: 4 / 3, text: "4/3", paddingTop: 74.8 },
];

const ShareImageCropper = ({
  attachments,
  imageUrl,
  zoom,
  crop,
  aspect,
  setZoom,
  setCrop,
  setAspect,
  setCroppedAreaPixels,
  setCroppedImageFor,
}: // cropInit,
// zoomInit,
// aspectInit,
// resetImage,
Props) => {
  // const [zoom, setZoom] = useState(zoomInit);
  // const [crop, setCrop] = useState<Point>(cropInit);
  // const [aspect, setAspect] = useState<AspectRatio>(aspectInit);
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [num, setNum] = useState(0);

  useEffect(() => {
    // 비율 통일
    if (attachments) {
      attachments.map((res) => {
        res.aspect = aspect;
        // res.crop = crop;
        // res.zoom = zoom;
        return res;
        // return (res.aspect = aspect);
      });
    }
  }, [aspect, attachments, crop, zoom]);

  // useEffect(() => {
  //   if (zoomInit == null) {
  //     setZoom(1);
  //   } else {
  //     setZoom(zoomInit);
  //   }
  //   if (cropInit == null) {
  //     setCrop({ x: 0, y: 0 });
  //   } else {
  //     setCrop(cropInit);
  //   }
  //   if (aspectInit == null) {
  //     setAspect(aspectRatios[0]);
  //   } else {
  //     setAspect(aspectInit);
  //   }
  // }, [aspectInit, cropInit, zoomInit]);

  // useEffect(() => {
  //   if (zoomInit !== null && cropInit !== null) {
  //     setZoom(1);
  //     setCrop({ x: 0, y: 0 });
  //   }
  // }, [cropInit, imageUrl, zoomInit]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // const onCrop = async () => {
  //   const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
  //   setCroppedImageFor(imageUrl, crop, zoom, aspect, croppedImageUrl);
  // };

  const onResetImage = () => {
    setCroppedImageFor(imageUrl);
    // resetImage(imageUrl);
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

  const asd = new Image();
  asd.src = imageUrl;

  return (
    <Container>
      <CropBox attachments={imageUrl}>
        {imageUrl ? (
          <Cropper
            image={imageUrl}
            objectFit={
              // "auto-cover"
              asd.width > asd.height ? "vertical-cover" : "horizontal-cover"
            }
            // objectFit="auto-cover"
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
          {/* <ResetBtn onClick={onCrop}>
            <ResetText>CROP</ResetText>
          </ResetBtn> */}

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
`;

const CropBox = styled.div<{ attachments?: string }>`
  width: 100%;
  height: ${(props) => (props.attachments ? "476px" : "540px")};
  margin: 0 auto;
  border-bottom: 1px solid ${thirdColor};
  position: relative;

  div {
    width: 100%;
    height: 100%;
  }
`;

const PutImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  width: 100%;
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
