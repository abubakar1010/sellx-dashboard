// src/redux/features/listings/listingsApi.js
import { baseApi } from "../../baseApi/baseApi";

const listingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET LISTINGS OVERVIEW (pending, active, sold_today, rejected)
    getListingsOverview: builder.query({
      query: () => ({
        url: "/admin/listings/overview",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["listings"],
    }),

    // GET ALL LISTINGS
    getListings: builder.query({
      query: (params) => ({
        url: "/admin/listings",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["listings"],
    }),

    // GET SINGLE LISTING
    getSingleListing: builder.query({
      query: (id) => ({
        url: `/admin/listings/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["listings"],
    }),

    // UPDATE LISTING STATUS (active / rejected)
    updateListingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/listings/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["listings"],
    }),

    // DELETE LISTING
    deleteListing: builder.mutation({
      query: (id) => ({
        url: `/admin/listings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["listings"],
    }),
  }),
});

export const {
  useGetListingsOverviewQuery,
  useGetListingsQuery,
  useGetSingleListingQuery,
  useUpdateListingStatusMutation,
  useDeleteListingMutation,
} = listingsApi;