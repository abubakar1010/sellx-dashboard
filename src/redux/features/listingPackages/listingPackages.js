import { baseApi } from "../../baseApi/baseApi";

const listingPackagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL LISTING PACKAGES
    getListingPackages: builder.query({
      query: () => ({
        url: "/admin/listing-packages",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["ListingPackages"],
    }),

    // GET SINGLE LISTING PACKAGE
    getSingleListingPackage: builder.query({
      query: (id) => ({
        url: `/admin/listing-packages/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["ListingPackages"],
    }),

    // ADD LISTING PACKAGE
    addListingPackage: builder.mutation({
      query: (data) => ({
        url: "/admin/listing-packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ListingPackages"],
    }),

    // UPDATE LISTING PACKAGE
    updateListingPackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/listing-packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ListingPackages"],
    }),

    // DELETE LISTING PACKAGE
    deleteListingPackage: builder.mutation({
      query: (id) => ({
        url: `/admin/listing-packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ListingPackages"],
    }),

    // TOGGLE LISTING PACKAGE STATUS
    toggleListingPackageStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/listing-packages/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["ListingPackages"],
    }),
  }),
});

export const {
  useGetListingPackagesQuery,
  useGetSingleListingPackageQuery,
  useAddListingPackageMutation,
  useUpdateListingPackageMutation,
  useDeleteListingPackageMutation,
  useToggleListingPackageStatusMutation,
} = listingPackagesApi;
