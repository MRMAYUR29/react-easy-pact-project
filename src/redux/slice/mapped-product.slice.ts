import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { IMapProductProps } from "../../interface";

export interface mappedProductSliceProps {
     mappedProduct: IMapProductProps[] | null;
     assignedUsers: {
          id: string;
          name: string;
     }[];
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
          setAssignedUsers: (
               state: mappedProductSliceProps,
               action: PayloadAction<{ id: string; name: string }>
          ) => {
               state.assignedUsers.push(action.payload);
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
