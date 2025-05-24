import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { IMapProductProps, IUserProps } from "../../interface";

const mappedProductApi = createApi({
     baseQuery: appServerRequest,
     reducerPath: "mappedProductApi",
     tagTypes: ["mappedProductApi","FilteredUsers"],
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
          // Add the new endpoint for filtering users
    getUsersByField: query<{ data: IUserProps[] }, { 
     region_id: string; 
     country_id: string; 
     department: string; 
     designation: string 
   }>({
     query: (params) => ({
       url: `/users/getUserByField`,
       params: {
         region_id: params.region_id,
         country_id: params.country_id,
         department: params.department,
         designation: params.designation
       }
     }),
     providesTags: ["FilteredUsers"], // Using separate tag for users
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
     useGetUsersByFieldQuery,
  useLazyGetUsersByFieldQuery,
} = mappedProductApi;
