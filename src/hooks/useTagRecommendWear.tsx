import React, { useState } from "react";
import toast from "react-hot-toast";

const useTagRecommendWear = () => {
  const [inputs, setInputs] = useState({
    RecommendNewTag: "",
    RecommendTags: [],
  });
  const { RecommendNewTag, RecommendTags } = inputs;

  const onChangeRecommend = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setInputs({
    //   ...inputs,
    //   [e.target.name]: e.target.value,
    // });
    // if (e.target.name === "RecommendNewTag") {
    setInputs((prev) => {
      return {
        ...prev,
        RecommendNewTag: e.target.value,
      };
    });
    // }
  };

  const onkeyPressRecommend = (e: React.KeyboardEvent<HTMLElement>) => {
    const pattern = /([^가-힣\x20])/i; // 자음, 모음 검사
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // 텍스트 전체 선택 안 돼서 주석 처리
      if (pattern.test(RecommendNewTag)) {
        toast.error("자음, 모음, 특수문자가 포함된 글자는 입력할 수 없습니다.");
      } else {
        if (RecommendTags.includes(RecommendNewTag)) {
          // 태그가 중복일 때
          toast.error("이미 추가된 태그입니다.");
        } else if (RecommendNewTag !== "") {
          onAddTag();
        }
      }
    }
  };

  const onAddTag = () => {
    if (RecommendTags.length <= 8) {
      setInputs({
        ...inputs,
        RecommendTags: [...RecommendTags, RecommendNewTag.trim()], // 글자 공백 제거
      });

      // 글자 지우기
      setInputs((prev) => {
        return {
          ...prev,
          RecommendNewTag: "",
        };
      });
    }
  };

  const onDeleteRecommendTag = (myTag: number | string) => {
    setInputs((prev) => {
      return {
        ...prev,
        RecommendTags: RecommendTags.filter((tag) => tag !== myTag),
      };
    });
  };

  const onDeleteRecommendText = () => {
    setInputs((prev) => {
      return {
        ...prev,
        RecommendNewTag: "",
      };
    });
  };

  return {
    RecommendNewTag,
    RecommendTags,
    onChangeRecommend,
    onkeyPressRecommend,
    onDeleteRecommendTag,
    onDeleteRecommendText,
  };
};

export default useTagRecommendWear;
