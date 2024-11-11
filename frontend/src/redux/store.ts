import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userSlice } from "./reducer/userSlice";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userSlice.name]: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(userAPI.middleware),
});
