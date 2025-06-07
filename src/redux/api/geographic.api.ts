import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { CitiesProps, CountryProps, RegionProps } from "../../interface";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"; // Import this for error type

const GeoGraphicsApi = createApi({
  reducerPath: "geoGraphicsApi",
  baseQuery: appServerRequest,
  // IMPORTANT: Define specific tag types for better caching granularity
  // This helps RTK Query know exactly what to invalidate.
  // For example: 'Region', 'Country', 'City'
  tagTypes: ["geoGraphics", "Region", "Country", "City"], // Added more specific tag types
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
      // Use the specific 'Region' tag, and a 'LIST' ID for all regions
      providesTags: (result) =>
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
      // Invalidate the 'LIST' of regions to refetch all regions
      invalidatesTags: [{ type: 'Region' as const, id: 'LIST' }],
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
      providesTags: (result, error, countryId) =>
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
      invalidatesTags: (result, error, payload) => [{ type: 'City' as const, id: 'LIST_FOR_COUNTRY_' + payload.country_id }],
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
      // Use 'Country' tag for country lists
      providesTags: (result, error, regionId) =>
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
      // Invalidate the specific country list after creation
      invalidatesTags: (result, error, payload) => [{ type: 'Country' as const, id: 'LIST_FOR_REGION_' + payload.region_id }],
    }),
    deleteRegion: builder.mutation<{ message: string }, string>({
      query: (id) => {
        return {
          url: `/regions/${id}`,
          method: "DELETE",
        };
      },
      // Invalidate the specific region and the list of regions
      invalidatesTags: (result, error, id) => [
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
      // Invalidate the specific region and the list
      invalidatesTags: (result, error, { id }) => [
        { type: 'Region' as const, id },
        { type: 'Region' as const, id: 'LIST' },
      ],
    }),

    // --- UPDATED MUTATION ---
    updateCountry: builder.mutation<
      { message: string; data: CountryProps }, // Response type
      { id: string; data: Partial<CountryProps> } // Argument type: ID and partial data
    >({
      query: ({ id, data }) => ({
        url: `/countries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id, data }) => {
          const tags: { type: "Country"; id: string }[] = [
            { type: "Country" as const, id }, // Invalidate the specific country
          ];
          // If the mutation includes region_id in its data, invalidate the list for that region
          if (data.region_id) {
            tags.push({ type: "Country" as const, id: `LIST_FOR_REGION_${data.region_id}` });
          }
          return tags;
      },
    }),
    // ----------------------------
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