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
     }),
});

export const {
     useLoginMutation,

     reducer: authApiReducer,
     middleware: authApiMiddleware,
} = AuthApi;
