import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../types/type";

const initialState: UserType = {
  loginToken: false,
  currentUser: {
    uid: "",
    createdAt: 0,
    bookmark: [],
    like: [],
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
    loginToken: (state, action) => {
      state.loginToken = action.payload;
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
export const { currentUser, loginToken, newMessage } = getCurrentUser.actions;
