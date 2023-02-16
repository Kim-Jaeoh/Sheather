import React, { useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { GrEmoji } from "react-icons/gr";
import { useEmojiModalOutClick } from "../../../hooks/useEmojiModalOutClick";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import ColorList from "../../../assets/ColorList";
import { toast } from "react-hot-toast";
import Emoji from "../../../assets/Emoji";

type Props = {
  text?: string;
  setText?: React.Dispatch<React.SetStateAction<string>>;
};

const ShareWeatherFormModal = (props: Props) => {
  const { text, setText } = props;

  const textRef = useRef<HTMLTextAreaElement>();

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  return (
    <TextFormBox>
      <TextArea
        spellCheck="false"
        maxLength={120}
        value={text}
        onChange={onChange}
        ref={textRef}
        placeholder="무슨 일이 일어나고 있나요?"
      />
      <BtnBox>
        <Emoji setText={setText} textRef={textRef} />
        <EditInfo>
          <TextAreaLength>
            <TextAreaLengthColor>
              {textRef?.current?.value
                ? textRef?.current?.value.trim().length
                : 0}
            </TextAreaLengthColor>
            /120
          </TextAreaLength>
        </EditInfo>
      </BtnBox>
    </TextFormBox>
  );
};

export default ShareWeatherFormModal;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const TextFormBox = styled.div`
  width: 100%;
  /* overflow-x: hidden; */
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
