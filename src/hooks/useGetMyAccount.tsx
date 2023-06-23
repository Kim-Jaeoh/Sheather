import React, { useEffect, useState } from "react";
import { onSnapshot, doc, DocumentData } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { dbService } from "../fbase";
import { CurrentUserType } from "../types/type";

const useGetMyAccount = () => {
  const { isLoggedIn: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [myAccount, setMyAccount] = useState<CurrentUserType>(null);

  // 본인 계정 정보 가져오기
  useEffect(() => {
    if (userLogin) {
      const unsubscribe = onSnapshot(
        doc(dbService, "users", userObj.email),
        (doc) => {
          setMyAccount(doc.data() as CurrentUserType);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [userLogin, userObj.email]);

  return { userLogin, userObj, myAccount };
};

export default useGetMyAccount;
