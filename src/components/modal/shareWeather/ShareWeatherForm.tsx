import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { GrEmoji } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { FiImage } from "react-icons/fi";
import { useHandleResizeTextArea } from "../../../hooks/useHandleResizeTextArea";
import { useEmojiModalOutClick } from "../../../hooks/useEmojiModalOutClick";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import imageCompression from "browser-image-compression";
import Slider from "react-slick";

type Props = {};

const ShareWeatherForm = (props: Props) => {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<string[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const emojiRef = useRef<HTMLDivElement>();
  const fileInput = useRef<HTMLInputElement>();
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
    // const textEmoji =
    //   text.slice(0, textAreaRef.current.selectionStart) +
    //   emojiData.emoji +
    //   text.slice(textAreaRef.current.selectionEnd, text.length);
    setText((prev) => prev + emojiData.emoji);
  };

  // 이미지 압축
  const compressImage = async (image: File) => {
    try {
      const options = {
        maxSizeMb: 1,
        maxWidthOrHeight: 800,
      };
      return await imageCompression(image, options);
    } catch (error) {
      console.log("에러", error);
    }
  };

  // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // const files = e.target.files!;
  //   const {
  //     currentTarget: { files },
  //   } = e;
  //   if (!files[0]) return;
  //   if (attachment.length + files.length > 10) {
  //     return alert("최대 10개 사진만 첨부할 수 있습니다.");
  //   }
  //   const readAndPreview = (file: any) => {
  //     if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
  //       const reader = new FileReader();
  //       reader.onload = () =>
  //         setAttachment((prev) => [...prev, reader.result as string]);
  //       reader.readAsDataURL(file);
  //     }
  //   };
  //   if (files) {
  //     Array.from(files).forEach(readAndPreview);
  //   }
  // };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;

    for (let i = 0; i < files.length; i++) {
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

        setAttachment((prev) => [...prev, result as string]);
      };
    }
  };

  const onClearAttachment = () => {
    setAttachment([]);
    fileInput.current.value = ""; // 취소 시 파일 문구 없애기
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  return (
    <>
      <TextFormBox>
        <Slider {...settings}>
          {attachment.map((res, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "block",
                  width: "100%",
                  height: "500px",
                  position: "relative",
                  borderBottom: "2px solid #222",
                }}
              >
                <img
                  src={res}
                  alt="upload file"
                  style={{
                    // display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    // backgroundImage: `url${res}`,
                    // backgroundSize: "cover",
                    // position: "absolute",
                    // left: 0,
                    // top: 0,
                    // right: 0,
                    // bottom: 0,
                    // backdropFilter: "blur(30px)",
                    // backfaceVisibility: "hidden",
                    // backgroundColor: "#ffffff6",
                  }}
                />
                {/* <img
                  src={res}
                  alt="upload file"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                  }}
                /> */}
              </div>
            );
          })}
        </Slider>
        <TextArea
          spellCheck="false"
          maxLength={280}
          value={text}
          // onInput={handleResizeHeight}
          onChange={onChange}
          ref={textAreaRef}
          placeholder="무슨 일이 일어나고 있나요?"
        />
      </TextFormBox>
      <BtnBox>
        <EmojiBox>
          <label htmlFor="attach-file">
            <FiImage />
          </label>
          <input
            id="attach-file"
            accept="image/*"
            multiple
            type="file"
            onChange={onFileChange}
          />
        </EmojiBox>
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
                height={350}
              />
            </Emoji>
          )}
        </EmojiBox>
      </BtnBox>
    </>
  );
};

export default ShareWeatherForm;

const TextFormBox = styled.form`
  width: 100%;
  /* padding: 20px; */
  overflow-x: hidden;
  border-bottom: 1px solid #dbdbdb;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 174px;
  font-size: 16px;
  line-height: 24px;
  resize: none;
  outline: none;
  border: none;
  padding: 20px;

  &:focus::placeholder {
    opacity: 0.4;
    color: #9e9e9e;
    transition: all 0.2s;
  }
`;

const BtnBox = styled.div`
  width: 100%;
`;

const EmojiBox = styled.div`
  /* width: 100%; */
  width: 34px;
  height: 34px;
  /* border: 1px solid red; */
  /* height: 48px; */
`;

const EmojiIcon = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;

  svg {
    font-size: 18px;
  }
`;

const Emoji = styled.div`
  position: absolute;
  /* height: 48px; */
`;
