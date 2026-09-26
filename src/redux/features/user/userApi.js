import { baseApi } from "../../baseApi/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStats: builder.query({
      query: () => ({
        url: "/admin/users/stats",
        method: "GET",
      }),
      providesTags:["users"]
    }),
    getAllUser: builder.query({
      query: ({ page, limit, filter }) => {
        let url = `/admin/users?page=${page}&limit=${limit}`;

        if (filter) {
          url += `&filter=${filter}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),
    UpdateStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}/toggle-status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
    SingleUser: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["users"],
    }),
    UserProducts: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}/products`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["users"],
    }),
    ActiveStories: builder.query({
      query: ({isActive, id}) => ({
        url: `/admin/stories?isActive=${isActive}&userId=${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["users"],
    }),
  }),
});

export const { 
                useGetAllStatsQuery, 
                useGetAllUserQuery, 
                useUpdateStatusMutation, 
                useSingleUserQuery, 
                useUserProductsQuery,
                useActiveStoriesQuery
            } = userApi;
