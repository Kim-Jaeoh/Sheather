import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import Emoji from "../../../assets/Emoji";
import useTag from "../../../hooks/useTag";
import { IoMdClose } from "react-icons/io";
import { AiOutlineTag } from "react-icons/ai";
import { BiTag } from "react-icons/bi";
import useMediaScreen from "../../../hooks/useMediaScreen";

type Props = {
  bgColor?: string;
  text?: string;
  tags?: string[];
  setText?: React.Dispatch<React.SetStateAction<string>>;
  setTags?: React.Dispatch<React.SetStateAction<string[]>>;
};

const ShareWeatherForm = ({ bgColor, text, tags, setText, setTags }: Props) => {
  const textRef = useRef<HTMLTextAreaElement>();
  const { isDesktop, isTablet, isMobile, isMobileBefore, RightBarNone } =
    useMediaScreen();

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const {
    currentNewTag,
    currentTags,
    onChangeCurrent,
    onKeyPressCurrent,
    onDeleteCurrentTag,
    onDeleteCurrentText,
  } = useTag(tags);

  useEffect(() => {
    setTags(currentTags);
  }, [currentTags, setTags]);

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
      <TagBox>
        <EmojiIcon htmlFor="tag">
          <BiTag />
        </EmojiIcon>
        <TagList>
          {currentTags.map((myTag, index) => (
            <Tag
              color={bgColor}
              onClick={(e) => onDeleteCurrentTag(myTag)}
              key={myTag.concat(`${index}`)}
            >
              <span>#</span>
              <TagName>{myTag}</TagName>
              <TagButton type="button">
                <IoMdClose />
              </TagButton>
            </Tag>
          ))}
          <InputTagBox>
            <span>#</span>
            <Input
              id="tag"
              name="newTag"
              type="text"
              autoComplete="off"
              value={currentNewTag}
              onChange={onChangeCurrent}
              onKeyDown={onKeyPressCurrent}
              placeholder="태그 입력"
            />
          </InputTagBox>
        </TagList>
      </TagBox>
      <BtnBox>
        {!isMobile && (
          <Emoji setText={setText} textRef={textRef} right={32} bottom={-10} />
        )}
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
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  flex: 1 0 244px;
  height: 244px;
  font-size: 14px;
  line-height: 24px;
  resize: none;
  outline: none;
  border: none;
  padding: 14px;
  border-bottom: 1px solid ${thirdColor};

  &::placeholder {
    font-size: 14px;
  }
  &::placeholder:not(:focus) {
    transition: all 0.15s;
    opacity: 1;
  }

  &:focus::placeholder {
    opacity: 0.4;
    color: ${thirdColor};
    transition: all 0.15s;
  }
`;

const BtnBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
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

const TagBox = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${thirdColor};
  padding: 14px;
`;

const InputTagBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  line-height: 16px;
  border-radius: 64px;
  background-color: #f7f7f7;
  overflow: hidden;
  span {
    position: absolute;
    font-size: 14px;
    left: 10px;
  }
`;

const EmojiIcon = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  margin-right: 14px;
  svg {
    transform: rotate(180deg);
    width: 20px;
    height: 20px;
  }
`;

const TagList = styled.ul`
  display: flex;
  align-items: center;
  font-size: 14px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Input = styled.input`
  width: 58px;
  max-width: 100%;
  /* caret-color: ${mainColor}; */
  padding: 8px 10px 8px 24px;
  box-sizing: content-box;
  outline: none;
  border: none;
  background: transparent;
  &::placeholder:not(:focus) {
    transition: all 0.15s;
    opacity: 1;
  }

  &:focus::placeholder {
    opacity: 0.4;
    color: ${thirdColor};
    transition: all 0.15s;
  }
`;

const Tag = styled.li<{ color?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  line-height: 16px;
  border-radius: 64px;
  background-color: #f7f7f7;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
  span {
    position: absolute;
    font-size: 14px;
    left: 10px;
  }

  span,
  div {
    color: ${(props) => props.color};
  }
`;

const TagButton = styled.button`
  cursor: pointer;
  padding: 0;
  position: absolute;
  font-size: 14px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${secondColor};
`;

const TagName = styled.div`
  padding: 8px 32px 8px 24px;
  font-weight: 500;
`;
