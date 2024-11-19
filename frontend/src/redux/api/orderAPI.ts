import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllOrderResponseType,
  DeleteOrdeRequestType,
  MessageResponseType,
  NewOrderRequestType,
  OrderDetailResponseType,
  UpdateOrdeRequestType,
} from "../../types/api-types";

export const orderAPI = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponseType, NewOrderRequestType>({
      query: (order) => ({
        url: "/new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    updateOrder: builder.mutation<MessageResponseType, UpdateOrdeRequestType>({
      query: ({ orderId, userId }) => ({
        url: `/${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation<MessageResponseType, DeleteOrdeRequestType>({
      query: ({ orderId, userId }) => ({
        url: `/${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
    myOrders: builder.query<AllOrderResponseType, string>({
      query: (userId) => ({
        url: `/my/orders?id=${userId}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
    allOrders: builder.query<AllOrderResponseType, string>({
      query: (userId) => ({
        url: `/all?id=${userId}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
    orderDetails: builder.query<OrderDetailResponseType, string>({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
} = orderAPI;
