import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { IUserType } from "../../interface";

export interface IUserTypeSliceProps {
     userType: IUserType[] | null;
     filteredUserType: IUserType[] | null;
     searchInput: string;
     newUserTypeModal: boolean;
     newInputs: {
          name: string;
          _id?: string;
          active?: boolean;
     };
}

const initialState: IUserTypeSliceProps = {
     userType: null,
     filteredUserType: null,
     newUserTypeModal: false,
     searchInput: "",
     newInputs: {
          name: "",
          _id: "",
          active: false,
     },
};

const userSlice = createSlice({
     name: "userType",
     initialState,
     reducers: {
          setUserType: (state, action: PayloadAction<IUserType[] | null>) => {
               if (!action.payload) {
                    state.userType = null;
                    state.filteredUserType = null;
                    return;
               }

               state.userType = action.payload;
               state.filteredUserType = [...action.payload];
          },
          setSearchInput: (state, action: PayloadAction<string>) => {
               state.searchInput = action.payload.trim(); // Trim unnecessary spaces
               if (!state.userType) {
                    state.filteredUserType = null; // Handle case where products don't exist
                    return;
               }
               if (state.searchInput.length > 0) {
                    state.filteredUserType = state.userType.filter((userType) =>
                         userType.type_name
                              ?.toLowerCase()
                              .includes(state.searchInput.toLowerCase())
                    );
               } else {
                    state.filteredUserType = [...state.userType];
               }
          },
          handleNewUserTypeModal: (state, action: PayloadAction<boolean>) => {
               state.newUserTypeModal = action.payload;
          },
          handleNewInputs: (
               state,
               action: PayloadAction<{
                    name: string;
                    _id?: string;
                    active?: boolean;
               }>
          ) => {
               state.newInputs = action.payload;
          },
     },
});

export const userTypeSliceReducer = userSlice.reducer;
export const {
     setUserType,
     setSearchInput,
     handleNewUserTypeModal,
     handleNewInputs,
} = userSlice.actions;
export const useUserTypeSlice = () =>
     useAppSelector((state) => {
          return state.userType;
     });
