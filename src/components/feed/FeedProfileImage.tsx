import styled from "@emotion/styled";
import { Skeleton } from "@mui/material";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { UserType } from "../../app/user";
import defaultAccount from "../../assets/account_img_default.png";
import ColorList from "../../assets/ColorList";
import { Spinner } from "../../assets/Spinner";
import { dbService } from "../../fbase";
import { FeedType } from "../../types/type";

type Props = {
  displayName: string;
};

const FeedProfileImage = ({ displayName }: Props) => {
  const [account, setAccount] = useState(null);

  // 계정 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", displayName),
      (doc) => setAccount(doc.data())
    );
    return () => unsubscribe();
  }, [displayName]);

  return (
    <>
      {account ? (
        <UserImage src={account?.profileURL} alt="" />
      ) : (
        <Skeleton
          variant="rounded"
          width={"100%"}
          height={"100%"}
          sx={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
    </>
  );
};

export default FeedProfileImage;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const UserImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  image-rendering: auto;
`;
