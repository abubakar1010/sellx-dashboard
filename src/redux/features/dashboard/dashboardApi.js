import { baseApi } from "../../baseApi/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatus: builder.query({
      query: () => ({
        url: "/admin/getTotalStatus",
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
    getIncomeRatio: builder.query({
      query: (date) => ({
        url: `/admin/dashboard/summary?timespan=${date}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
    
    getRecentActvities: builder.query({
    query: ({ page, limit}) => ({
      url: `/admin/activities?page=${page}&limit=${limit}`,
      method: "GET",
    }),
    transformResponse: (response) => response,
   }),

  ListRecentListings : builder.query({
    query: ({ page, limit, status, search}) => ({
      url: `/admin/listings?page=${page}&limit=${limit}&status=${status}&search=${search}`,
      method: "GET",
    }),
    transformResponse: (response) => response,
  })

  }),
});

export const { 
  useGetDashboardStatusQuery, 
  useGetIncomeRatioQuery, 
  useGetRecentActvitiesQuery,
  useListRecentListingsQuery
} = dashboardApi;
