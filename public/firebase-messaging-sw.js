import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

// // eslint-disable-next-line no-undef
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// // eslint-disable-next-line no-undef
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDLT1GhsvBi9at5FHkVopCoTQO-BfgCrsk",
  authDomain: "sheather-458bd.firebaseapp.com",
  databaseURL: "https://sheather-458bd-default-rtdb.firebaseio.com",
  projectId: "sheather-458bd",
  storageBucket: "sheather-458bd.appspot.com",
  messagingSenderId: "1028313120224",
  appId: "1:1028313120224:web:6d8262ee13e1ad0f2f3f85",
  measurementId: "G-1PYDCZB0N8",
  // apiKey: process.env.REACT_APP_FB_API_KEY,
  // authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_FB_DATABASE_URL,
  // projectId: process.env.REACT_APP_FB_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FB_MESSAGIN_SENDER_ID,
  // appId: process.env.REACT_APP_FB_APP_ID,
  // measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
// const messaging = firebase.messaging();

//백그라운드 서비스워커 설정
// messaging.onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/image/sheather_logo_s.svg",
//   };

//   // eslint-disable-next-line no-restricted-globals
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png",
//   };

//   // eslint-disable-next-line no-restricted-globals
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

const messaging = getMessaging();
onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/image/sheather_logo_s.svg",
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});
