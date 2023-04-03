import { createSlice } from "@reduxjs/toolkit";

export interface CurrentUserType {
  uid: string;
  createdAt: number;
  email: string;
  profileURL: string;
  displayName: string;
  name: string;
  description: string;
  bookmark: string[];
  like: string[];
  follower: {
    displayName: string;
    time: number;
    isRead?: boolean;
  }[];
  following: {
    displayName: string;
    time: number;
  }[];
  notice: {
    type: string;
    displayName: string;
    time: number;
    postId?: string;
    text?: string;
    imgUrl?: string;
    profileURL?: string;
  }[];
  message?: {
    id: string;
    user: string;
    isRead?: boolean;
  }[];
  tag?: string[];
}

export interface UserType {
  loginToken?: boolean;
  currentUser: CurrentUserType;
  newMessage?: boolean;
  newNotice?: boolean;
}

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
