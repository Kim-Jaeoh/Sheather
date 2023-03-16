import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import ColorList from "../assets/ColorList";
import { FiSearch } from "react-icons/fi";
import { debounce } from "lodash";
import { IoIosCloseCircleOutline, IoMdArrowDropup } from "react-icons/io";
import SearchList from "../components/search/SearchList";
import useDebounce from "../hooks/useDebounce";

const RightBar = () => {
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState("");
  const [debounceText, setDebounceText] = useState("");
  const [url, setUrl] = useState(``);
  const textRef = useRef(null);
  const debouncedSearchTerm = useDebounce(text, 200);

  // 검색 목록 api
  useEffect(() => {
    console.log("머였더라");
    const isHashtag = debounceText.includes("#")
      ? debounceText.split("#")[1]
      : debounceText; // 해시태그 유무
    setUrl(
      `${process.env.REACT_APP_SERVER_PORT}/api/search?keyword=${isHashtag}&`
    );
  }, [debounceText]);

  // debounce된 text 유무
  useEffect(() => {
    if (debouncedSearchTerm) {
      setDebounceText(debouncedSearchTerm);
    } else {
      setDebounceText("");
    }
  }, [debouncedSearchTerm]);

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setText(value);
  };

  const onSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onFocus = () => {
    setFocus(true);
  };

  const onDeleteText = useCallback(() => {
    setText("");
    // textRef.current.value = "";
  }, []);

  return (
    <Container>
      <SearchBox>
        <InputTextBox onSubmit={onSubmitText} focus={focus}>
          <IconBox htmlFor="search">
            <FiSearch />
          </IconBox>
          <SearchInput
            spellCheck="false"
            onFocus={onFocus}
            // onBlur={() => setFocus(false)}
            type="text"
            id="search"
            autoComplete="off"
            maxLength={12}
            value={text}
            // ref={textRef}
            onChange={onChangeText}
            placeholder="검색어를 입력하세요"
          />
          {text !== "" && (
            <Closebox onClick={onDeleteText} type="button">
              <IoIosCloseCircleOutline />
            </Closebox>
          )}
          {focus && text === "" && (
            <Closebox onClick={() => setFocus(false)} type="button">
              <IoMdArrowDropup />
            </Closebox>
          )}
        </InputTextBox>
        <SearchList
          text={debounceText}
          url={url}
          focus={focus}
          setFocus={setFocus}
        />
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

const InputTextBox = styled.form<{ focus: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 2px solid ${(props) => (props.focus ? secondColor : fourthColor)};
  border-radius: 20px;
  padding: 10px 40px 10px 10px;
  transition: all 0.15s linear;
  line-height: 0;
`;

const IconBox = styled.label`
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
