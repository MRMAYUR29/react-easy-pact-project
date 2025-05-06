import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { ICategoryProps } from "../../interface";

const categoryApi = createApi({
     reducerPath: "categoryApi",
     baseQuery: appServerRequest,
     tagTypes: ["Category"],
     endpoints: ({ query, mutation }) => ({
          getCategories: query<
               {
                    data: ICategoryProps[];
                    message: string;
                    page: number;
                    size: number;
                    success: boolean;
                    totalCount: number;
                    totalPages: number;
               },
               void
          >({
               query: () => "/product-categories",
               providesTags: ["Category"],
          }),
          createCategory: mutation<{ message: string }, { name: string }>({
               query: ({ name }) => {
                    return {
                         url: "/product-categories",
                         method: "POST",
                         body: {
                              name,
                         },
                    };
               },
               invalidatesTags: ["Category"],
          }),
          updateCategory: mutation<
               { message: string },
               Partial<ICategoryProps>
          >({
               query: ({ name, _id, is_active }) => {
                    return {
                         url: `/product-categories/${_id}`,
                         method: "PATCH",
                         body: {
                              name,
                              _id,
                              is_active,
                         },
                    };
               },
               invalidatesTags: ["Category"],
          }),
          deleteCategory: mutation<{ message: string }, string>({
               query: (id) => {
                    return {
                         url: `/product-categories/${id}`,
                         method: "DELETE",
                    };
               },
               invalidatesTags: ["Category"],
          }),
     }),
});

export const {
     useCreateCategoryMutation,
     useGetCategoriesQuery,
     useLazyGetCategoriesQuery,
     useUpdateCategoryMutation,
     useDeleteCategoryMutation,

     middleware: categoryApiMiddleware,
     reducer: categoryApiReducer,
} = categoryApi;
