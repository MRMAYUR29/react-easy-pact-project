import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils"; // same as in user.api.ts

const departmentDesignationApi = createApi({
  reducerPath: "departmentDesignationApi",
  tagTypes: ["Department", "Designation"],
  baseQuery: appServerRequest, // ✅ uses same baseQuery as userApi
  endpoints: ({ query, mutation }) => ({
    // Upload Department File
    uploadDepartmentFile: mutation<{ message: string }, FormData>({
      query: (formData) => ({
        url: "/organization/department",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Department"],
    }),

    // Get Departments
    getDepartments: query<any, void>({
      query: () => "/organization/getDepartment",
      transformResponse: (response: any) => response.data || [],
      providesTags: ["Department"],
    }),

    // Upload Designation File
    uploadDesignationFile: mutation<{ message: string }, FormData>({
      query: (formData) => ({
        url: "/organization/designation",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Designation"],
    }),

    // Get Designations
    getDesignations: query<any, void>({
      query: () => "/organization/getDesignation",
      transformResponse: (response: any) => response.data || [],
      providesTags: ["Designation"],
    }),
  }),
});

export const {
  reducer: departmentDesignationReducer,
  middleware: departmentDesignationMiddleware,
  useUploadDepartmentFileMutation,
  useGetDepartmentsQuery,
  useUploadDesignationFileMutation,
  useGetDesignationsQuery,
} = departmentDesignationApi;
