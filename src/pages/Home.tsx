import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import FeedPost from "../components/feed/FeedPost";
import SortFeedCategory from "../components/feed/SortFeedCategory";
import AuthFormModal from "../components/modal/auth/AuthFormModal";
import useUserAccount from "../hooks/useUserAccount";
import TopButton from "../components/scrollButton/TopButton";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { app } from "../fbase";

declare global {
  interface Window {
    registration: any;
  }
}
const Home = () => {
  const [url, setUrl] = useState(
    `${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`
  );
  const { isAuthModal, onAuthModal, setIsAuthModal, onIsLogin, onLogOutClick } =
    useUserAccount();

  //   const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  //   const messaging = async () => (await isSupported()) && getMessaging(app);

  // useEffect(() => {
  //   // 페이지 로드 시 웹 푸시 알림 권한 확인 및 상태 설정
  //   const requestNotificationsPermissions = async () => {
  //     const permission = await Notification.requestPermission();
  //     if (permission === "granted") {
  //       console.log("알림 권한 부여!!!");
  //     } else {
  //       getMessaging(app);
  //       const msg = await messaging();
  //       const fcmToken = await getToken(msg, {
  //         vapidKey: process.env.REACT_APP_VAPID_KEY,
  //       });
  //       if (fcmToken) {
  //         onMessage(msg, (message) => {
  //           console.log(message.notification);
  //           new Notification(message.notification.title, {
  //             body: message.notification.body,
  //             icon: "/image/sheather_logo_s.png",
  //             badge: "/image/sheather_badge.png",
  //           });
  //         });
  //       }
  //       console.log("알림 권한 없음!!");
  //     }
  //   };
  //   requestNotificationsPermissions();
  // }, []);

  // const handleToggle = async () => {
  //   const msg = await messaging();
  //   if (isNotificationEnabled) {
  //     // 웹 푸시 알림 권한 해제
  //     try {
  //       await deleteToken(msg).then(() => {
  //         console.log("Notification permission revoked.");
  //         setIsNotificationEnabled(false);
  //       });
  //     } catch (error) {
  //       console.error("Error revoking notification permission:", error);
  //     }
  //   } else {
  //     // 웹 푸시 알림 권한 요청
  //     try {
  //       const token = await getToken(msg, {
  //         vapidKey: process.env.REACT_APP_VAPID_KEY,
  //       });
  //       if (token) {
  //         console.log("??");
  //         onMessage(msg, (message) => {
  //           console.log(message.notification);
  //           new Notification(message.notification.title, {
  //             body: message.notification.body,
  //             icon: "/image/sheather_logo_s.png",
  //             badge: "/image/sheather_badge.png",
  //           });
  //         });
  //         setIsNotificationEnabled(true);
  //       }
  //     } catch (error) {
  //       console.error("Error getting notification permission or token:", error);
  //     }
  //   }
  // };

  return (
    <>
      {isAuthModal && (
        <AuthFormModal modalOpen={isAuthModal} modalClose={onAuthModal} />
      )}
      <Container>
        {/* <TopButton bgColor={`#ff5673`} /> */}
        <Box>
          <SortFeedCategory url={url} setUrl={setUrl} />
          <FeedPost url={url} onIsLogin={onIsLogin} />
        </Box>
      </Container>
    </>
  );
};
export default Home;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ff5673;

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 767px) {
    background: #fff;
    padding: 16px;
    border: 1px solid #222;
    border-radius: 20px;
    box-shadow: ${(props) => {
      let shadow = "";
      for (let i = 1; i < 63; i++) {
        shadow += `#be374e ${i}px ${i}px,`;
      }
      shadow += `#be374e 63px 63px`;
      return shadow;
    }};
  }
`;
