//src/redux/baseApi/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loggedUser, logoutUser } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Mutex to prevent multiple simultaneous refresh attempts
let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logoutUser());
      return result;
    }

    // If a refresh is already in progress, wait for it
    if (!refreshPromise) {
      refreshPromise = rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      ).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshResult = await refreshPromise;

    if (refreshResult?.data?.success) {
      const { accessToken, refreshToken: newRefreshToken } =
        refreshResult.data.data.tokens;
      const user = refreshResult.data.data.user;

      // Store new tokens
      api.dispatch(
        loggedUser({
          token: accessToken,
          refreshToken: newRefreshToken,
          user,
        })
      );

      // Retry the original request with the new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — force logout
      api.dispatch(logoutUser());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Categories", "ComboBox", "Boosting", "Products", "subscriptions", "users", "categories", "listings", "Stores", "ListingPackages", "StoryPackages", "ListingPurchases", "StoryPurchases", "UserSubscriptions", "AdsPackages"],
  endpoints: () => ({}),
});
