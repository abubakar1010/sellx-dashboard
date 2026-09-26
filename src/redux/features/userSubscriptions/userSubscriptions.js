import { baseApi } from "../../baseApi/baseApi";

const userSubscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserSubscriptions: builder.query({
      query: ({ page, limit, status }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (status) params.append("status", status);
        return {
          url: `/admin/user-subscriptions?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data,
      providesTags: ["UserSubscriptions"],
    }),

    getUserSubscriptionStats: builder.query({
      query: () => ({
        url: "/admin/user-subscriptions/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["UserSubscriptions"],
    }),

    cancelUserSubscription: builder.mutation({
      query: (id) => ({
        url: `/admin/user-subscriptions/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["UserSubscriptions"],
    }),
  }),
});

export const {
  useGetUserSubscriptionsQuery,
  useGetUserSubscriptionStatsQuery,
  useCancelUserSubscriptionMutation,
} = userSubscriptionsApi;
