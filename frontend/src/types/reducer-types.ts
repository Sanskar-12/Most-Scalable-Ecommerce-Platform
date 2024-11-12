import { User } from "./types";

export interface UserInitialStateType {
  user: User | null;
  loading: boolean;
}

export interface RootState {
  userSlice: UserInitialStateType;
}
