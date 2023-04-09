import React from "react";

interface ClothesCategoryType {
  [key: string]: string[];
}

const TempClothes = () => {
  const tempClothes = [
    {
      tempMax: 40,
      tempMin: 27,
      clothes: ["민소매", "반팔", "반바지", "원피스"],
    },
    {
      tempMax: 27,
      tempMin: 23,
      clothes: ["반팔", "얇은 셔츠", "반바지", "긴 바지"],
    },
    {
      tempMax: 22,
      tempMin: 20,
      clothes: ["얇은 가디건", "긴팔", "셔츠", "긴 바지"],
    },
    {
      tempMax: 19,
      tempMin: 17,
      clothes: ["얇은 니트", "맨투맨", "가디건", "긴 바지"],
    },
    {
      tempMax: 16,
      tempMin: 12,
      clothes: ["자켓", "가디건", "야상", "스타킹", "긴 바지"],
    },
    {
      tempMax: 11,
      tempMin: 9,
      clothes: ["자켓", "트렌치코트", "야상", "니트", "긴 바지", "스타킹"],
    },
    {
      tempMax: 8,
      tempMin: 5,
      clothes: ["코트", "가죽 자켓", "히트텍", "니트", "레깅스"],
    },
    {
      tempMax: 4,
      tempMin: -4,
      clothes: ["패딩", "두꺼운 코트", "목도리", "기모 제품"],
    },
    {
      tempMax: -4,
      tempMin: -20,
      clothes: [
        "모자 달린 두꺼운 패딩",
        "두꺼운 스웨터",
        "귀마개",
        "털모자",
        "목도리",
        "방한 용품",
      ],
    },
  ];

  const ClothesCategory: ClothesCategoryType = {
    outer: [
      "없음",
      "얇은 가디건",
      "가디건",
      "자켓",
      "가죽자켓",
      "야상",
      "코트",
      "트렌치코트",
      "패딩",
      "모자 달린 두꺼운 패딩",
    ],
    top: [
      "없음",
      "민소매",
      "원피스",
      "반팔",
      "긴팔",
      "얇은 셔츠",
      "셔츠",
      "맨투맨",
      "후드티",
      "얇은 니트",
      "니트",
      "두꺼운 스웨터",
    ],
    innerTop: ["없음", "민소매", "반팔", "긴팔", "얇은 셔츠", "셔츠"],
    bottom: [
      "없음",
      "반바지",
      "긴 바지",
      "짧은 치마",
      "긴 치마",
      "스타킹",
      "레깅스",
    ],
    etc: [
      "없음",
      "히트텍",
      "목도리",
      "귀마개",
      "털모자",
      "기모 제품",
      "방한 용품",
    ],
  };
  return { tempClothes, ClothesCategory };
};

export default TempClothes;
