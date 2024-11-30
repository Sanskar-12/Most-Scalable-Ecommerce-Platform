import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BarResponseType,
  LineResponseType,
  PieResponseType,
  StatsResponseType,
} from "../../types/api-types";

export const dashboardAPI = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard`,
  }),
  endpoints: (builder) => ({
    stats: builder.query<StatsResponseType, string>({
      query: (adminId) => ({
        url: `/stats?id=${adminId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    pie: builder.query<PieResponseType, string>({
      query: (adminId) => ({
        url: `/pie?id=${adminId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    bar: builder.query<BarResponseType, string>({
      query: (adminId) => ({
        url: `/bar?id=${adminId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    line: builder.query<LineResponseType, string>({
      query: (adminId) => ({
        url: `/line?id=${adminId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useBarQuery, useStatsQuery, useLineQuery, usePieQuery } =
  dashboardAPI;
