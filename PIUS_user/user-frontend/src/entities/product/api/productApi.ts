import { baseApi } from "../../../shared/api/baseApi";
import type { Product, ProductFilters } from "../model/types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<any, ProductFilters>({
      query: (filters) => ({
        url: "cart/products",
        params: filters,
      }),
      providesTags: ["Products"],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApi;
