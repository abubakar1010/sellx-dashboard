import { baseApi } from "../../baseApi/baseApi";

const AdsPackagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── ADVERTISEMENT (ads-packages) ────────────────────────────────────────

    // GET ALL ADS PACKAGES
    getAdsPackages: builder.query({
      query: () => ({
        url: "/admin/ads-packages",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["AdsPackages"],
    }),
    // ADD ADS PACKAGE
    addAdsPackage: builder.mutation({
      query: (data) => ({
        url: "/admin/ads-packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdsPackages"],
    }),
    // UPDATE ADS PACKAGE
    updateAdsPackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/ads-packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdsPackages"],
    }),
    // DELETE ADS PACKAGE
    deleteAdsPackage: builder.mutation({
      query: (id) => ({
        url: `/admin/ads-packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdsPackages"],
    }),
  }),
});

export const {
  useGetAdsPackagesQuery,
  useAddAdsPackageMutation,
  useUpdateAdsPackageMutation,
  useDeleteAdsPackageMutation,
} = AdsPackagesApi;