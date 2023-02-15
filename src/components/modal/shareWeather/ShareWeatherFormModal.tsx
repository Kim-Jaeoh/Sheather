import React, { useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { GrEmoji } from "react-icons/gr";
import { useEmojiModalOutClick } from "../../../hooks/useEmojiModalOutClick";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import ColorList from "../../../assets/ColorList";
import { toast } from "react-hot-toast";

type Props = {
  text?: string;
  setText?: React.Dispatch<React.SetStateAction<string>>;
};

const ShareWeatherFormModal = (props: Props) => {
  const { text, setText } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>();
  const emojiRef = useRef<HTMLDivElement>();

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

  return (
    <>
      <TextFormBox>
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
          </EditInfo>
        </BtnBox>
      </TextFormBox>
    </>
  );
};

export default ShareWeatherFormModal;

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

const TextFormBox = styled.div`
  width: 100%;
  overflow-x: hidden;
  /* border-bottom: 2px solid ${thirdColor}; */
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 244px;
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
  z-index: 9999;
`;

const EditInfo = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const TextAreaLength = styled.p`
  /* padding-right: 12px; */
  /* border-right: 1px solid ${thirdColor}; */
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
