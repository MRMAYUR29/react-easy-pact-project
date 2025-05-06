import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CitiesProps, RegionProps } from "../../interface";
import { useAppSelector } from "..";

export interface GeoGraphicsSliceProps {
     regions: RegionProps[] | null;
     regionModal: boolean;
     countryModal: boolean;
     regionInput: {
          name: string;
          is_active: boolean;
          _id?: string;
     };
     countryInput: {
          name: string;
          is_active: boolean;
          _id?: string;
     };
     cityInput: {
          name: string;
          is_active: boolean;
          _id?: string;
          country_id?: string;
     };
     city: CitiesProps[] | null;
     cityModal: boolean;
     selection: {
          country: string;
          region: string;
          city: string;
          country_code: string
     };
}

export const initialRegion = {
     name: "",
     is_active: false,
};

export const initialCountry = {
     name: "",
     is_active: false,
};

export const initialCity = {
     name: "",
     is_active: false,
};

const initialState: GeoGraphicsSliceProps = {
     regions: null,
     regionModal: false,
     countryModal: false,
     cityModal: false,
     regionInput: initialRegion,
     city: null,
     countryInput: initialCountry,
     cityInput: initialCity,
     selection: {
          country: "",
          city: "",
          region: "",
          country_code: ""
     },
};

const GeoGraphicSlice = createSlice({
     initialState,
     name: "geographic",
     reducers: {
          setRegion: (state, action: PayloadAction<RegionProps[] | null>) => {
               state.regions = action.payload;
          },
          setCity: (state, action: PayloadAction<CitiesProps[] | null>) => {
               state.city = action.payload;
          },
          setRegionInput: (
               state,
               action: PayloadAction<{
                    name: string;
                    is_active: boolean;
                    _id?: string;
               }>
          ) => {
               state.regionInput = action.payload;
          },
          setCountryInput: (
               state,
               action: PayloadAction<{
                    name: string;
                    is_active: boolean;
                    _id?: string;
               }>
          ) => {
               state.countryInput = action.payload;
          },
          handleRegionModal: (state, action: PayloadAction<boolean>) => {
               state.regionModal = action.payload;
          },
          handleCountryModal: (state, action: PayloadAction<boolean>) => {
               state.countryModal = action.payload;
          },

          setCityInput: (state, action: PayloadAction<typeof initialCity>) => {
               state.cityInput = action.payload;
          },
          handleCityModal: (state, action: PayloadAction<boolean>) => {
               state.cityModal = action.payload;
          },
          handleSelection: (
               state,
               action: PayloadAction<{
                    country: string;
                    region: string;
                    city: string;
                    country_code: string

               }>
          ) => {
               state.selection = action.payload;
          },
     },
});

export const GeoGraphicsSliceReducer = GeoGraphicSlice.reducer;
export const {
     setRegion,
     handleRegionModal,
     setRegionInput,
     setCity,
     handleCountryModal,
     setCountryInput,
     setCityInput,
     handleCityModal,
     handleSelection,
} = GeoGraphicSlice.actions;
export const useGeoGraphicsSlice = () =>
     useAppSelector((state) => state.geographic);
