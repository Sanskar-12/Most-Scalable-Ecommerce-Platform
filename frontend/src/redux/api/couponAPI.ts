import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllCouponsResponseType,
  UpdateCouponResponseType,
} from "../../types/api-types";
import { UpdateCouponRequestType } from "../../types/types";

export const couponAPI = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment`,
  }),
  tagTypes: ["coupons"],
  endpoints: (builder) => ({
    getAllCoupons: builder.query<AllCouponsResponseType, string>({
      query: (userId) => ({
        url: `/coupons?id=${userId}`,
        method: "GET",
      }),
      providesTags: ["coupons"],
    }),
    updateCoupon: builder.mutation<
      UpdateCouponResponseType,
      UpdateCouponRequestType
    >({
      query: ({ couponId, userId, formData }) => ({
        url: `/${couponId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const { useGetAllCouponsQuery, useUpdateCouponMutation } = couponAPI;
