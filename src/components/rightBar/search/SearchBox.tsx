import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { IoIosCloseCircleOutline, IoMdArrowDropup } from "react-icons/io";
import SearchList, { localType } from "./SearchList";
import SearchedShowList from "./SearchedShowList";
import { IoSearchOutline } from "react-icons/io5";
import { debounce } from "lodash";

const SearchBox = () => {
  const [focus, setFocus] = useState(false);
  const [toggleAnimation, setToggleAnimation] = useState(false);
  const [text, setText] = useState("");
  const [url, setUrl] = useState(``);
  const [searched, setSearched] = useState<localType[]>(
    JSON.parse(localStorage.getItem("keywords")) || []
  );
  const inputRef = useRef(null);

  useEffect(() => {
    if (localStorage?.getItem("keywords")?.length) {
      // 중복 제거
      const uniqueArr = searched.filter(
        (obj, index, self) =>
          // obj = 처리할 현재 요소 / index = 처리할 현재 요소의 인덱스 / self = 순회하는 대상 배열
          index ===
          self.findIndex((t) => t.type === obj.type && t.search === obj.search)
      );
      localStorage.setItem("keywords", JSON.stringify(uniqueArr));
    } else {
      localStorage.setItem("keywords", JSON.stringify([]));
    }
  }, [searched, text]);

  const onChangeText = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setText(value);

    //  검색 목록 api
    setUrl(`${process.env.REACT_APP_SERVER_PORT}/api/search?keyword=${value}&`);
  }, 150);

  const onSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onDeleteText = () => {
    setText("");
    inputRef.current.value = "";
  };

  const onListClick = (type: string, word: string, name: string) => {
    if (type === "tag") {
      setSearched((prev: localType[]) => [
        { at: Date.now(), type: "tag", search: word, name: null },
        ...prev,
      ]);
    } else {
      setSearched((prev: localType[]) => [
        { at: Date.now(), type: "user", search: word, name: name },
        ...prev,
      ]);
    }
    setFocus(false);
  };

  // 검색 리스트 노출할 때 애니메이션
  const onListOpen = () => {
    setFocus(true);
    setToggleAnimation(true);
  };

  const onListClose = () => {
    setToggleAnimation(false);
    const delay = setTimeout(() => {
      setFocus(false);
    }, 100);
    return () => clearTimeout(delay);
  };

  return (
    <Container>
      <InputTextBox onSubmit={onSubmitText} focus={focus}>
        <IconBox htmlFor="search" focus={focus}>
          <IoSearchOutline />
        </IconBox>
        <SearchInput
          ref={inputRef}
          spellCheck="false"
          onFocus={onListOpen}
          // onBlur={onListClose}
          type="text"
          id="search"
          autoComplete="off"
          maxLength={12}
          // value={text}
          onChange={onChangeText}
          placeholder="검색어를 입력하세요"
        />
        {text !== "" && (
          <Closebox onClick={onDeleteText} type="button">
            <IoIosCloseCircleOutline />
          </Closebox>
        )}
        {focus && text === "" && (
          <Closebox onClick={onListClose} type="button">
            <IoMdArrowDropup />
          </Closebox>
        )}
      </InputTextBox>

      {focus && (
        <SearchedBox focus={focus} toggleAnimation={toggleAnimation}>
          {text !== "" ? (
            <SearchList text={text} url={url} onListClick={onListClick} />
          ) : (
            <SearchedShowList
              searched={searched}
              setSearched={setSearched}
              onListClick={onListClick}
            />
          )}
        </SearchedBox>
      )}
    </Container>
  );
};

export default SearchBox;

const Container = styled.article`
  width: 100%;
`;

const InputTextBox = styled.form<{ focus: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 2px solid
    ${(props) => (props.focus ? `var(--second-color)` : `var(--fourth-color)`)};
  border-radius: 20px;
  padding: 10px 40px 10px 10px;
  transition: all 0.15s linear;
  line-height: 0;
`;

const IconBox = styled.label<{ focus: boolean }>`
  margin-right: 10px;
  color: ${(props) =>
    props.focus ? `var(--second-color)` : `var(--third-color)`};
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
    color: var(--third-color);
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
  color: var(--third-color);

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchedBox = styled.div<{ focus: boolean; toggleAnimation: boolean }>`
  border: 2px solid
    ${(props) =>
      props.toggleAnimation ? `var(--second-color)` : `var(--fourth-color)`};
  margin-top: 14px;
  height: 300px;

  border-radius: 20px;
  position: relative;
  overflow: hidden;

  animation: ${(props) =>
    props.toggleAnimation ? `open 0.15s linear` : `close 0.1s linear`};

  @keyframes open {
    from {
      opacity: 0;
      height: 0;
    }
    to {
      opacity: 1;
      height: 300px;
    }
  }
  @keyframes close {
    from {
      opacity: 1;
      height: 300px;
    }
    to {
      opacity: 0;
      height: 0;
    }
  }
`;
