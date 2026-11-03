// src/redux/features/subscriptions/subscriptions.js

import { baseApi } from "../../baseApi/baseApi";

const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL SUBSCRIPTIONS
    getSubscriptions: builder.query({
      query: () => ({
        url: "/admin/subscriptions",
        method: "GET",
      }),

      transformResponse: (response) => response?.data,

      providesTags: ["subscriptions"],
    }),

    // GET SINGLE SUBSCRIPTION
    getSingleSubscription: builder.query({
      query: (id) => ({
        url: `/admin/subscriptions/${id}`,
        method: "GET",
      }),

      transformResponse: (response) => response?.data,

      providesTags: ["subscriptions"],
    }),

    // ADD SUBSCRIPTION
    addSubscription: builder.mutation({
      query: (data) => ({
        url: "/admin/subscriptions",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["subscriptions"],
    }),

    // UPDATE SUBSCRIPTION
    updateSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/subscriptions/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["subscriptions"],
    }),

    updateStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/subscriptions/${id}/toggle-status`,
        method: "PATCH",
      }),

      invalidatesTags: ["subscriptions"],
    }),

    // DELETE SUBSCRIPTION
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/admin/subscriptions/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["subscriptions"],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useGetSingleSubscriptionQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateStatusMutation,
} = subscriptionsApi;