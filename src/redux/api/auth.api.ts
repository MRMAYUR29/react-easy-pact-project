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

    // 🆕 Forgot Password Mutation
    forgotPassword: builder.mutation<
      { message: string },
      { seS_id: string, password: string }
    >({
      query: (body) => ({
        url: "/users/forgot-password", // 🔁 adjust to your real backend route
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation, // 🆕 Export the hook
  reducer: authApiReducer,
  middleware: authApiMiddleware,
} = AuthApi;
