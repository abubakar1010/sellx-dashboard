// src/redux/features/categories/categories.js

import { baseApi } from "../../baseApi/baseApi";

const Categories = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CATEGORIES
    getCategories: builder.query({
      query: () => ({
        url: "/admin/categories",
        method: "GET",
      }),

      transformResponse: (response) => response?.data,

      providesTags: ["categories"],
    }),

     getCategoriesStats: builder.query({
      query: () => ({
        url: "/admin/categories/stats",
        method: "GET",
      }),

      transformResponse: (response) => response?.data,

      providesTags: ["categories"],
    }),

    // GET SINGLE CATEGORY
    getSingleCategory: builder.query({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "GET",
      }),

      transformResponse: (response) => response?.data,

      providesTags: ["categories"],
    }),

    // ADD CATEGORY
    addCategory: builder.mutation({
      query: (data) => ({
        url: "admin/categories",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["categories"],
    }),

    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["categories"],
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesStatsQuery
} = Categories;