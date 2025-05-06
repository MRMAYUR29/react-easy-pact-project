import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { IUserProps } from "../../interface";

export interface AppSliceProps {
     token: string | null;
     role: string | null;
     sideNav: boolean;
     appError: string | null;
     appUser: IUserProps | null;
     appSuccess: string | null;
     toastTimer: number;
}

const initialState: AppSliceProps = {
     token: null,
     role: null,
     appError: null,
     sideNav: true,
     appUser: null,
     appSuccess: null,
     toastTimer: 5000,
};

const appSlice = createSlice({
     initialState,
     name: "app",
     reducers: {
          setToken: (
               state,
               action: PayloadAction<{
                    token: string | null;
                    role: string | null;
                    user: IUserProps | null;
               }>
          ) => {
               state.token = action.payload.token;
               state.role = action.payload.role;
               state.appUser = action.payload.user;
          },
          toggleSideNav: (state) => {
               state.sideNav = !state.sideNav;
          },
          handleAppError: (state, action: PayloadAction<string | null>) => {
               state.appError = action.payload;
          },
          handleAppSuccess: (state, action: PayloadAction<string | null>) => {
               state.appSuccess = action.payload;
          },
     },
});

export const useAppSlice = () =>
     useAppSelector((state) => {
          return state.app;
     });
export const appReducer = appSlice.reducer;
export const { setToken, toggleSideNav, handleAppError, handleAppSuccess, } =
     appSlice.actions;
