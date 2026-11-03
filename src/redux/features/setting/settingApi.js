import { baseApi } from "../../baseApi/baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    settings: builder.query({
      query: ({slug}) => ({
        url: `/admin/settings?slug=${slug}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
      addSetting: builder.mutation({
  query: (data) => ({
    url: "/admin/settings",
    method: "POST",
    body: data,
  }),
}),
  }),
});

export const {
  useSettingsQuery,
  useAddSettingMutation
} = settingApi;
