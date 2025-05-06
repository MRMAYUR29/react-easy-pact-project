import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { CitiesProps, CountryProps, RegionProps } from "../../interface";

const GeoGraphicsApi = createApi({
     reducerPath: "geoGraphicsApi",
     baseQuery: appServerRequest,
     tagTypes: ["geoGraphics"],
     endpoints: (builder) => ({
          getAllRegion: builder.query<
               {
                    data: RegionProps[];
                    message: string;
                    page: number;
                    size: number;
                    totalPages: number;
                    totalCount: number;
               },
               void
          >({
               query: () => "/regions",
               providesTags: ["geoGraphics"],
          }),
          createRegion: builder.mutation<{ message: string }, RegionProps>({
               query: ({ ...payload }) => {
                    return {
                         url: "/regions",
                         method: "POST",
                         body: {
                              ...payload,
                         },
                    };
               },
               invalidatesTags: ["geoGraphics"],
          }),
          getAllCities: builder.query<
               {
                    data: CitiesProps[];
                    message: string;
                    page: number;
                    size: number;
                    totalPages: number;
                    totalCount: number;
               },
               string
          >({
               query: (countryId) => `/cities?country_id=${countryId}`,
               providesTags: ["geoGraphics"],
          }),
          createCity: builder.mutation<
               { message: string },
               Partial<CitiesProps>
          >({
               query: ({ ...payload }) => {
                    return {
                         url: "/cities",
                         method: "POST",
                         body: {
                              ...payload,
                         },
                    };
               },
               invalidatesTags: ["geoGraphics"],
          }),
          getCountries: builder.query<
               {
                    data: CountryProps[];
                    message: string;
                    page: number;
                    size: number;
                    totalPages: number;
                    totalCount: number;
               },
               string
          >({
               query: (regionId) => `/countries?region_id=${regionId}`,
               providesTags: ["geoGraphics"],
          }),
          createCountry: builder.mutation<
               { message: string },
               Partial<CountryProps>
          >({
               query: ({ ...payload }) => {
                    return {
                         url: "/countries",
                         method: "POST",
                         body: {
                              ...payload,
                         },
                    };
               },
               invalidatesTags: ["geoGraphics"],
          }),
          deleteRegion: builder.mutation<{ message: string }, string>({
               query: (id) => {
                    return {
                         url: `/regions/${id}`,
                         method: "DELETE",
                    };
               },
               invalidatesTags: ["geoGraphics"],
          }),
          updateRegion: builder.mutation<
               { message: string },
               Partial<{ id: string; payload: RegionProps }>
          >({
               query: ({ id, payload }) => {
                    return {
                         url: `/regions/${id}`,
                         method: "PATCH",
                         body: {
                              ...payload,
                         },
                    };
               },
               invalidatesTags: ["geoGraphics"],
          }),
     }),
});

export const {
     middleware: geoGraphicsApiMiddleware,
     reducer: geoGraphicsApiReducer,

     useGetAllRegionQuery,
     useLazyGetAllRegionQuery,
     useCreateRegionMutation,
     useGetAllCitiesQuery,
     useLazyGetAllCitiesQuery,
     useCreateCityMutation,
     useLazyGetCountriesQuery,
     useGetCountriesQuery,
     useCreateCountryMutation,
     useDeleteRegionMutation,
     useUpdateRegionMutation,
} = GeoGraphicsApi;
