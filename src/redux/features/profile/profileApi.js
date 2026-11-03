import { baseApi } from "../../baseApi/baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url:"/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
      transformResponse: (response) => response.data,
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,
    }),

    getNotifications: builder.query({
    query: ({ page, limit, isRead }) => ({
      url: `/admin/notifications?page=${page}&limit=${limit}&isRead=${isRead}`,
      method: "GET",
    }),
    providesTags: ["Notifications"],
    transformResponse: (response) => response,
   }),
   readNotifications: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
      transformResponse: (response) => response,
   })
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetNotificationsQuery,
  useReadNotificationsMutation
} = profileApi;
