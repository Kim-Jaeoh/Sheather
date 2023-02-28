import React, { useCallback, useRef } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import Emoji from "../../../assets/Emoji";

type Props = {
  bgColor?: string;
  text?: string;
  setText?: React.Dispatch<React.SetStateAction<string>>;
};

const ShareWeatherForm = ({ bgColor, text, setText }: Props) => {
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
        <Emoji setText={setText} textRef={textRef} right={32} bottom={-10} />
        <EditInfo>
          <TextAreaLength>
            <TextAreaLengthColor bgColor={bgColor}>
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

export default ShareWeatherForm;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const TextFormBox = styled.div`
  width: 100%;
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

const TextAreaLengthColor = styled.span<{ bgColor: string }>`
  color: ${(props) => props.bgColor}; ;
`;
