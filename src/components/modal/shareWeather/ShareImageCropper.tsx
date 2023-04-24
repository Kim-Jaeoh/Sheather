import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import getCroppedImg from "../../ImageCropper/CropImage";
import ColorList from "../../../assets/data/ColorList";
import { AspectRatio, ImageType } from "../../../types/type";
import { FiCrop } from "react-icons/fi";
import { BiImageAdd } from "react-icons/bi";

type Props = {
  attachments?: ImageType[];
  selectedImage?: ImageType;

  setCroppedImageFor?: (
    name: string,
    crop?: Point,
    zoom?: number,
    aspect?: AspectRatio,
    croppedImageUrl?: string
  ) => void;
};

const aspectRatios = [
  // padding-top 계산 = (세로/가로 * 100)
  { value: 1 / 1, text: "1/1", paddingTop: 100 },
  { value: 3 / 4, text: "3/4", paddingTop: 132.8 },
  { value: 4 / 3, text: "4/3", paddingTop: 74.8 },
];

const ShareImageCropper = React.forwardRef<HTMLButtonElement, Props>(
  ({ attachments, selectedImage, setCroppedImageFor }, ref) => {
    const imageUrl = selectedImage?.imageUrl;
    const zoomInit = selectedImage?.zoom;
    const cropInit = selectedImage?.crop;
    const aspectInit = selectedImage?.aspect;
    const [zoom, setZoom] = useState(zoomInit);
    const [crop, setCrop] = useState<Point>(cropInit);
    const [aspect, setAspect] = useState<AspectRatio>(aspectInit);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    const [num, setNum] = useState(0);

    useEffect(() => {
      // 비율 통일
      if (attachments) {
        attachments?.map((res) => {
          return (res.aspect = aspect);
          // res.crop = crop;
          // res.zoom = zoom;
          // return (res.aspect = aspect);
        });
      }
    }, [aspect, attachments]);

    useEffect(() => {
      if (!zoomInit) {
        setZoom(1);
      } else {
        setZoom(zoomInit);
      }
      if (!cropInit) {
        setCrop({ x: 0, y: 0 });
      } else {
        setCrop(cropInit);
      }
      if (!aspectInit) {
        setAspect(aspectRatios[0]);
      } else {
        setAspect(aspectInit);
      }
    }, [aspectInit, cropInit, zoomInit]);

    useEffect(() => {
      if (aspect?.value === aspectRatios[0].value) {
        setNum(0);
      } else if (aspect?.value === aspectRatios[1].value) {
        setNum(1);
      } else if (aspect?.value === aspectRatios[2].value) {
        setNum(2);
      }
    }, [aspect?.value, aspectInit?.value]);

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    };

    const onCrop = async () => {
      const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
      setCroppedImageFor(
        selectedImage.name,
        crop,
        zoom,
        aspect,
        croppedImageUrl
      );
    };

    // 선택된 이미지 정보 저장
    const SetImageInfo = () => {
      if (selectedImage) {
        const attachmentIndex = attachments.findIndex(
          (x) => x?.name === selectedImage.name
        );
        attachments[attachmentIndex].crop = crop;
        attachments[attachmentIndex].zoom = zoom;
        attachments[attachmentIndex].aspect = aspect;
      }
    };

    const getImageSize = new Image();
    getImageSize.src = imageUrl;

    return (
      <Container>
        <CropBox attachments={imageUrl}>
          {imageUrl ? (
            <Cropper
              image={imageUrl}
              // objectFit={
              //   "vertical-cover"
              //   // "auto-cover"
              //   // getImageSize?.width >= getImageSize?.height ? "vertical-cover" : "horizontal-cover"
              // }
              crop={crop}
              zoom={zoom}
              aspect={aspect?.value}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onInteractionEnd={SetImageInfo}
            />
          ) : (
            <NotInfoBox>
              <IconBox>
                <Icon>
                  <BiImageAdd />
                </Icon>
              </IconBox>
              <NotInfoCategory>이미지 추가</NotInfoCategory>
              <NotInfoText>하단의 이미지 버튼을 눌러 추가해주세요.</NotInfoText>
            </NotInfoBox>
          )}
        </CropBox>
        {imageUrl && (
          <Controls>
            <AspectBox>
              {/* <ResetBtn onClick={onResetImage}>
              <ResetText>RESET</ResetText>
            </ResetBtn> */}
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
            <CropBtn
              isCrop={Boolean(selectedImage.croppedImageUrl)}
              onClick={onCrop}
              ref={ref}
            >
              <FiCrop />
            </CropBtn>
          </Controls>
        )}
      </Container>
    );
  }
);

export default ShareImageCropper;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  width: 100%;
  /* height: 476px; */

  @media (max-width: 767px) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

const CropBox = styled.div<{ attachments?: string }>`
  width: 100%;
  /* flex: 1; */
  height: 476px;
  /* height: ${(props) => (props.attachments ? "476px" : "540px")}; */
  margin: 0 auto;
  border-bottom: 1px solid ${thirdColor};
  position: relative;

  @media (max-width: 767px) {
    /* flex: 1; */
    height: 100%;
  }
`;

const PutImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const Controls = styled.div`
  width: 100%;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid ${thirdColor};
  position: relative;
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

const CropBtn = styled.button<{ isCrop?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  padding: 6px;
  font-size: 16px;
  color: #fff;
  border: 2px solid ${(props) => (props.isCrop ? mainColor : secondColor)};
  background: ${(props) => (props.isCrop ? mainColor : secondColor)};
  border-radius: 9999px;
  transition: all 0.2s;
  z-index: 99;
  outline: auto;

  &:hover,
  &:active {
    background-color: ${mainColor};
  }
`;

const ResetText = styled.p`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -3px;
`;

const NotInfoBox = styled.div`
  /* width: 100%; */
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  /* padding-bottom: 30px; */
`;

const NotInfoCategory = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
`;

const IconBox = styled.div`
  border: 2px solid ${secondColor};
  border-radius: 50%;
  width: 70px;
  height: 70px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  /* width: 100%; */
  /* height: 100%; */
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
    margin-top: 6px;
    margin-left: 4px;
    > path:last-of-type {
      /* color: #ff5c1b; */
      color: #48a3ff;
    }
  }
`;

const NotInfoText = styled.p`
  font-size: 14px;
`;
