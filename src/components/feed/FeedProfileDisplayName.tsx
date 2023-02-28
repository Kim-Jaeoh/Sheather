import styled from "@emotion/styled";
import { Skeleton } from "@mui/material";
import {
  getDoc,
  doc,
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { UserType } from "../../app/user";
import defaultAccount from "../../assets/account_img_default.png";
import ColorList from "../../assets/ColorList";
import { Spinner } from "../../assets/Spinner";
import { dbService } from "../../fbase";
import { FeedType } from "../../types/type";

type Props = {
  email: string;
};

const FeedProfileDisplayName = ({ email }: Props) => {
  const [account, setAccount] = useState(null);

  // // 계정 정보 가져오기
  // useEffect(() => {
  //   const getAccount = async () => {
  //     const docSnap = await getDoc(doc(dbService, "users", email));
  //     setAccount(docSnap.data());
  //   };
  //   getAccount();
  // }, [email]);

  // 계정 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", email), (doc) => setAccount(doc.data()));
  }, [email]);

  return (
    <>
      {account ? (
        <UserName>{account?.displayName}</UserName>
      ) : (
        <SkeletonBox>
          <Skeleton
            variant="rectangular"
            width={"90%"}
            height={"100%"}
            sx={{ position: "absolute", top: 0, left: 0 }}
          />
        </SkeletonBox>
      )}
    </>
  );
};

export default FeedProfileDisplayName;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const UserName = styled.p``;

const SkeletonBox = styled.div`
  padding: 8px;
  position: relative;
`;
