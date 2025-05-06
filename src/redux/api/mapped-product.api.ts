import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { IMapProductProps } from "../../interface";

const mappedProductApi = createApi({
     baseQuery: appServerRequest,
     reducerPath: "mappedProductApi",
     tagTypes: ["mappedProductApi"],
     endpoints: ({ mutation, query }) => ({
          getAllMappedProducts: query<{ data: IMapProductProps[] }, void>({
               query: () => `/user-demo-mapping?page=${1}&size=${1000}`,
               providesTags: ["mappedProductApi"],
          }),
          createMapProduct: mutation<{ message: string }, IMapProductProps>({
               query: ({ demo_product_id, user_id }) => {
                    return {
                         url: `/user-demo-mapping`,
                         method: "POST",
                         body: {
                              demo_product_id,
                              user_id,
                         },
                    };
               },
               invalidatesTags: ["mappedProductApi"],
          }),
          DeleteMapProduct: mutation<{ message: string }, string>({
               query: (id) => ({
                    url: `/user-demo-mapping/${id}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["mappedProductApi"],
          }),
     }),
});

export const {
     reducer: mappedProductApiReducer,
     middleware: mappedProductApiMiddleware,

     useGetAllMappedProductsQuery,
     useLazyGetAllMappedProductsQuery,
     useCreateMapProductMutation,
     useDeleteMapProductMutation,
} = mappedProductApi;
