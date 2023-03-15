import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import ColorList from "../assets/ColorList";
import { FiSearch } from "react-icons/fi";
import { debounce } from "lodash";
import { IoIosCloseCircleOutline, IoMdArrowDropup } from "react-icons/io";
import SearchList from "../components/search/SearchList";

const RightBar = () => {
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState("");
  const [url, setUrl] = useState(``);
  const textRef = useRef(null);

  useEffect(() => {
    const isHashtag = text.includes("#") ? text.split("#")[1] : text; // 해시태그 유무
    setUrl(
      `${process.env.REACT_APP_SERVER_PORT}/api/search?keyword=${isHashtag}&`
    );
  }, [text]);

  const onChangetext = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setText(value);
  }, 200);

  const onSubmittext = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onDeletetext = () => {
    setText("");
    textRef.current.value = "";
  };

  return (
    <Container>
      <SearchBox>
        <InputtextBox onSubmit={onSubmittext} focus={focus}>
          <IconBox htmlFor="search">
            <FiSearch />
          </IconBox>
          <SearchInput
            spellCheck="false"
            onFocus={() => setFocus(true)}
            // onBlur={() => setFocus(false)}
            type="text"
            id="search"
            autoComplete="off"
            maxLength={12}
            // defaultValue={text ? text : ""}
            // value={text}
            ref={textRef}
            onChange={onChangetext}
            placeholder="검색어를 입력하세요"
          />
          {text !== "" && (
            <Closebox onClick={onDeletetext} type="button">
              <IoIosCloseCircleOutline />
            </Closebox>
          )}
          {focus && text === "" && (
            <Closebox onClick={() => setFocus(false)} type="button">
              <IoMdArrowDropup />
            </Closebox>
          )}
        </InputtextBox>
        <SearchList text={text} url={url} focus={focus} setFocus={setFocus} />
      </SearchBox>
      <div
        style={{ height: "300px", border: `1px solid red`, marginTop: "20px" }}
      >
        안뇽하삼
      </div>
    </Container>
  );
};

export default RightBar;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.section`
  flex: 0 1 auto;
  width: 290px;
  height: 100vh;
  background: #fff;
  position: sticky;
  top: 0;
  border: 2px solid ${secondColor};
  padding: 20px;
`;

const SearchBox = styled.article``;

const InputtextBox = styled.form<{ focus: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid ${(props) => (props.focus ? secondColor : fourthColor)};
  border-radius: 8px;
  padding: 10px 40px 10px 10px;
  transition: all 0.15s linear;
  line-height: 0;
`;

const IconBox = styled.label`
  /* margin-left: -8px; */
  margin-right: 10px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchInput = styled.input`
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;

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

const Closebox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  color: ${thirdColor};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchedBox = styled.ul<{ focus: boolean }>`
  border: ${(props) =>
    props.focus ? `1px solid ${secondColor}` : `0px solid ${secondColor}`};
  margin-top: ${(props) => (props.focus ? `12px` : `0`)};
  height: ${(props) => (props.focus ? `300px` : `0`)};
  opacity: ${(props) => (props.focus ? `1` : `0`)};
  transition: all 0.15s linear;
  border-radius: 8px;
  border: 1px solid ${secondColor};
  margin-top: 12px;
  height: 300px;
  overflow: hidden;
  overflow-y: auto;
  opacity: 1;
`;

const SearchedListBox = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px;
`;

const SearchedList = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  gap: 12px;
`;

const SearchedImageBox = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${fourthColor};
  border-radius: 50%;
  overflow: hidden;
`;

const SearchedImage = styled.img`
  display: block;
  /* width: 100%; */
  /* height: 100%; */
  /* display: inline-block; */
  /* content: ""; */
  /* border: none; */
  /* outline: none; */
`;

const SearchedInfoBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
  line-height: 20px;
`;

const SearchedInfoName = styled.p`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SearchedInfoDesc = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
