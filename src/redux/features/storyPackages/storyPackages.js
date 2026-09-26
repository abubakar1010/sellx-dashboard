import { baseApi } from "../../baseApi/baseApi";

const storyPackagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL STORY PACKAGES
    getStoryPackages: builder.query({
      query: () => ({
        url: "/admin/story-packages",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["StoryPackages"],
    }),

    // GET SINGLE STORY PACKAGE
    getSingleStoryPackage: builder.query({
      query: (id) => ({
        url: `/admin/story-packages/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["StoryPackages"],
    }),

    // ADD STORY PACKAGE
    addStoryPackage: builder.mutation({
      query: (data) => ({
        url: "/admin/story-packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StoryPackages"],
    }),

    // UPDATE STORY PACKAGE
    updateStoryPackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/story-packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StoryPackages"],
    }),

    // DELETE STORY PACKAGE
    deleteStoryPackage: builder.mutation({
      query: (id) => ({
        url: `/admin/story-packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StoryPackages"],
    }),

    // TOGGLE STORY PACKAGE STATUS
    toggleStoryPackageStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/story-packages/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["StoryPackages"],
    }),
  }),
});

export const {
  useGetStoryPackagesQuery,
  useGetSingleStoryPackageQuery,
  useAddStoryPackageMutation,
  useUpdateStoryPackageMutation,
  useDeleteStoryPackageMutation,
  useToggleStoryPackageStatusMutation,
} = storyPackagesApi;
