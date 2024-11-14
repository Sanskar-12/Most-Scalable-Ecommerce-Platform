import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CategoriesType,
  GetLatestProductsType,
  NewProductType,
  SearchResponseType,
} from "../../types/api-types";
import { NewProductRequest, SearchProductRequest } from "../../types/types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<GetLatestProductsType, string>({
      query: () => ({
        url: "/latest",
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    allAdminProducts: builder.query<GetLatestProductsType, string>({
      query: (userId) => ({
        url: `/get/products?id=${userId}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    categories: builder.query<CategoriesType, string>({
      query: () => ({
        url: `categories`,
        method: "GET",
      }),
      providesTags: ["product"],
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
      providesTags: ["product"],
    }),
    newProduct: builder.mutation<NewProductType, NewProductRequest>({
      query: ({ formData, userId }) => ({
        url: `/new?id=${userId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllAdminProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
} = productAPI;
