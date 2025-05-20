// src/redux/api/departmentDesignationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const departmentDesignationApi = createApi({
  reducerPath: 'departmentDesignationApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Department', 'Designation'],
  endpoints: (builder) => ({
    // Department Endpoints
    getDepartments: builder.query<{_id: string, name: string}[], void>({
      query: () => 'organization/getDepartment',
      providesTags: ['Department'],
    }),
    
    addDepartment: builder.mutation<{_id: string, name: string}, {name: string}>({
      query: (body) => ({
        url: 'organization/addDepartment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Department'],
    }),

    // Designation Endpoints
    getDesignations: builder.query<{_id: string, name: string}[], void>({
      query: () => 'organization/getDesignation',
      providesTags: ['Designation'],
    }),
    
    addDesignation: builder.mutation<{_id: string, name: string}, {name: string}>({
      query: (body) => ({
        url: 'organization/addDesignation',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Designation'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useGetDesignationsQuery,
  useAddDesignationMutation,
} = departmentDesignationApi;

export const departmentDesignationApiReducer = departmentDesignationApi.reducer;
export const departmentDesignationApiMiddleware = departmentDesignationApi.middleware;