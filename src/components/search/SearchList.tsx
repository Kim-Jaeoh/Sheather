import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { Link, useNavigate } from "react-router-dom";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import { collection, getDocs, query } from "firebase/firestore";
import { dbService } from "../../fbase";
import { CurrentUserType } from "../../app/user";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { HiHashtag } from "react-icons/hi";
import SearchedShowList from "./SearchedShowList";

type Props = {
  url: string;
  text: string;
  focus: boolean;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface localType {
  at?: number;
  type?: string;
  search?: string;
  tag?: string;
  displayName?: string;
  profileURL?: string;
  name?: string;
}

const SearchList = ({ url, text, focus, setFocus }: Props) => {
  const { currentUser: userObj } = useSelector((state: RootState) => {
    return state.user;
  });
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<localType[]>(
    JSON.parse(localStorage.getItem("keywords")) || []
  );
  const { ref, isLoading, dataList } = useInfinityScroll({
    url,
    count: 10,
  });
  const data = dataList?.pages?.flat();

  useEffect(() => {
    if (keywords.length) {
      // 중복 제거
      const uniqueArr = keywords.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((t) => t.type === obj.type && t.search === obj.search)
      );
      localStorage.setItem("keywords", JSON.stringify(uniqueArr));
    }
  }, [keywords, text]);

  useEffect(() => {
    const userInfo = async () => {
      const q = query(collection(dbService, "users"));
      const dataList = await getDocs(q);

      const userArray = dataList.docs.map((doc) => ({
        id: doc.id,
        uid: doc.id,
        ...doc.data(),
      }));

      setUsers(userArray);
      setLoading(true);
    };
    userInfo();
    return () => setLoading(false);
  }, [userObj.uid]);

  // 유저 목록
  const userResult = useMemo(() => {
    // if (users && text !== "") {
    const filterNameAndEmail = users?.filter((user: CurrentUserType) =>
      user.displayName.includes(text)
    );
    return filterNameAndEmail;
    // }
  }, [text, users]);

  const onListClick = (type: string, word: string, name: string) => {
    if (type === "tag") {
      setKeywords((prev: localType[]) => [
        { at: Date.now(), type: "tag", search: word, name: null },
        ...prev,
      ]);
    } else {
      setKeywords((prev: localType[]) => [
        { at: Date.now(), type: "user", search: word, name: name },
        ...prev,
      ]);
    }
    setFocus(false);
  };

  return (
    <SearchedBox focus={focus}>
      {text !== "" ? (
        <>
          {loading && data?.length !== 0 && data !== undefined && (
            <SearchedListBox>
              <SearchedList
                onClick={() => onListClick("tag", text, "")}
                to={`/explore/search?keyword=${text}`}
              >
                <SearchedImageBox>
                  <HiHashtag />
                </SearchedImageBox>
                <SearchedInfoBox>
                  <SearchedInfoName>{text}</SearchedInfoName>
                  <SearchedInfoDesc>
                    게시물 {dataList?.pages?.flat()?.length}
                  </SearchedInfoDesc>
                </SearchedInfoBox>
              </SearchedList>
            </SearchedListBox>
          )}
          {userResult?.map((res: CurrentUserType, index: number) => {
            return (
              <SearchedListBox key={index}>
                <SearchedList
                  onClick={() => onListClick("user", res.displayName, res.name)}
                  to={`/profile/${res.displayName}`}
                >
                  <SearchedImageBox>
                    <SearchedImage src={res.profileURL} />
                  </SearchedImageBox>
                  <SearchedInfoBox>
                    <SearchedInfoName>{res.displayName}</SearchedInfoName>
                    <SearchedInfoDesc>{res.name}</SearchedInfoDesc>
                  </SearchedInfoBox>
                </SearchedList>
              </SearchedListBox>
            );
          })}
          <div ref={ref} />
        </>
      ) : (
        <SearchedShowList
          text={text}
          keywords={keywords}
          setKeywords={setKeywords}
          onListClick={onListClick}
        />
      )}

      {focus && userResult?.length === 0 && data?.length === 0 && (
        <NotInfoBox>
          <NotInfo>검색 내역 없음</NotInfo>
        </NotInfoBox>
      )}
    </SearchedBox>
  );
};

export default SearchList;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const SearchedBox = styled.ul<{ focus: boolean }>`
  border: 2px solid ${(props) => (props.focus ? secondColor : fourthColor)};
  margin-top: ${(props) => (props.focus ? `14px` : `0`)};
  height: ${(props) => (props.focus ? `300px` : `0`)};
  opacity: ${(props) => (props.focus ? `1` : `0`)};
  transition: all 0.15s linear;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  box-shadow: ${(props) =>
    props.focus &&
    `0px 1px ${secondColor}, 0px 2px ${secondColor},
    0px 3px ${secondColor}, 0px 4px ${secondColor}`};
  /* border: 1px solid ${secondColor};
  margin-top: 12px;
  height: 300px;
  overflow: hidden;
  overflow-y: auto;
  opacity: 1; */
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
  cursor: pointer;
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
