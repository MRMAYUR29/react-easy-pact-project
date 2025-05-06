import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { ICategoryProps } from "../../interface";

interface CategorySliceProps {
     categories: ICategoryProps[] | null;
     originalCategories: ICategoryProps[] | null;
     modal: boolean;
     input: {
          id?: string;
          name: string;
          is_active?: boolean;
     };
     searchInput: string;
}
export const initialInputs = {
     name: "",
     id: "",
     is_active: false,
};

const initialState: CategorySliceProps = {
     categories: null,
     originalCategories: null,
     modal: false,
     input: initialInputs,
     searchInput: "",
};

const CategorySlice = createSlice({
     initialState,
     name: "category",
     reducers: {
          setCategories: (
               state,
               action: PayloadAction<ICategoryProps[] | null>
          ) => {
               state.categories = action.payload;
               state.originalCategories = action.payload;
          },
          setCategoryInput: (
               state,
               action: PayloadAction<{
                    name: string;
                    id?: string;
                    is_active?: boolean;
               }>
          ) => {
               state.input = action.payload;

          },
          handleCategoryModal: (state, action: PayloadAction<boolean>) => {
               state.modal = action.payload;
          },
          handleCategorySearch: (state, action: PayloadAction<string>) => {
               state.searchInput = action.payload;
               if (!state.originalCategories) {
                    // Store the original list before filtering for the first time
                    state.originalCategories = state.categories;
               }

               state.categories = state.originalCategories?.filter((category) =>
                    category.name.toLowerCase().includes(action.payload.toLowerCase())
               ) as ICategoryProps[];
          },

     },
});

export const CategorySliceReducer = CategorySlice.reducer;
export const { setCategories, handleCategoryModal, setCategoryInput, handleCategorySearch } =
     CategorySlice.actions;
export const useCategorySlice = () => useAppSelector((state) => state.category);
