import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AddOrUpdateReviewResponseType,
  CategoriesType,
  DeleteProductType,
  DeleteReviewResponseType,
  GetAllReviewsType,
  GetLatestProductsType,
  NewProductType,
  ProductDetailType,
  SearchResponseType,
  UpdateProductType,
} from "../../types/api-types";
import {
  AddOrUpdateReviewRequest,
  DeleteProductRequest,
  DeleteReviewRequest,
  NewProductRequest,
  SearchProductRequest,
  UpdateProductRequest,
} from "../../types/types";

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
    productDetail: builder.query<ProductDetailType, string>({
      query: (productId) => ({
        url: `/${productId}`,
        method: "GET",
      }),
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
    updateProduct: builder.mutation<UpdateProductType, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `/${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<DeleteProductType, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `/${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
    getAllReviews: builder.query<GetAllReviewsType, string>({
      query: (productId) => ({
        url: `/get/all/review/${productId}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    addOrUpdateReview: builder.mutation<
      AddOrUpdateReviewResponseType,
      AddOrUpdateReviewRequest
    >({
      query: ({ formData, userId, productId }) => ({
        url: `/add/update/review/${productId}?id=${userId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteReview: builder.mutation<
      DeleteReviewResponseType,
      DeleteReviewRequest
    >({
      query: ({ userId, reviewId }) => ({
        url: `/delete/review/${reviewId}?id=${userId}`,
        method: "DELETE",
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
  useProductDetailQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllReviewsQuery,
  useAddOrUpdateReviewMutation,
  useDeleteReviewMutation,
} = productAPI;
