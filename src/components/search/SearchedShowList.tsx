import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import ColorList from "../../assets/ColorList";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import { CurrentUserType } from "../../app/user";
import { dbService } from "../../fbase";
import { HiHashtag } from "react-icons/hi";
import { Spinner } from "../../assets/Spinner";
import { cloneDeep } from "lodash";
import { IoIosCloseCircleOutline, IoMdClose } from "react-icons/io";
import { localType } from "./SearchList";

type Props = {
  text: string;
  keywords: localType[];
  setKeywords: React.Dispatch<React.SetStateAction<localType[]>>;
  onListClick: (type: string, word: string, name?: string) => void;
};

const SearchedShowList = ({
  text,
  keywords,
  setKeywords,
  onListClick,
}: Props) => {
  const [combineArray, setCombineArray] = useState([]);

  // 정보 가져오기
  useEffect(() => {
    const getList = async (res: localType) => {
      const user = res.type === "user";
      const docRef = doc(dbService, "users", String(user && res.search));
      const docSnap = await getDoc(docRef);
      return {
        at: res.at,
        type: res.type,
        search: res.search,
        displayName: user ? docSnap?.data()?.displayName : "",
        profileURL: user ? docSnap?.data()?.profileURL : "",
        name: user ? docSnap?.data()?.name : "",
      };
    };

    // 1. for of 방식 (순차 처리)
    // const listResult = async () => {
    //   let arr: localType[] = [];
    //   // 중복 제거
    //   const uniqueArr = keywords.filter(
    //     (obj, index, self) =>
    //       index ===
    //       self.findIndex((t) => t.type === obj.type && t.search === obj.search)
    //   );

    //   for (const res of uniqueArr) {
    //     let result = await getList(res);
    //     arr.push(result);
    //   }
    //   setCombineArray(arr);
    // };
    // listResult();

    // 2. map에서 Promise 방식 (병렬 처리)
    const showList = async () => {
      const uniqueArr = keywords.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((t) => t.type === obj.type && t.search === obj.search)
      );

      const list = await Promise.all(
        uniqueArr.map((res) => {
          return getList(res);
        })
      );
      setCombineArray(list);
    };

    showList();
  }, [keywords]);

  const onDelete = (type: string, search: string) => {
    // 노출된 검색 내역 수정
    const filterCombineArray = combineArray.filter(
      (res) => !(res.type === type && res.search === search)
    );
    setCombineArray(filterCombineArray);

    // 키워드 수정 (localStorage 반영됨)
    const filterKeyword = cloneDeep(
      keywords.filter((res) => !(res.type === type && res.search === search))
    );
    setKeywords(filterKeyword);
  };

  const onDeleteAll = () => {
    setCombineArray([]);
    setKeywords([]);
    localStorage.setItem("keywords", JSON.stringify([]));
  };

  return (
    <>
      {JSON.parse(localStorage.getItem("keywords"))?.length ? (
        <>
          <DeleteAllBox>
            <Category>최근 검색 목록</Category>
            <DeleteAllBtn onClick={onDeleteAll} type="button">
              모두 지우기
            </DeleteAllBtn>
          </DeleteAllBox>
          {combineArray.length ? (
            combineArray
              .sort((a, b) => b.at - a.at)
              .map((res, index) => {
                return (
                  <SearchedListBox key={index}>
                    {res.type === "tag" ? (
                      <SearchedList
                        onClick={() => onListClick("tag", res.search)}
                        to={`/explore/search?keyword=${res.search}`}
                      >
                        <SearchedImageBox>
                          <HiHashtag />
                        </SearchedImageBox>
                        <SearchedInfoBox>
                          <SearchedInfoName>{res.search}</SearchedInfoName>
                        </SearchedInfoBox>
                      </SearchedList>
                    ) : (
                      <SearchedList
                        onClick={() =>
                          onListClick("user", res.search, res.name)
                        }
                        to={`/profile/${res.search}`}
                      >
                        <SearchedImageBox>
                          <SearchedImage src={res.profileURL} />
                        </SearchedImageBox>
                        <SearchedInfoBox>
                          <SearchedInfoName>{res.search}</SearchedInfoName>
                          <SearchedInfoDesc>{res.name}</SearchedInfoDesc>
                        </SearchedInfoBox>
                      </SearchedList>
                    )}
                    <Closebox
                      onClick={() => onDelete(res.type, res.search)}
                      type="button"
                    >
                      <IoMdClose />
                    </Closebox>
                  </SearchedListBox>
                );
              })
          ) : (
            <Spinner />
          )}
        </>
      ) : (
        <NotInfoBox>
          <NotInfo>최근 검색 내역 없음</NotInfo>
        </NotInfoBox>
      )}
    </>
  );
};

export default SearchedShowList;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const DeleteAllBox = styled.div`
  width: 100%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Category = styled.p`
  font-size: 14px;
  color: ${thirdColor};
`;

const DeleteAllBtn = styled.button`
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-weight: 500;
`;

const SearchedListBox = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
`;

const SearchedList = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  gap: 12px;
  padding: 12px;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }
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
  width: 100%;
  height: 100%;
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
    width: 18px;
    height: 18px;
  }
`;

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  /* margin: 0 auto; */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${thirdColor};
`;

const NotInfo = styled.p``;
