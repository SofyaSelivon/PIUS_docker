import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8004/api",
    credentials: "include",
  }),

  tagTypes: ["User"],

  endpoints: () => ({}),
});
