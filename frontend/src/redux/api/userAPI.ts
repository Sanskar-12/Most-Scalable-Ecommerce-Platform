import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetUserResponseType, LoginResponseType } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseType, User>({
      query: (user) => ({
        url: "/new",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const getUser = async (userId: string): Promise<GetUserResponseType> => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${userId}`
    );
    return data;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const { useLoginMutation } = userAPI;
