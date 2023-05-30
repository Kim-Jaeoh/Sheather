import { useState } from "react";
import { doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useNavigate } from "react-router-dom";
import { CurrentUserType, MessageReadType } from "../../types/type";
import useGetMyAccount from "../useGetMyAccount";

const useCreateChat = () => {
  const [clickInfo, setClickInfo] = useState(null);
  const navigate = useNavigate();
  const { myAccount } = useGetMyAccount();

  // 채팅 생성
  const onCreateChatClick = async (user: CurrentUserType) => {
    const myFilter = myAccount?.message?.filter(
      (message: MessageReadType) => message.email === user.email
    );
    const userFilter = user.message.filter(
      (message) => message.email === myAccount?.email
    );

    if (!myFilter.length && !userFilter.length) {
      // 채팅 새로 만들기
      await addDoc(collection(dbService, `messages`), {
        member: [myAccount?.email, user.email],
        // message: [],
      }).then(async (document) => {
        // 중복 체크
        const checkMyInfo = myAccount?.message?.some(
          (res: { id: string }) => res.id === document?.id
        );
        const checkUserInfo = user?.message?.some(
          (res: { id: string }) => res.id === document?.id
        );

        if (document.id) {
          // 채팅 개설 시 본인 계정 message에 id값 추가
          if (myAccount && !checkMyInfo) {
            const myAccountPushId = async () => {
              await updateDoc(doc(dbService, "users", myAccount?.email), {
                message: [
                  ...myAccount?.message,
                  {
                    user: user?.displayName, // 상대 아이디
                    email: user?.email,
                    id: document?.id,
                    isRead: true, // true인 이유는 본인 것엔 채팅방 생성 알림 노출 안 하기 위함
                  },
                ],
              });
            };
            myAccountPushId();
          }
          // 채팅 개설 시 상대 계정 message에 id값 추가
          if (user && !checkUserInfo) {
            const userAccountPushId = async () => {
              await updateDoc(doc(dbService, "users", user.email), {
                message: [
                  ...user?.message,
                  {
                    user: myAccount?.displayName, // 본인 아이디
                    email: myAccount?.email,
                    id: document?.id,
                    isRead: false,
                  },
                ],
              });
            };
            userAccountPushId();
          }
        }
      });
    } else {
      // 기존 채팅방 본인 계정 message에 id값 추가
      if (myAccount && !myFilter.length) {
        const myAccountPushId = async () => {
          await updateDoc(doc(dbService, "users", myAccount?.email), {
            message: [
              ...myAccount?.message,
              {
                user: user?.displayName,
                email: user?.email,
                id: userFilter[0].id,
                isRead: true,
              },
            ],
          });
        };
        myAccountPushId();
      }

      // 기존 채팅방 상대 계정 message에 id값 추가
      if (user && !userFilter.length) {
        const UserAccountPushId = async () => {
          await updateDoc(doc(dbService, "users", user.email), {
            message: [
              ...user?.message,
              {
                user: myAccount?.displayName,
                email: myAccount?.email,
                id: myFilter[0]?.id,
                isRead: true,
              },
            ],
          });
        };
        UserAccountPushId();
      }
    }
    setClickInfo(user.email);
    navigate(`/message/${user.displayName}`, { state: user.email });
  };

  return { clickInfo, setClickInfo, onCreateChatClick };
};

export default useCreateChat;
