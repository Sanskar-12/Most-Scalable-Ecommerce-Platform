import { User } from "./types";

export type LoginResponseType = {
  success: boolean;
  message: string;
};

export type GetUserResponseType = {
  success: boolean;
  user: User;
};
