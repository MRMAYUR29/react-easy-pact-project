import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { IUserProps } from "../../interface";

const UserApi = createApi({
     reducerPath: "userApi",
     tagTypes: ["User"],
     baseQuery: appServerRequest,
     endpoints: ({ query, mutation }) => ({
          getAllUsers: query<
               {
                    success: boolean;
                    message: string;
                    page: number;
                    size: number;
                    totalPages: number;
                    totalCount: number;
                    data: IUserProps[];
               },
               void
          >({
               query: () => "/users",
               providesTags: ["User"],
          }),
          CreateUser: mutation<{ message: string }, IUserProps>({
               query: (data) => ({
                    url: "/users/register",
                    method: "POST",
                    body: {
                         user_type_id: data.user_type_id,
                         name: data.name,
                         mobile: data.mobile,
                         email: data.email,
                         password: data.password,
                         department: data.department,
                         designation: data.designation,
                         region_id: data.region_id._id,
                         country_id: data.country_id._id,
                         city_id: data.city_id._id,
                         is_active: true,
                    } as IUserProps,
               }),
               invalidatesTags: ["User"],
          }),
          deleteUser: mutation<{ message: string }, string>({
               query: (id) => {
                    return {
                         url: `/users/${id}`,
                         method: "DELETE",
                    };
               },
               invalidatesTags: ["User"],
          }),
     }),
});

export const {
     reducer: userApiReducer,
     middleware: userApiMiddleware,
     useGetAllUsersQuery,
     useLazyGetAllUsersQuery,
     useCreateUserMutation,
     useDeleteUserMutation,
} = UserApi;
