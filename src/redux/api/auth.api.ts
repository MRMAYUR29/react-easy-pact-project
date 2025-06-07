// src/redux/api/auth.api.ts (assuming this is the path)
import { createApi } from "@reduxjs/toolkit/query/react";
import { ILoginProps, IUserProps } from "../../interface"; // Make sure these paths are correct
import { appServerRequest } from "../../utils"; // Make sure this path is correct

const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: appServerRequest, // Your custom baseQuery from appServerRequest
  endpoints: (builder) => ({
    login: builder.mutation<
      { message: string; data: { token: string; user: IUserProps } },
      ILoginProps
    >({
      query: (credentials: ILoginProps) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // 🆕 Forgot Password Mutation (already there, just confirming)
    forgotPassword: builder.mutation<
      { message: string },
      { seS_id: string }
    >({
      query: (body) => ({
        url: "/users/forgot-password", // Your backend route for sending the reset email
        method: "POST",
        body,
      }),
    }),

    // 🆕 NEW: Reset Password Mutation
    resetPassword: builder.mutation<
      { message: string }, // Expected response from backend after successful reset
      { token: string; newPassword: string } // Payload sent to backend
    >({
      query: (body) => ({
        url: "/users/reset-password", // ✨ Your backend route for handling password reset
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation, // 🆕 Export the new hook for the ResetPasswordPage
  reducer: authApiReducer,
  middleware: authApiMiddleware,
} = AuthApi;