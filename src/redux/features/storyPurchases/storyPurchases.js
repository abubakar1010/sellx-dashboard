import { baseApi } from "../../baseApi/baseApi";

const storyPurchasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoryPurchases: builder.query({
      query: ({ page, limit, status, search }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        return {
          url: `/admin/story-purchases?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data,
      providesTags: ["StoryPurchases"],
    }),

    getStoryPurchaseStats: builder.query({
      query: () => ({
        url: "/admin/story-purchases/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["StoryPurchases"],
    }),
  }),
});

export const {
  useGetStoryPurchasesQuery,
  useGetStoryPurchaseStatsQuery,
} = storyPurchasesApi;
