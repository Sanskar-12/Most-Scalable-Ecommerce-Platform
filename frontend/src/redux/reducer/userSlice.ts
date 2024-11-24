import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInitialStateType } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: UserInitialStateType = {
  user: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export const { userExist, userNotExist } = userSlice.actions;
