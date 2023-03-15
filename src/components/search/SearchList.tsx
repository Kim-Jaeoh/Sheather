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

interface localType {
  at: number;
  type: string;
  search: string;
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
    count: 6,
  });
  const navigate = useNavigate();

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
    if (text !== "") {
      const userInfo = async () => {
        const q = query(collection(dbService, "users"));
        const data = await getDocs(q);

        const userArray = data.docs.map((doc) => ({
          id: doc.id,
          uid: doc.id,
          ...doc.data(),
        }));

        // // 본인 제외 노출
        // const exceptArray = userArray.filter(
        //   (name: { uid: string }) => name.uid !== userObj.uid
        // );
        setUsers(userArray);
        setLoading(true);
      };
      userInfo();
    }
    return () => setLoading(false);
  }, [text, userObj.uid]);

  // 유저 목록
  const userResult = useMemo(() => {
    if (users && !text.includes(" ")) {
      const filterNameAndEmail = users?.filter((user: CurrentUserType) =>
        user.displayName.includes(text)
      );
      return filterNameAndEmail;
    }
  }, [text, users]);

  const onListClick = (type: string, word: string) => {
    if (type === "tag") {
      setKeywords((prev: localType[]) => [
        { at: Date.now(), type: "tag", search: word },
        ...prev,
      ]);
    } else {
      setKeywords((prev: localType[]) => [
        { at: Date.now(), type: "user", search: word },
        ...prev,
      ]);
    }
    setFocus(false);
  };

  return (
    <SearchedBox focus={focus}>
      {text !== "" && (
        <>
          {data?.length !== 0 && data !== undefined && (
            <SearchedListBox>
              <SearchedList
                onClick={() => onListClick("tag", text)}
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
                  onClick={() => onListClick("user", res.displayName)}
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
      )}

      {text === "" && (
        <>
          {keywords?.length === 0 ? (
            <NotInfoBox>
              <NotInfo>최근 검색 내역 없음</NotInfo>
            </NotInfoBox>
          ) : (
            <>
              {
                <SearchedShowList
                  keywords={keywords}
                  onListClick={onListClick}
                />
              }
            </>
          )}
        </>
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
  border: ${(props) =>
    props.focus ? `1px solid ${secondColor}` : `0px solid ${secondColor}`};
  margin-top: ${(props) => (props.focus ? `12px` : `0`)};
  height: ${(props) => (props.focus ? `300px` : `0`)};
  opacity: ${(props) => (props.focus ? `1` : `0`)};
  transition: all 0.15s linear;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
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
