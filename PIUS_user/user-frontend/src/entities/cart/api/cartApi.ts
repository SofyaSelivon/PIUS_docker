import { baseApi } from "../../../shared/api/baseApi";
import type { CartResponse } from "../model/types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<any, { productId: string; quantity?: number }>({
      query: ({ productId, quantity = 1 }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart", "User"],
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: "PATCH",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<any, string>({
      query: (productId) => ({
        url: `/cart/item/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart", "User"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
