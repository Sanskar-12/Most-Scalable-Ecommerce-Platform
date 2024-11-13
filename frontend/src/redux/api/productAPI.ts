import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CategoriesType,
  GetLatestProductsType,
  SearchResponseType,
} from "../../types/api-types";
import { SearchProductRequest } from "../../types/types";

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
    categories: builder.query<CategoriesType, string>({
      query: () => ({
        url: `categories`,
        method: "GET",
      }),
    }),
    searchProducts: builder.query<SearchResponseType, SearchProductRequest>({
      query: ({ search, price, category, page, sort }) => {
        let base = `/search?search=${search}&page=${page}`;

        if (price) base = base + `&price=${price}`;
        if (category) base = base + `&category=${category}`;
        if (sort) base = base + `&sort=${sort}`;

        return {
          url: base,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllAdminProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
} = productAPI;
