import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { dbService } from "../fbase";
import { NoticeArrType } from "../types/type";
import useGetMyAccount from "./useGetMyAccount";

const useNoticeCheck = () => {
  const [result, setResult] = useState<NoticeArrType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { myAccount } = useGetMyAccount();

  // 정보 + 프로필 이미지 담기
  useEffect(() => {
    if (myAccount) {
      const getList = async (res: NoticeArrType) => {
        const docSnap = await getDoc(doc(dbService, "users", res.email));
        return {
          type: res.type,
          time: res.time,
          displayName: res.displayName,
          postId: res.postId,
          email: res.email,
          text: res.text,
          imgUrl: res.imgUrl,
          isRead: res.isRead,
          profileURL: docSnap.data().profileURL,
        };
      };

      const promiseList = async () => {
        const list = await Promise.all(
          myAccount?.notice?.map((res: NoticeArrType) => {
            return getList(res);
          })
        );
        setResult(list);
        setIsLoading(true);
      };
      promiseList();
    }
  }, [myAccount]);

  return { result, isLoading };
};

export default useNoticeCheck;
