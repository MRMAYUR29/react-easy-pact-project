// src/redux/api/auth.api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { ILoginProps, IUserProps } from "../../interface";
import { appServerRequest } from "../../utils";

const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: appServerRequest,
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

    forgotPassword: builder.mutation<{ message: string }, { seS_id: string }>({
      query: (body) => ({
        url: "/users/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (body) => ({
        url: "/users/reset-password",
        method: "POST",
        body,
      }),
    }),

    // NEW: Send activation email endpoint
    sendActivationEmail: builder.mutation<{
      message: string;
      data: {
        token: string;
        expiresIn: number;
      };
    }, { email: string }>({
      query: (body) => ({
        url: "/users/send-activation-email",
        method: "POST",
        body,
      }),
    }),

    // NEW: Verify email with OTP endpoint
    // Update the verifyEmail mutation to match your API response
    verifyEmail: builder.mutation<{
      message: string;
      token: string;
    }, { email: string; otp: string; token: string }>({
      query: (body) => ({
        url: "/users/verify-email",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendActivationEmailMutation, // Export the new hook
  useVerifyEmailMutation, // Export the new hook
  reducer: authApiReducer,
  middleware: authApiMiddleware,
} = AuthApi;
