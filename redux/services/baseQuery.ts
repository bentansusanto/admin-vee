import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout, setAuth } from "../features/authSlice";
import { RootState } from "../store";

// Global promise to handle concurrent refresh attempts
let refreshPromise: Promise<any> | null = null;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    await refreshPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!refreshPromise) {
      // Start the refresh process
      refreshPromise = (async () => {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh_token",
            method: "POST",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Update Redux state with new tokens
          api.dispatch(setAuth((refreshResult.data as any).data));
        } else {
          // If refresh fails, log out
          api.dispatch(logout());
        }
        
        // Reset the promise
        refreshPromise = null;
      })();
    }

    // Wait for the refresh to complete
    await refreshPromise;

    // Retry the original query with the new token
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};
