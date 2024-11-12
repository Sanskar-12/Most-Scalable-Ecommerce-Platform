import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetLatestProductsType } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<GetLatestProductsType, string>({
      query: () => ({
        url: "/latest",
        method: "GET",
      }),
    }),
    allAdminProducts: builder.query<GetLatestProductsType, string>({
      query: (userId) => ({
        url: `/get/products?id=${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLatestProductsQuery, useAllAdminProductsQuery } = productAPI;
