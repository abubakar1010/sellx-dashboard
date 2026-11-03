import { baseApi } from "../../baseApi/baseApi";
const Storie = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    GetStoryStats: builder.query({
      query: () => ({
        url: "/admin/stories/stats",
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
     getStoryList: builder.query({
        query: ({ page, limit }) => ({
            url: `/admin/stories?page=${page}&limit=${limit}`,
            method: "GET",
        }),
     })
  }),
});

export const {
  useGetStoryStatsQuery,
  useGetStoryListQuery
} = Storie;
