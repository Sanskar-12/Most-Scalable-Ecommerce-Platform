import { User } from "./types";

export interface UserInitialStateType {
  user: User | null;
  loading: boolean;
}
