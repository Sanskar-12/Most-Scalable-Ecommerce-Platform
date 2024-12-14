import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllCouponsResponseType,
  DeleteCouponResponseType,
  NewCouponResponseType,
  UpdateCouponResponseType,
  ViewCouponResponseType,
} from "../../types/api-types";
import {
  DeleteCouponRequestType,
  NewCouponRequestType,
  UpdateCouponRequestType,
  ViewCouponRequestType,
} from "../../types/types";

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
    viewCoupon: builder.query<ViewCouponResponseType, ViewCouponRequestType>({
      query: ({ couponId, userId }) => ({
        url: `/view/coupon/${couponId}?id=${userId}`,
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
    deleteCoupon: builder.mutation<
      DeleteCouponResponseType,
      DeleteCouponRequestType
    >({
      query: ({ couponId, userId }) => ({
        url: `/${couponId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupons"],
    }),
    newCoupon: builder.mutation<NewCouponResponseType, NewCouponRequestType>({
      query: ({ userId, formData }) => ({
        url: `/coupon/new?id=${userId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
  useViewCouponQuery,
  useDeleteCouponMutation,
  useNewCouponMutation,
} = couponAPI;
