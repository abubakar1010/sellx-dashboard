import { baseApi } from "../../baseApi/baseApi";

const listingPurchasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListingPurchases: builder.query({
      query: ({ page, limit, status }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (status) params.append("status", status);
        return {
          url: `/admin/listing-purchases?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data,
      providesTags: ["ListingPurchases"],
    }),

    getListingPurchaseStats: builder.query({
      query: () => ({
        url: "/admin/listing-purchases/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["ListingPurchases"],
    }),
  }),
});

export const {
  useGetListingPurchasesQuery,
  useGetListingPurchaseStatsQuery,
} = listingPurchasesApi;
