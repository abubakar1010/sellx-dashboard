import { baseApi } from "../../baseApi/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET COUPON STATS
    getCouponStats: builder.query({
      query: () => ({
        url: "/admin/coupons/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["coupons"],
    }),

    // GET ALL COUPONS
    getCoupons: builder.query({
      query: (params) => ({
        url: "/admin/coupons",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["coupons"],
    }),

    // GET SINGLE COUPON
    getSingleCoupon: builder.query({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["coupons"],
    }),

    // CREATE COUPON
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/admin/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coupons"],
    }),

    // UPDATE COUPON
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/coupons/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["coupons"],
    }),

    // DELETE COUPON
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const {
  useGetCouponStatsQuery,
  useGetCouponsQuery,
  useGetSingleCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;