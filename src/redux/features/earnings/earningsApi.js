import { baseApi } from "../../baseApi/baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
  query: ({ page, limit, paymentType, status, search }) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (paymentType) params.append("paymentType", paymentType);
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    return {
      url: `/admin/payments?${params.toString()}`,
      method: "GET",
    };
  },

  transformResponse: (response) => response?.data, // 👈 important fix
  providesTags: ["earnings"],
}),
    GetPaymentStats: builder.query({
      query: () => ({
        url: "/admin/payments/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["earnings"],
    }),
  }),
});

export const { useGetEarningsQuery, useGetPaymentStatsQuery } = earningsApi;