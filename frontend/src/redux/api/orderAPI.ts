import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllOrderResponseType,
  MessageResponseType,
  NewOrderRequestType,
} from "../../types/api-types";

export const orderAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order`,
  }),
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponseType, NewOrderRequestType>({
      query: (order) => ({
        url: "/new",
        method: "POST",
        body: order,
      }),
    }),
    myOrders: builder.query<AllOrderResponseType, string>({
      query: (userId) => ({
        url: `/my/orders?id=${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useNewOrderMutation, useMyOrdersQuery } = orderAPI;
