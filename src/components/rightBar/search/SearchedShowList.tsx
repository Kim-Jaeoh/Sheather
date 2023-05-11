import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { dbService } from "../../../fbase";
import { HiHashtag } from "react-icons/hi";
import { Spinner } from "../../../assets/spinner/Spinner";
import { cloneDeep } from "lodash";
import { IoMdClose } from "react-icons/io";
import { localType } from "./SearchList";

type Props = {
  searched: localType[];
  setSearched: React.Dispatch<React.SetStateAction<localType[]>>;
  onListClick: (type: string, word: string, name?: string) => void;
};

const SearchedShowList = ({ searched, setSearched, onListClick }: Props) => {
  const [combineArray, setCombineArray] = useState([]);

  // 정보 가져온 뒤 새로운 배열로 반환
  useEffect(() => {
    const getList = async (res: localType) => {
      const user = res.type === "user";
      if (user) {
        const q = query(
          collection(dbService, "users"),
          where(`displayName`, "==", res.search)
        );

        const docSnap = await getDocs(q);
        const data = docSnap.docs.map((doc) => {
          return {
            at: res.at,
            type: res.type,
            search: res.search,
            email: doc.data().email,
            displayName: user ? doc.data().displayName : "",
            profileURL: user ? doc.data().profileURL : "",
            name: user ? doc.data().name : "",
          };
        });
        return data;
      } else {
        return {
          at: res.at,
          type: res.type,
          search: res.search,
          email: "",
          displayName: "",
          profileURL: "",
          name: "",
        };
      }
    };

    // map에서 Promise 방식 (병렬 처리)
    const showList = async () => {
      const uniqueArr = searched.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((t) => t.type === obj.type && t.search === obj.search)
      );

      const list = await Promise.all(
        uniqueArr.map((res) => {
          return getList(res);
        })
      );
      const spreadList = list.flat();
      setCombineArray(spreadList);
    };

    showList();
  }, [searched]);

  const onDelete = useCallback(
    (type: string, search: string) => {
      // 노출된 검색 내역 수정
      const filterCombineArray = cloneDeep(
        combineArray.filter(
          (res) => !(res.type === type && res.search === search)
        )
      );
      setCombineArray(filterCombineArray);

      // 키워드 수정 (localStorage 반영됨)
      const filterKeyword = cloneDeep(
        searched.filter((res) => !(res.type === type && res.search === search))
      );
      setSearched(filterKeyword);
    },
    [combineArray, searched, setSearched]
  );

  const onDeleteAll = () => {
    setCombineArray([]);
    setSearched([]);
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
          <SearchedListBox>
            {combineArray.length ? (
              combineArray
                .sort((a, b) => b.at - a.at)
                .map((res, index) => {
                  return (
                    <SearchedList key={index}>
                      {res.type === "tag" ? (
                        <List
                          onClick={() => onListClick("tag", res.search)}
                          to={`/explore/search?keyword=${res.search}`}
                        >
                          <SearchedImageBox>
                            <HiHashtag />
                          </SearchedImageBox>
                          <SearchedInfoBox>
                            <SearchedInfoName>{res.search}</SearchedInfoName>
                          </SearchedInfoBox>
                        </List>
                      ) : (
                        <List
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
                        </List>
                      )}
                      <Closebox
                        onClick={() => onDelete(res.type, res.search)}
                        type="button"
                      >
                        <IoMdClose />
                      </Closebox>
                    </SearchedList>
                  );
                })
            ) : (
              <Spinner />
            )}
          </SearchedListBox>
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

const DeleteAllBox = styled.div`
  width: 100%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 767px) {
    padding: 12px 0;
  }
`;

const Category = styled.p`
  font-size: 14px;
  color: var(--third-color);
`;

const DeleteAllBtn = styled.button`
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-weight: 500;
`;

const SearchedListBox = styled.ul`
  position: relative;
  overflow: hidden auto;
  height: 256px;
`;

const SearchedList = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
`;

const List = styled(Link)`
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
  @media (max-width: 767px) {
    padding: 12px 0;
  }
`;

const SearchedImageBox = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--fourth-color);
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
  color: var(--third-color);

  svg {
    width: 18px;
    height: 18px;
  }
  @media (max-width: 767px) {
    right: 0px;
  }
`;

const NotInfoBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--third-color);
`;

const NotInfo = styled.p``;
