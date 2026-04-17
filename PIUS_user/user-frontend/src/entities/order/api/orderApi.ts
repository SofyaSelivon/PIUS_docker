import { baseApi } from "../../../shared/api/baseApi";
import type { OrderHistoryResponse, OrderDetails } from "../model/types";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderHistoryResponse, number | void>({
      query: (page = 1) => ({
        url: "/orders",
        params: { page },
      }),
      providesTags: ["Orders"],
    }),

    getOrderDetails: builder.query<OrderDetails, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation<
      any,
      {
        deliveryAddress: string;
        deliveryCity: string;
        phone: string;
        deliveryComment?: string;
      }
    >({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "Cart", "User"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
} = orderApi;
