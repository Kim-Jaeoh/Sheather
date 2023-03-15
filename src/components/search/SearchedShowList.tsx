import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import ColorList from "../../assets/ColorList";
import { doc, getDoc } from "firebase/firestore";
import { CurrentUserType } from "../../app/user";
import { dbService } from "../../fbase";
import { HiHashtag } from "react-icons/hi";
import { Spinner } from "../../assets/Spinner";
import { cloneDeep } from "lodash";

type Props = {
  keywords: localType[];
  onListClick: (type: string, word: string) => void;
};

interface localType {
  at: number;
  type: string;
  search: string;
  tag?: string;
  displayName?: string;
  profileURL?: string;
  name?: string;
}

const SearchedShowList = ({ keywords, onListClick }: Props) => {
  const [combineArray, setCombineArray] = useState([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const userArray = () => {
      let arr: localType[] = [];
      const uniqueArr = keywords.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((t) => t.type === obj.type && t.search === obj.search)
      );
      uniqueArr.map(async (res: localType) => {
        if (res.type === "user") {
          const docRef = doc(dbService, "users", res.search);
          const docSnap = await getDoc(docRef);
          arr.push({
            displayName: docSnap.data().displayName,
            profileURL: docSnap.data().profileURL,
            name: docSnap.data().name,
            type: "user",
            search: docSnap.data().displayName,
            at: res.at,
          });
        } else {
          arr.push({
            tag: res.search,
            at: res.at,
            type: "tag",
            search: res.search,
          });
        }
      });
      setIsLoading(true);
      setCombineArray(arr);
    };

    userArray();
  }, [keywords]);

  return (
    <>
      {loading ? (
        <>
          {combineArray
            .sort((a, b) => b.at - a.at)
            .map((res, index) => {
              return (
                <SearchedListBox key={index}>
                  {res.tag ? (
                    <SearchedList
                      onClick={() => onListClick("tag", res.tag)}
                      to={`/explore/search?keyword=${res.tag}`}
                    >
                      <SearchedImageBox>
                        <HiHashtag />
                      </SearchedImageBox>
                      <SearchedInfoBox>
                        <SearchedInfoName>{res.tag}</SearchedInfoName>
                      </SearchedInfoBox>
                    </SearchedList>
                  ) : (
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
                  )}
                </SearchedListBox>
              );
            })}
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default SearchedShowList;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

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
