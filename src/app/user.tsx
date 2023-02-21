import { createSlice } from "@reduxjs/toolkit";

export interface UserType {
  loginToken?: boolean;
  currentUser: {
    uid: string;
    createdAt: number;
    email: string;
    profileURL: string;
    displayName: string;
    description: string;
    bookmark: string[];
    follower: {
      followerId: string;
      followerAt: number;
    }[];
    following: {
      followingId: string;
      followingAt: number;
    }[];
  };
}

const initialState: UserType = {
  loginToken: false,
  currentUser: {
    uid: "",
    createdAt: 0,
    bookmark: [],
    profileURL: "",
    email: "",
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
