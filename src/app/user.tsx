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
  }[];
  following: {
    displayName: string;
    time: number;
  }[];
  tag?: string[];
}

export interface UserType {
  loginToken?: boolean;
  currentUser: CurrentUserType;
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
    follower: [],
    following: [],
  },
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
  },
});

export default getCurrentUser;
export const { currentUser, loginToken } = getCurrentUser.actions;
