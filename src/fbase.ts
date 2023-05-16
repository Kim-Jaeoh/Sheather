import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DATABASE_URL,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGIN_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authService = getAuth(app);
export const dbService = getFirestore(app);
export const storageService = getStorage(app);
export const analytics = getAnalytics(app);
// isSupported()는 Firebase 푸시 알림 지원 여부를 확인
export const messaging = async () => (await isSupported()) && getMessaging(app);

// const isSupport = () =>
//   "Notification" in window &&
//   "serviceWorker" in navigator &&
//   "PushManager" in window;

// 알림 여부
const requestNotificationsPermissions = async (userEmail: string) => {
  if (!Notification) {
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    await updateDoc(doc(dbService, "users", userEmail), {
      notification: true,
    });
    return await saveMessagingDeviceToken(userEmail);
  } else {
    await updateDoc(doc(dbService, "users", userEmail), {
      notification: false,
    });
    return alert("Notification not allowed");
  }
};

// 알림 받기
export const saveMessagingDeviceToken = async (userEmail: string) => {
  try {
    const msg = await messaging();
    const fcmToken = await getToken(msg, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });
    if (fcmToken) {
      onMessage(msg, (message) => {
        new Notification(message.notification.title, {
          body: message.notification.body,
          icon: "./image/sheather_logo_s.png",
          badge: "./image/sheather_badge.png",
        });
      });
    } else {
      // 푸시 알림 권한 요청하기
      requestNotificationsPermissions(userEmail);
    }
  } catch (error) {
    console.error("Unable to get messaging token.", error);
  }
};

// 로그인/회원가입 시 기기 토큰값 저장
export const createDeviceToken = async (userEmail: string) => {
  const msg = await messaging();
  const fcmToken = await getToken(msg, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  });
  const tokenRef = doc(dbService, `fcmTokens`, userEmail);
  const checkToken = await getDoc(tokenRef);

  // 저장된 토큰값이 없을 때
  if (fcmToken && !checkToken.exists()) {
    await setDoc(tokenRef, { fcmToken });
  }

  // 저장된 토큰값이 있을 때 (다른 기기 접속 시 업데이트)
  if (fcmToken && checkToken.exists()) {
    await updateDoc(tokenRef, { fcmToken });
  }
};
