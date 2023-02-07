import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import styled from "@emotion/styled";
import { GrEmoji } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { FiImage } from "react-icons/fi";
import { useHandleResizeTextArea } from "../../../hooks/useHandleResizeTextArea";
import { useEmojiModalOutClick } from "../../../hooks/useEmojiModalOutClick";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import imageCompression from "browser-image-compression";
import Slider from "react-slick";
import ImageCropper from "../../../assets/ImageCropper";
import { IoMdClose } from "react-icons/io";
import { Point } from "react-easy-crop";
import ColorList from "../../../assets/ColorList";
import { toast } from "react-hot-toast";
import { BsFillImageFill } from "react-icons/bs";
import { BiCrop } from "react-icons/bi";

type Props = {};

const ShareWeatherForm = (props: Props) => {
  const [text, setText] = useState("");
  const [focus, setFocus] = useState(null);
  const [clickImage, setClickImage] = useState(false);
  const [clickImageNum, setClickImageNum] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectImage] = useState(null);
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const emojiRef = useRef<HTMLDivElement>();
  const fileInput = useRef<HTMLInputElement>();
  const [fileName, setFileName] = useState([]);

  const { handleResizeHeight } = useHandleResizeTextArea(textAreaRef);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  // 이모지 모달 밖 클릭 시 창 닫기
  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick(
    emojiRef,
    textAreaRef
  );

  // 텍스트 옆에 이모지 추가
  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // 이미지 압축
  const compressImage = async (image: File) => {
    try {
      const options = {
        maxSizeMb: 2,
        maxWidthOrHeight: 900,
      };
      return await imageCompression(image, options);
    } catch (error) {
      console.log("에러", error);
    }
  };

  // // 방법 1. forEach()
  // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // const files = e.target.files!;
  //   const {
  //     currentTarget: { files },
  //   } = e;
  //   if (!files[0]) return;
  //   if (attachments.length + files.length > 3) {
  //     fileInput.current.value = ""; // 파일 문구 없애기
  //     return alert("최대 3개 사진만 첨부할 수 있습니다.");
  //   }
  //   const readAndPreview = async (file: any) => {
  //     if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
  //       const reader = new FileReader();
  //       reader.onload = () =>
  //         setAttachments((prev) => [
  //           ...prev,
  //           {
  //             imageUrl: reader.result,
  //             crop: null,
  //             zoom: null,
  //             aspect: null,
  //             croppedImageUrl: null,
  //           },
  //         ]);
  //       const compressedImage = await compressImage(file);
  //       reader.readAsDataURL(compressedImage);
  //     }
  //   };
  //   if (files) {
  //     Array.from(files).forEach(readAndPreview);
  //   }
  //   console.log(files.length);
  // };

  // 방법 2. for()
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setSelectImage(null);
  };

  const onCancel = () => {
    setSelectImage(null);
  };

  const resetImage = (imageUrl: string) => {
    setCroppedImageFor(imageUrl);
  };

  const onRemoveImage = (res: { imageUrl: string; name?: string }) => {
    setAttachments(
      attachments.filter((image) => image.imageUrl !== res.imageUrl)
    );
    fileInput.current.value = "";
  };

  const onImageClick = (index: number) => {
    setClickImage((prev) => !prev);
    setClickImageNum(index);
  };

  return (
    <>
      <TextFormBox>
        <Wrapper length={attachments.length}>
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
                  multiple
                  ref={fileInput}
                  required
                  type="file"
                  onChange={onFileChange}
                />
              </EmojiBox>
              <ImageLength>
                <ImageLengthColor>{attachments.length}</ImageLengthColor>/3
              </ImageLength>
            </ImageBox>
          </InputImageLabel>
          {selectedImage ? (
            <ImageCropper
              onOpen={Boolean(selectedImage)}
              imageUrl={selectedImage.imageUrl}
              cropInit={selectedImage.crop}
              zoomInit={selectedImage.zoom}
              aspectInit={selectedImage.aspect}
              onCancel={onCancel}
              setCroppedImageFor={setCroppedImageFor}
              resetImage={resetImage}
            />
          ) : (
            <>
              {attachments?.map((res, index) => {
                return (
                  <ImageContainer key={index}>
                    {clickImage && index === clickImageNum && (
                      <WatchImageWrapper>
                        <WatchImageBox>
                          <CloseBox onClick={() => onImageClick(index)}>
                            <IoMdClose />
                          </CloseBox>
                          <WatchImage
                            src={
                              res.croppedImageUrl
                                ? res.croppedImageUrl
                                : res.imageUrl
                            }
                            alt=""
                          />
                        </WatchImageBox>
                      </WatchImageWrapper>
                    )}
                    <ImageBox length={attachments.length}>
                      <ImageWrap
                        onMouseLeave={() => setFocus("")}
                        onMouseEnter={() => setFocus(index)}
                      >
                        {focus === index && (
                          <CropBtn
                            onClick={() => {
                              setSelectImage(res);
                            }}
                          >
                            <BiCrop />
                            자르기
                          </CropBtn>
                        )}
                        <ImageRemove onClick={() => onRemoveImage(res)}>
                          <IoMdClose />
                        </ImageRemove>
                        <Images
                          onClick={() => onImageClick(index)}
                          src={
                            res.croppedImageUrl
                              ? res.croppedImageUrl
                              : res.imageUrl
                          }
                          alt=""
                        />
                      </ImageWrap>
                    </ImageBox>
                  </ImageContainer>
                );
              })}
            </>
          )}
        </Wrapper>

        <TextArea
          spellCheck="false"
          maxLength={120}
          value={text}
          onChange={onChange}
          ref={textAreaRef}
          placeholder="무슨 일이 일어나고 있나요?"
        />
        <BtnBox>
          <EmojiBox ref={emojiRef}>
            <EmojiIcon onClick={toggleEmoji}>
              <GrEmoji />
            </EmojiIcon>
            {/* 해결: clickEmoji이 true일 때만 실행해서 textarea 버벅이지 않음 */}
            {clickEmoji && (
              <Emoji>
                <EmojiPicker
                  searchDisabled={true}
                  lazyLoadEmojis={true}
                  onEmojiClick={onEmojiClick}
                  width={340}
                  height={340}
                />
              </Emoji>
            )}
          </EmojiBox>
          <EditInfo>
            <TextAreaLength>
              <TextAreaLengthColor>
                {textAreaRef?.current?.value
                  ? textAreaRef?.current?.value.trim().length
                  : 0}
              </TextAreaLengthColor>
              /120
            </TextAreaLength>
            <EditBtn>
              <EditText>SHARE</EditText>
            </EditBtn>
          </EditInfo>
        </BtnBox>
      </TextFormBox>
    </>
  );
};

export default ShareWeatherForm;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const ImageContainer = styled.div``;

const WatchImageWrapper = styled.div`
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

const CloseBox = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;

  &:hover,
  &:focus {
    color: ${mainColor};
  }

  svg {
    font-size: 24px;
  }
`;

const WatchImage = styled.img`
  width: 100%;
  object-fit: contain;
  display: block;
`;

const TextFormBox = styled.form`
  width: 100%;
  overflow-x: hidden;
  /* border-bottom: 2px solid ${thirdColor}; */
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 280px;
  font-size: 16px;
  line-height: 24px;
  resize: none;
  outline: none;
  border: none;
  padding: 20px;
  border-bottom: 1px solid ${thirdColor};

  &::placeholder {
    font-size: 14px;
  }
  &:focus::placeholder {
    opacity: 0.4;
    color: ${thirdColor};
    transition: all 0.2s;
  }
`;

const BtnBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
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

const Emoji = styled.div`
  position: absolute;
  top: -294px;
  left: -360px;
`;

const EditInfo = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const TextAreaLength = styled.p`
  padding-right: 12px;
  border-right: 1px solid ${thirdColor};
`;

const TextAreaLengthColor = styled.span`
  color: ${mainColor}; ;
`;

const EditBtn = styled.button`
  user-select: none;
  padding: 8px 10px;
  margin-left: 12px;
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

const EditText = styled.p`
  font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
  margin-bottom: -4px;
`;

const Wrapper = styled.div<{ length?: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 12px;
  gap: 16px;
  justify-content: flex-start;
  /* justify-content: space-between; */
  /* height: ${(props) =>
    props.length > 0 && `calc(480px / ${props.length})`}; */
  /* min-width: 480px; */
  /* max-height: 480px; */
  overflow: hidden;
  border-bottom: 1px solid ${thirdColor};
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

const ImageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageLength = styled.p`
  font-size: 14px;
`;

const ImageLengthColor = styled.span`
  color: ${mainColor};
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

const InputImageLabel = styled.label`
  cursor: pointer;
`;

const InputImage = styled.input`
  display: none;
  opacity: 0;
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
