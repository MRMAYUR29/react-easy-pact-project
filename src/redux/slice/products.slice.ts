import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DemoProps, IMapProductProps } from "../../interface";
import { useAppSelector } from "..";

export interface ProductSliceProps {
     products: DemoProps[] | null;
     filteredProducts: DemoProps[] | null;
     filterOption: filterType;
     searchInput: string;
     files: {
          thumbnailFile: File | null;
          sourceFile: File | File[] | null;
     };
     fileUrls: {
          thumbnailUrl: string | null;
          sourceUrl: string[] | string | null;
     };
     assignProductModal: boolean;
     assignment: IMapProductProps | null;
}

const initialState: ProductSliceProps = {
     products: null,
     filteredProducts: null,
     filterOption: "newToOld",
     searchInput: "",
     files: {
          thumbnailFile: null,
          sourceFile: null,
     },
     fileUrls: {
          sourceUrl: null,
          thumbnailUrl: null,
     },
     assignProductModal: false,
     assignment: null,
};
export type filterType = "newToOld" | "oldToNew" | "recentlyLaunched" | "all";
const productSlice = createSlice({
     name: "product",
     initialState,
     reducers: {
          handleProducts: (
               state,
               action: PayloadAction<DemoProps[] | null>
          ) => {
               if (!action.payload) {
                    state.products = null;
                    state.filteredProducts = null;
                    return;
               }

               state.products = action.payload;
               state.filteredProducts = [...action.payload];
          },

          setFilterOption: (state, action: PayloadAction<filterType>) => {
               state.filterOption = action.payload;

               if (!state.products) return;

               const sortedProducts = [...state.products];

               if (action.payload === "newToOld") {
                    sortedProducts.sort(
                         (a, b) =>
                              new Date(b.created_at as Date).getTime() -
                              new Date(a.created_at as Date).getTime()
                    );
               } else if (action.payload === "oldToNew") {
                    sortedProducts.sort(
                         (a, b) =>
                              new Date(a.created_at as Date).getTime() -
                              new Date(b.created_at as Date).getTime()
                    );
               }
               if (action.payload === "all") {
                    state.filteredProducts = state.products;
               }

               state.filteredProducts = sortedProducts;
          },
          handleProductSearch: (state, action: PayloadAction<string>) => {
               state.searchInput = action.payload.trim(); // Trim unnecessary spaces

               if (!state.products) {
                    state.filteredProducts = null; // Handle case where products don't exist
                    return;
               }

               if (state.searchInput.length > 0) {
                    state.filteredProducts = state.products.filter(
                         (product) => {
                              const titleMatch = product.title
                                   ?.toLowerCase()
                                   .includes(state.searchInput.toLowerCase());
                              const categoryMatch =
                                   product.product_category_id?.name
                                        ?.toLowerCase()
                                        .includes(
                                             state.searchInput.toLowerCase()
                                        );

                              return titleMatch || categoryMatch;
                         }
                    );
               } else {
                    state.filteredProducts = [...state.products]; // Reset to original list
               }
          },
          handleFilterCategory: (state, action: PayloadAction<string>) => {
               if (action.payload === "all") {
                    state.filteredProducts = state.products; // Assign products directly
               } else {
                    state.filteredProducts =
                         (state.products ?? state.products)?.filter(
                              (product) =>
                                   product?.product_category_id?._id ===
                                   action.payload
                         ) || []; // Ensure it never becomes undefined
               }
          },
          handleFiles: (
               state,
               action: PayloadAction<{
                    thumbnailFile: File | null;
                    sourceFile: File | File[] | null;
               }>
          ) => {
               state.files = action.payload;
          },
          handleFileUrls: (
               state,
               action: PayloadAction<{
                    thumbnailUrl?: string | null;
                    sourceUrl?: string | string[] | null;
               }>
          ) => {
               state.fileUrls = {
                    ...state.fileUrls,
                    ...action.payload,
               };
          },
          handleAssignProductModal: (state, action: PayloadAction<boolean>) => {
               state.assignProductModal = action.payload;
          },
          handleDemoAssignment: (
               state,
               action: PayloadAction<IMapProductProps | null>
          ) => {
               state.assignment = action.payload;
          },
          clearFiles: (state) => {
               state.fileUrls = {
                    sourceUrl: null,
                    thumbnailUrl: null
               }
               state.files = {
                    thumbnailFile: null,
                    sourceFile: null,
               };
          }
     },
});

export const ProductSliceReducer = productSlice.reducer;
export const {
     handleProducts,
     setFilterOption,
     handleProductSearch,
     handleFilterCategory,
     handleFiles,
     handleFileUrls,
     handleAssignProductModal,
     handleDemoAssignment,
     clearFiles
} = productSlice.actions;
export const useProductSlice = () => useAppSelector((state) => state.product);
