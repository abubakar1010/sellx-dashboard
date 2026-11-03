import { baseApi } from "../../baseApi/baseApi";

const storesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL STORES
    getStoresStats: builder.query({
      query: () => ({
        url: "/admin/stores/stats",
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["Stores"],
    }),

    // GET ALL STORES
    getStores: builder.query({
      query: ({page, limit, filter}) => ({
        url: `/admin/stores?page=${page}&limit=${limit}&filter=${filter}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["Stores"],
    }),

    // GET SINGLE STORE
    getSingleStore: builder.query({
      query: (id) => ({
        url: `/admin/stores/${id}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["Stores"],
    }),

    // ADD STORE
    addStore: builder.mutation({
      query: (data) => ({
        url: "/admin/stores",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Stores"],
    }),

    // UPDATE STORE
    updateStore: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/stores/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Stores"],
    }),

    // STATUS TOGGLE (NEW)
    updateStoreStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/stores/${id}/toggle-status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Stores"],
    }),

    // DELETE STORE
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/admin/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stores"],
    }),

    // GET STORE PRODUCTS
    getStoreProducts: builder.query({
      query: ({ id, page, limit, status, search }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (status && status !== "all") params.append("status", status);
        if (search) params.append("search", search);
        return {
          url: `/admin/stores/${id}/products?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (res) => res?.data,
      providesTags: ["Stores"],
    }),

    // GET STORE ADS
    getStoreAds: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/admin/stores/${id}/ads?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["Stores"],
    }),

    // GET STORE PAYMENTS
    getStorePayments: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/admin/stores/${id}/payments?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["Stores"],
    }),

  }),
});

export const {
  useGetStoresStatsQuery,
  useGetStoresQuery,
  useGetSingleStoreQuery,
  useAddStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useUpdateStoreStatusMutation,
  useGetStoreProductsQuery,
  useGetStoreAdsQuery,
  useGetStorePaymentsQuery,
} = storesApi;