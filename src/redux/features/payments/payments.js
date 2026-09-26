import { baseApi } from "../../baseApi/baseApi";

const payments = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentsStats: builder.query({
      query: () => ({
        url: `/admin/payments/stats`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
    useGetPaymentsStatsQuery,
} = payments;
