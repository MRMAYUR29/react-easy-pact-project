import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { IUserProps } from "../../interface";

export interface UserSliceProps {
     users: IUserProps[] | null;
     originalUsers: IUserProps[] | null;
     searchUserInput: string;
     geoGraphics: {
          selectedCountry:
          | {
               label: string;
               value: string;
          }[]
          | null;
          selectedRegion:
          | {
               label: string;
               value: string;
          }[]
          | null;
          selectedCity:
          | {
               label: string;
               value: string;
          }[]
          | null;
     };
     selectedGeoGraphics: {
          country: string;
          region: string;
          city: string;
     };
}

const initialState: UserSliceProps = {
     users: null,
     originalUsers: null,
     searchUserInput: "",
     geoGraphics: {
          selectedCity: null,
          selectedCountry: null,
          selectedRegion: null,
     },
     selectedGeoGraphics: {
          city: "",
          country: "",
          region: "",
     },
};

const UserSlice = createSlice({
     initialState,
     name: "user",
     reducers: {
          setUsers: (state, action: PayloadAction<IUserProps[] | null>) => {
               state.users = action.payload;
          },
          handleUserSearch: (state, action: PayloadAction<string>) => {
               state.searchUserInput = action.payload.toLowerCase();

               if (!state.originalUsers) {
                    state.originalUsers = state.users; // Store original list if not already stored
               }

               state.users = state.originalUsers?.filter((user) => {
                    const searchValue = state.searchUserInput;

                    return (
                         user.name.toLowerCase().includes(searchValue) || // Search by Name
                         user.email.toLowerCase().includes(searchValue) || // Search by Email
                         user.mobile.includes(searchValue) || // Search by Mobile Number
                         user.designation.toLowerCase().includes(searchValue) || // Search by Designation
                         user.department.toLowerCase().includes(searchValue) || // Search by Department
                         user.region_id?.name?.toLowerCase().includes(searchValue) || // Search by Region
                         user.country_id?.name?.toLowerCase().includes(searchValue) || // Search by Country
                         user.city_id?.name?.toLowerCase().includes(searchValue) || // Search by City
                         user.user_type_id?.type_name?.toLowerCase().includes(searchValue) // Search by User Type
                    );
               }) as IUserProps[];
          },

          setGeoGraphicsRegion: (
               state,
               action: {
                    payload: {
                         label: string;
                         value: string;
                    }[];
               }
          ) => {
               state.geoGraphics.selectedRegion = action.payload;
          },
          setGeoGraphicsCountry: (
               state,
               action: {
                    payload: {
                         label: string;
                         value: string;
                    }[];
               }
          ) => {
               state.geoGraphics.selectedCountry = action.payload;
          },
          setGeoGraphicsCity: (
               state,
               action: {
                    payload: {
                         label: string;
                         value: string;
                    }[];
               }
          ) => {
               state.geoGraphics.selectedCity = action.payload;
          },
          setSelectedGeoGraphics: (
               state,
               action: {
                    payload: {
                         country: string;
                         region: string;
                         city: string;
                    };
               }
          ) => {
               state.selectedGeoGraphics = action.payload;
          },
     },
});

export const UserSliceReducer = UserSlice.reducer;
export const {
     setUsers,
     setGeoGraphicsCity,
     setGeoGraphicsCountry,
     setGeoGraphicsRegion,
     setSelectedGeoGraphics,
     handleUserSearch
} = UserSlice.actions;
export const useUserSlice = () => useAppSelector((state) => state.user);
