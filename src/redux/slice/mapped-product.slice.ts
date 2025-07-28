import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { IMapProductProps } from "../../interface";

export interface AssignedUser {
     _id?: string,
     id: string;
     name: string;
   }

export interface mappedProductSliceProps {
     mappedProduct: IMapProductProps[] | null;
     assignedUsers: AssignedUser[];
}

const initialState: mappedProductSliceProps = {
     mappedProduct: null,
     assignedUsers: [],
};

const mappedProductSlice = createSlice({
     initialState,
     name: "mappedProduct",
     reducers: {
          setMappedProduct: (
               state: mappedProductSliceProps,
               action: PayloadAction<IMapProductProps[] | null>
          ) => {
               state.mappedProduct = action.payload;
          },
          setAssignedUsers: {
               reducer: (
                 state: mappedProductSliceProps,
                 action: PayloadAction<{ id: string; name: string } | { id: string; name: string }[]>
               ) => {
                 if (Array.isArray(action.payload)) {
                   state.assignedUsers = action.payload;
                 } else {
                   state.assignedUsers.push(action.payload);
                 }
               },
               prepare: (payload: { id: string; name: string } | { id: string; name: string }[]) => {
                 return { payload };
               }
             },
          removeAssignedUser: (state, action: PayloadAction<string>) => {
               state.assignedUsers.splice(
                    state.assignedUsers.findIndex(
                         (user) => user.id === action.payload
                    ),
                    1
               );
          },
          clearAssignedUser: (state) => {
               state.assignedUsers = [];
          },
     },
});

export const MappedProductSliceReducer = mappedProductSlice.reducer;
export const {
     setMappedProduct,
     setAssignedUsers,
     removeAssignedUser,
     clearAssignedUser,
} = mappedProductSlice.actions;
export const useMappedProductSlice = () =>
     useAppSelector((state) => state.mappedProduct);
