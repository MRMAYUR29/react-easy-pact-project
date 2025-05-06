import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { DemoProps } from "../../interface";

const productApi = createApi({
     reducerPath: "productApi",
     baseQuery: appServerRequest,
     tagTypes: ["Product"],
     endpoints: (builder) => ({
          getAllProducts: builder.query<
               {
                    message: string;
                    data: DemoProps[];
                    success: true;
                    page: number;
                    size: number;
                    totalPages: number;
                    totalCount: number;
               },
               { page?: number; size?: number }
          >({
               query: ({ page, size }) =>
                    `/demo-products?page=${page ?? 1}&size=${size ?? 10}`,
               providesTags: ["Product"],
          }),
          getProductById: builder.query<
               { data: DemoProps; message: string },
               string
          >({
               query: (id) => `/demo-products/${id}`,
          }),
          createNewProduct: builder.mutation<
               { success: boolean; data: DemoProps; message: string },
               DemoProps
          >({
               query: (data) => ({
                    url: "/demo-products",
                    method: "POST",
                    body: data,
               }),
               invalidatesTags: ["Product"],
          }),
          deleteProduct: builder.mutation<
               { success: boolean; data: DemoProps; message: string },
               string
          >({
               query: (id) => ({
                    url: `/demo-products/${id}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["Product"],
          }),
     }),
});

export const {
     middleware: productApiMiddleware,
     reducer: productApiReducer,
     useGetAllProductsQuery,
     useLazyGetAllProductsQuery,
     useGetProductByIdQuery,
     useLazyGetProductByIdQuery,
     useCreateNewProductMutation,
     useDeleteProductMutation,
} = productApi;
