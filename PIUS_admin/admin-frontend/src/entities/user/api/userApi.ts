import { baseApi } from "../../../shared/api/baseApi";

import type { User } from "../model/types";

export type UserUpdateRequest = {
  login?: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  dateOfBirth?: string;
  city?: string;
  telegram?: string;
  telegramChatId?: string;
  isSeller?: boolean;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/v1/users/",
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/v1/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<User, { userId: string; data: UserUpdateRequest }>({
      query: ({ userId, data }) => ({
        url: `/v1/users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApi;