import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../types/type";

const initialState: UserType = {
  isLoggedIn: false,
  currentUser: {
    uid: "",
    createdAt: 0,
    bookmark: [],
    like: [],
    defaultProfileUrl: "",
    profileURL: "",
    email: "",
    name: "",
    displayName: "",
    description: "",
    notice: [],
    message: [],
    follower: [],
    following: [],
    notification: false,
  },
  newMessage: false,
  newNotice: false,
};

const getCurrentUser = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    logIn: (state) => {
      state.isLoggedIn = true;

      // // localStorage expirationTime 키로 토큰 만료 기간을 저장
      // localStorage.setItem("expirationTime", action.payload.expirationTime);
    },
    logOut(state) {
      state.isLoggedIn = false;

      state.currentUser = initialState.currentUser;

      // // localStorage에 expirationTime 키의 값 제거
      // localStorage.removeItem("expirationTime");
    },
    currentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    newMessage: (state, action) => {
      state.newMessage = action.payload;
    },
  },
});

export default getCurrentUser;
export const { logIn, logOut, currentUser, newMessage } =
  getCurrentUser.actions;
