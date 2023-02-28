import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import getCroppedImg from "../../../assets/CropImage";
import ColorList from "../../../assets/ColorList";
import { AspectRatio, ImageType } from "../../../types/type";

type Props = {
  previewImage: string;
  zoom: number;
  crop: Point;
  setCrop: React.Dispatch<React.SetStateAction<Point>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setCroppedAreaPixels: React.Dispatch<any>;
};

const ProfileImageCropper = ({
  previewImage,
  zoom,
  crop,
  setZoom,
  setCrop,
  setCroppedAreaPixels,
}: Props) => {
  // const [zoom, setZoom] = useState(1);
  // const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Container>
      <CropBox>
        {previewImage ? (
          <Cropper
            style={{ cropAreaStyle: { border: "none" } }}
            image={previewImage}
            objectFit="vertical-cover"
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            cropShape="round"
          />
        ) : (
          <PutImageBox>하단의 이미지 버튼을 눌러 추가해주세요</PutImageBox>
        )}
      </CropBox>
    </Container>
  );
};

export default ProfileImageCropper;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* position: relative; */
`;

const CropBox = styled.div`
  width: 100%;
  flex: 1;
  margin: 0 auto;
  /* border-bottom: 1px solid ${secondColor}; */
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
