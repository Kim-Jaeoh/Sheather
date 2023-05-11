import React from "react";
import styled from "@emotion/styled";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";

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

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CropBox = styled.div`
  width: 100%;
  flex: 1;
  margin: 0 auto;
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
