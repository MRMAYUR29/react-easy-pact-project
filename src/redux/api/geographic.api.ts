import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { CitiesProps, CountryProps, RegionProps } from "../../interface";


const GeoGraphicsApi = createApi({
  reducerPath: "geoGraphicsApi",
  baseQuery: appServerRequest,
  tagTypes: ["geoGraphics", "Region", "Country", "City"],
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
      providesTags: (result) => // 'error' was removed here
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Region' as const, id: _id })),
              { type: 'Region' as const, id: 'LIST' },
            ]
          : [{ type: 'Region' as const, id: 'LIST' }],
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
      invalidatesTags: [{ type: 'Region' as const, id: 'LIST' }], // 'result' and 'error' were removed
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
      providesTags: (result, _error, countryId) => // 'error' replaced with '_'
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'City' as const, id: _id })),
              { type: 'City' as const, id: 'LIST_FOR_COUNTRY_' + countryId },
            ]
          : [{ type: 'City' as const, id: 'LIST_FOR_COUNTRY_' + countryId }],
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
      invalidatesTags: (_, _error, payload) => [{ type: 'City' as const, id: 'LIST_FOR_COUNTRY_' + payload.country_id }], // 'result' and 'error' replaced with '_'
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
      query: (regionId) => `/countries?region_id=${regionId}&size=200&page=1`,
      providesTags: (result, _error, regionId) => // 'error' replaced with '_'
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Country' as const, id: _id })),
              { type: 'Country' as const, id: 'LIST_FOR_REGION_' + regionId },
            ]
          : [{ type: 'Country' as const, id: 'LIST_FOR_REGION_' + regionId }],
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
      invalidatesTags: (_, _error, payload) => [{ type: 'Country' as const, id: 'LIST_FOR_REGION_' + payload.region_id }], // 'result' and 'error' replaced with '_'
    }),
    deleteRegion: builder.mutation<{ message: string }, string>({
      query: (id) => {
        return {
          url: `/regions/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (_, _error, id) => [ // 'result' and 'error' replaced with '_'
        { type: 'Region' as const, id },
        { type: 'Region' as const, id: 'LIST' },
      ],
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
      invalidatesTags: (_, _error, { id }) => [ // 'result' and 'error' replaced with '_'
        { type: 'Region' as const, id },
        { type: 'Region' as const, id: 'LIST' },
      ],
    }),

    updateCountry: builder.mutation<
      { message: string; data: CountryProps },
      { id: string; data: Partial<CountryProps> }
    >({
      query: ({ id, data }) => ({
        url: `/countries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, _error, { id, data }) => { // 'result' and 'error' replaced with '_'
          const tags: { type: "Country"; id: string }[] = [
            { type: "Country" as const, id },
          ];
          if (data.region_id) {
            tags.push({ type: "Country" as const, id: `LIST_FOR_REGION_${data.region_id}` });
          }
          return tags;
      },
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
  useUpdateCountryMutation,
} = GeoGraphicsApi;