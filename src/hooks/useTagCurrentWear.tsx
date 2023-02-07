import { debounce } from "@mui/material";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useTagCurrentWear = () => {
  const [inputs, setInputs] = useState({
    currentNewTag: "",
    currentTags: [],
  });
  const { currentNewTag, currentTags } = inputs;

  const onChangeCurrent = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setInputs({
    //   ...inputs,
    //   [e.target.name]: e.target.value,
    // });
    // if (e.target.name === "currentNewTag") {
    setInputs((prev) => {
      return {
        ...prev,
        currentNewTag: e.target.value,
        // currentNewTag: prev.currentNewTag,
      };
    });
    // }
  };

  const onKeyPressCurrent = (e: React.KeyboardEvent<HTMLElement>) => {
    const pattern = /([^가-힣\x20])/i; // 자음, 모음 검사
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // 텍스트 전체 선택 안 돼서 주석 처리
      if (pattern.test(currentNewTag)) {
        toast.error("자음, 모음, 특수문자가 포함된 글자는 입력할 수 없습니다.");
      } else {
        if (currentTags.includes(currentNewTag)) {
          // 태그가 중복일 때
          toast.error("이미 추가된 태그입니다.");
        } else if (currentNewTag !== "") {
          onAddTag();
        }
      }
    }
  };

  const onAddTag = () => {
    if (currentTags.length < 8) {
      setInputs({
        ...inputs,
        currentTags: [...currentTags, currentNewTag.trim()], // 글자 공백 제거
      });
    } else {
      toast.error("최대 8개까지만 추가 가능합니다.");
    }

    // 글자 지우기
    setInputs((prev) => {
      return {
        ...prev,
        currentNewTag: "",
      };
    });
  };

  const onDeleteCurrentTag = (myTag: number | string) => {
    setInputs((prev) => {
      return {
        ...prev,
        currentTags: currentTags.filter((tag) => tag !== myTag),
      };
    });
  };

  const onDeleteCurrentText = () => {
    setInputs((prev) => {
      return {
        ...prev,
        currentNewTag: "",
      };
    });
  };

  return {
    currentNewTag,
    currentTags,
    onChangeCurrent,
    onKeyPressCurrent,
    onDeleteCurrentTag,
    onDeleteCurrentText,
  };
};

export default useTagCurrentWear;
