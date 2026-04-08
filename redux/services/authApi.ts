import { createApi } from "@reduxjs/toolkit/query/react";
import { logout, setAuth } from "../features/authSlice";
import { baseQueryWithReauth } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.data));
        } catch (err) {
          // handled by hook
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyAccount: builder.mutation({
      query: (data) => ({
        url: "/auth/verify_account",
        method: "POST",
        body: data,
      }),
    }),
    resendVerification: builder.mutation({
      query: (email) => ({
        url: "/auth/resend_verification",
        method: "POST",
        body: { email },
      }),
    }),
    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.data));
        } catch (err) {
          dispatch(logout());
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          // even if it fails, we log out locally
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyAccountMutation,
  useResendVerificationMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
