import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCouponsResponseType } from "../../types/api-types";

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
  }),
});

export const { useGetAllCouponsQuery } = couponAPI;
