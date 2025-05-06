import { useEffect, useState } from "react";
import {
     AppButton,
     AppInput,
     AppLoader,
     AppModal,
     PageTitle,
} from "../../component";
import {
     useCreateCategoryMutation,
     useDeleteCategoryMutation,
     useGetCategoriesQuery,
     useUpdateCategoryMutation,
} from "../../redux/api";
import { useAppDispatch } from "../../redux";
import {
     handleAppError,
     handleAppSuccess,
     handleCategoryModal,
     handleCategorySearch,
     initialInputs,
     setCategories,
     setCategoryInput,
     useAppSlice,
     useCategorySlice,
} from "../../redux/slice";
import {
     AiOutlineFilter,
     AiOutlinePlus,
     AiOutlineSearch,
} from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { TbEdit, TbTrash } from "react-icons/tb";

export const CategoryListPage = () => {
     const { data, isLoading, isError, error, isSuccess } =
          useGetCategoriesQuery();
     const [
          Update,
          {
               isLoading: isUpdateLoading,
               isError: isUpdateError,
               error: updateError,
               data: updateData,
               isSuccess: isUpdateSuccess,
          },
     ] = useUpdateCategoryMutation();
     const [
          New,
          {
               isLoading: isCreateLoading,
               isError: isCreateError,
               error: createError,
               data: createData,
               isSuccess: isCreateSuccess,
          },
     ] = useCreateCategoryMutation();
     const [
          Delete,
          {
               isLoading: isDeleteLoading,
               isError: isDeleteError,
               error: deleteError,
               data: deleteData,
               isSuccess: isDeleteSuccess,
          },
     ] = useDeleteCategoryMutation();

     const dispatch = useAppDispatch();
     const { categories, modal, input, searchInput } = useCategorySlice();
     const { appError } = useAppSlice();
     const navigate = useNavigate();
     const [deletingId, setDeletingId] = useState<string | null>(null);

     useEffect(() => {
          if (isSuccess) {
               dispatch(setCategories(data.data));
          }
     }, [isSuccess, data, dispatch]);

     useEffect(() => {
          if (isDeleteSuccess) {
               dispatch(handleAppSuccess(deleteData.message));
          }
     }, [isDeleteSuccess, deleteData?.message, dispatch]);

     useEffect(() => {
          if (isError) {
               const err = error as {
                    data?: { message: string };
                    message: string;
               };
               if (err.data) {
                    dispatch(handleAppError(err.data.message));
               } else {
                    dispatch(handleAppError(err.message));
               }
          }
     }, [dispatch, isError, error]);

     useEffect(() => {
          if (isCreateError) {
               const err = createError as {
                    data?: { message: string };
                    message: string;
               };
               if (err.data) {
                    dispatch(handleAppError(err.data.message));
               } else {
                    dispatch(handleAppError(err.message));
               }
          }
     }, [dispatch, isCreateError, createError]);

     useEffect(() => {
          if (isUpdateError) {
               const err = updateError as {
                    data?: { message: string };
                    message: string;
               };
               if (err.data) {
                    dispatch(handleAppError(err.data.message));
               } else {
                    dispatch(handleAppError(err.message));
               }
          }
     }, [dispatch, isUpdateError, updateError]);

     useEffect(() => {
          if (isDeleteError) {
               const err = deleteError as {
                    data?: { message: string };
                    message: string;
               };
               if (err.data) {
                    dispatch(handleAppError(err.data.message));
               } else {
                    dispatch(handleAppError(err.message));
               }
          }
     }, [dispatch, isDeleteError, deleteError]);

     useEffect(() => {
          if (isUpdateSuccess) {
               dispatch(handleAppSuccess(updateData.message));
               dispatch(setCategoryInput(initialInputs));
               dispatch(handleCategoryModal(false));
          }
     }, [updateData, dispatch, isUpdateSuccess]);

     useEffect(() => {
          if (isCreateSuccess) {
               dispatch(handleAppSuccess(createData?.message as string));
               dispatch(setCategoryInput(initialInputs));
               dispatch(handleCategoryModal(false));
          }
     }, [createData, dispatch, isCreateSuccess]);

     const handleSubmit = async () => {
          if (input.name.trim() === "")
               return dispatch(handleAppError("Category name is required"));
          if (input.id) {
               return await Update({
                    _id: input.id as string,
                    name: input.name,
               });
          } else {
               return await New({ name: input.name });
          }
     };

     const toggleActivation = async ({
          current,
          id,
     }: {
          id: string;
          current: boolean;
     }) => {
          return await Update({ _id: id, is_active: !current });
     };

     const handleDelete = async (id: string) => {
          setDeletingId(id);
          await Delete(id);
          setDeletingId(null);
     };

     return (
          <div className="space-y-5">
               <PageTitle
                    title="Product Categories"
                    subTitle="List of product categories"
               />
               <div className="bg-gray-100 my-5 px-5 py-5 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between gap-5">
                         <div className="flex items-center gap-5 flex-1">
                              <button className="flex gap-2 items-center border px-2 border-gray-500 rounded-lg py-2 text-gray-500">
                                   <AiOutlineFilter className="size-6" />
                                   Filter
                              </button>
                              <div className="flex bg-white flex-1 gap-2 items-center border border-gray-500 rounded-lg px-3">
                                   <AiOutlineSearch className="size-6 fill-gray-500" />
                                   <input
                                        value={searchInput}
                                        onChange={(e) =>
                                             dispatch(
                                                  handleCategorySearch(
                                                       e.target.value
                                                  )
                                             )
                                        }
                                        type="search"
                                        placeholder="Search category"
                                        className="bg-transparent placeholder:text-gray-500 w-full py-2 focus:outline-none"
                                   />
                              </div>
                         </div>
                         <div className="flex items-center gap-5 w-1/3">
                              <AppButton
                                   fullWidth
                                   onClick={() => navigate("/demo")}
                              >
                                   Products
                              </AppButton>
                              <AppButton
                                   fullWidth
                                   onClick={() =>
                                        dispatch(handleCategoryModal(true))
                                   }
                              >
                                   <AiOutlinePlus className="size-6" />
                                   Category
                              </AppButton>
                              <button>
                                   <IoFilterOutline className="size-6" />
                              </button>
                         </div>
                    </div>
               </div>

               {(isLoading || isUpdateLoading || isCreateLoading) && (
                    <AppLoader />
               )}
               {(!isLoading || !isUpdateLoading || !isCreateLoading) && (
                    <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 grid-cols-12 my-10 gap-x-4 gap-y-10">
                         {categories &&
                              categories.map((category, i) => (
                                   <div
                                        key={i}
                                        className="relative w-full rounded-lg border border-gray-100 bg-white shadow-md p-3"
                                   >
                                        <h6 className="capitalize truncate">
                                             {category.name}
                                        </h6>

                                        <div className="flex justify-between px-0 items-center">
                                             <button
                                                  type="button"
                                                  onClick={() =>
                                                       toggleActivation({
                                                            current: category.is_active,
                                                            id: category._id as string,
                                                       })
                                                  }
                                                  className="mt-5 cursor-pointer"
                                             >
                                                  {category.is_active ? (
                                                       <span className="text-green-500 py-1 px-4 hover:bg-green-100">
                                                            Active
                                                       </span>
                                                  ) : (
                                                       <span className="text-red-500 py-1 px-4 hover:bg-red-100">
                                                            Inactive
                                                       </span>
                                                  )}
                                             </button>
                                             <div className="flex items-center gap-3">
                                                  <AppButton
                                                       onClick={() => {
                                                            dispatch(
                                                                 setCategoryInput(
                                                                      {
                                                                           name: category.name,
                                                                           id: category._id as string,
                                                                           is_active:
                                                                                category.is_active,
                                                                      }
                                                                 )
                                                            );
                                                            dispatch(
                                                                 handleCategoryModal(
                                                                      true
                                                                 )
                                                            );
                                                       }}
                                                       className="mt-5 bg-primary-500 p-1 px-4 rounded-md"
                                                  >
                                                       <TbEdit className="size-5" />
                                                  </AppButton>
                                                  <AppButton
                                                       loading={
                                                            deletingId ===
                                                            category._id
                                                       }
                                                       onClick={() =>
                                                            handleDelete(
                                                                 category._id as string
                                                            )
                                                       }
                                                       className="mt-5 bg-red-500 p-1 px-4 rounded-md"
                                                  >
                                                       <TbTrash className="size-5" />
                                                  </AppButton>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                    </div>
               )}
               <AppModal
                    btnTitle="Save Category"
                    isOpen={modal}
                    action={handleSubmit}
                    width="md"
                    modalTitle="Create new category for the product"
                    toggle={() => {
                         dispatch(handleCategoryModal(false));
                         dispatch(setCategoryInput(initialInputs));
                    }}
                    subTitle={appError ? appError : ""}
               >
                    <AppInput
                         value={input.name}
                         onChange={(e) =>
                              dispatch(
                                   setCategoryInput({
                                        ...input,
                                        name: e.target.value,
                                   })
                              )
                         }
                         placeholder="e.g. Technology"
                         label="Write name"
                    />
               </AppModal>
          </div>
     );
};
