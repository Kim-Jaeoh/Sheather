import React from "react";

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
      clothes: ["반팔", "얇은 셔츠", "반바지", "면바지"],
    },
    {
      tempMax: 22,
      tempMin: 20,
      clothes: ["얇은 가디건", "긴팔", "면바지", "청바지"],
    },
    {
      tempMax: 19,
      tempMin: 17,
      clothes: ["얇은 니트", "맨투맨", "가디건", "청바지"],
    },
    {
      tempMax: 16,
      tempMin: 12,
      clothes: ["자켓", "가디건", "야상", "스타킹", "청바지", "면바지"],
    },
    {
      tempMax: 11,
      tempMin: 9,
      clothes: ["자켓", "트렌치코트", "야상", "니트", "청바지", "스타킹"],
    },
    {
      tempMax: 8,
      tempMin: 5,
      clothes: ["코트", "가죽 자켓", "히트텍", "니트", "레깅스"],
    },
    {
      tempMax: 4,
      tempMin: 0,
      clothes: ["패딩", "두꺼운 코트", "목도리", "기모 제품"],
    },
    {
      tempMax: 0,
      tempMin: -20,
      clothes: [
        "모자 달린 두꺼운 패딩",
        "두꺼운 스웨터",
        "귀마개",
        "목도리",
        "방한 용품",
      ],
    },
  ];

  return { tempClothes };
};

export default TempClothes;
