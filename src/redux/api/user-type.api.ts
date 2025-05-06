import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { IUserType } from "../../interface";

const UserTypeApi = createApi({
     baseQuery: appServerRequest,
     reducerPath: "userTypeApi",
     tagTypes: ["userTypeApi"],
     endpoints: ({ mutation, query }) => ({
          getAllUserType: query<
               {
                    success: boolean;
                    message: string;
                    page: number;
                    size: number;
                    totalPages: number;
                    totalCount: number;
                    data: IUserType[];
               },
               { page?: number; size?: number }
          >({
               query: ({ page, size }) =>
                    `/user-types?page=${page ?? 1}&size=${size ?? 10}`,
               providesTags: ["userTypeApi"],
          }),
          createUserType: mutation<{ message: string }, IUserType>({
               query: ({ ...data }) => ({
                    url: "/user-types",
                    method: "POST",
                    body: { ...data },
               }),
               invalidatesTags: ["userTypeApi"],
          }),
          deleteUserType: mutation<{ message: string }, string>({
               query: (id) => ({
                    url: `/user-types/${id}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["userTypeApi"],
          }),
          updateUserType: mutation<
               { message: string },
               { id: string; data: Partial<IUserType> }
          >({
               query: ({ id, data }) => ({
                    url: `/user-types/${id}`,
                    method: "PATCH",
                    body: {
                         type_name: data.type_name,
                         is_active: data.is_active,
                    },
               }),
               invalidatesTags: ["userTypeApi"],
          }),
     }),
});

export const {
     reducer: userTypeApiReducer,
     middleware: userTypeApiMiddleware,

     useCreateUserTypeMutation,
     useGetAllUserTypeQuery,
     useLazyGetAllUserTypeQuery,
     useDeleteUserTypeMutation,
     useUpdateUserTypeMutation,
} = UserTypeApi;
