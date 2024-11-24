import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  DeleteUserRequestType,
  GetAllUsersResponseType,
  GetUserResponseType,
  LoginResponseType,
  MessageResponseType,
} from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user`,
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseType, User>({
      query: (user) => ({
        url: "/new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation<MessageResponseType, DeleteUserRequestType>({
      query: ({ userId, adminId }) => ({
        url: `/${userId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getAllUsers: builder.query<GetAllUsersResponseType, string>({
      query: (userId) => ({
        url: `/all?id=${userId}`,
        method: "GET",
      }),
      providesTags: ["user"],
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
    throw Error(error as string);
  }
};

export const { useLoginMutation, useGetAllUsersQuery, useDeleteUserMutation } =
  userAPI;
