import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import getWeather from "./weather";
import getCurrentUser from "./user";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

//persist 설정
const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["특정 리듀서"] // 특정한 reducer만 localStorage에 저장하고 싶을 경우
};

const rootReducer = combineReducers({
  weather: getWeather.reducer,
  user: getCurrentUser.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
