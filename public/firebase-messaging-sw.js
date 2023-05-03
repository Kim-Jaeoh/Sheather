// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// // eslint-disable-next-line no-undef
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// // eslint-disable-next-line no-undef
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDuyihGQmcU5emS0e67Nd8oX0JUCynFTKc",
  authDomain: "sheather-463c7.firebaseapp.com",
  projectId: "sheather-463c7",
  storageBucket: "sheather-463c7.appspot.com",
  messagingSenderId: "748435717637",
  appId: "1:748435717637:web:1c4c8315dc6c716402a66c",
  measurementId: "G-559SZ36BYN",
  databaseURL: 'https://sheather-463c7-default-rtdb.firebaseio.com"',
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
const isSupported = firebase.messaging.isSupported();

if (isSupported) {
  // eslint-disable-next-line no-undef
  const messaging = firebase.messaging();

  //백그라운드 서비스워커 설정
  messaging.onBackgroundMessage(messaging, (payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/image/sheather_logo_s.svg",
    };

    // eslint-disable-next-line no-restricted-globals
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
