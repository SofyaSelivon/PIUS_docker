import { baseApi } from "../../../shared/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery } = userApi;
