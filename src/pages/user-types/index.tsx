import {
     AiOutlineDelete,
     AiOutlineEdit,
     AiOutlineSearch,
} from "react-icons/ai";
import {
     AppButton,
     AppInput,
     AppLoader,
     AppModal,
     AppTable,
     PageTitle,
} from "../../component";
import {
     useCreateUserTypeMutation,
     useDeleteUserTypeMutation,
     useGetAllUserTypeQuery,
     useUpdateUserTypeMutation,
} from "../../redux/api";
import { ColumnDef } from "@tanstack/react-table";
import { IUserType } from "../../interface";
import moment from "moment";
import clsx from "clsx";
import { useEffect } from "react";
import {
     handleAppError,
     handleAppSuccess,
     handleNewInputs,
     handleNewUserTypeModal,
     setSearchInput,
     setUserType,
     useUserTypeSlice,
} from "../../redux/slice";
import { useAppDispatch } from "../../redux";
import { Switch } from "@headlessui/react";

export const UserTypesPage = () => {
     const dispatch = useAppDispatch();
     const { filteredUserType, searchInput, newUserTypeModal, newInputs } =
          useUserTypeSlice();
     const { data, isError, error, isLoading, isSuccess } =
          useGetAllUserTypeQuery({ page: 1, size: 10 });
     const [
          NewUserType,
          {
               isLoading: isCreateLoading,
               isError: isCreateError,
               error: createError,
               data: createData,
               isSuccess: isCreateSuccess,
          },
     ] = useCreateUserTypeMutation();
     const [
          DeleteUserType,
          {
               isLoading: isDeleteLoading,
               isError: isDeleteError,
               error: deleteError,
               data: deleteData,
               isSuccess: isDeleteSuccess,
          },
     ] = useDeleteUserTypeMutation();
     const [
          UpdateUserType,
          {
               isLoading: isUpdateLoading,
               isError: isUpdateError,
               error: updateError,
               data: updateData,
               isSuccess: isUpdateSuccess,
          },
     ] = useUpdateUserTypeMutation();

     useEffect(() => {
          if (isSuccess) {
               dispatch(setUserType(data?.data));
          }
     }, [isSuccess, dispatch, data?.data]);

     useEffect(() => {
          if (isCreateSuccess) {
               dispatch(handleAppSuccess(createData?.message));
               dispatch(handleNewUserTypeModal(false));
               dispatch(handleNewInputs({ name: "" }));
          }
     }, [isCreateSuccess, dispatch, createData?.message]);

     useEffect(() => {
          if (isUpdateSuccess) {
               dispatch(handleAppSuccess(updateData?.message));
               dispatch(handleNewUserTypeModal(false));
               dispatch(handleNewInputs({ name: "", _id: "", active: false }));
          }
     }, [isUpdateSuccess, dispatch, updateData?.message]);

     useEffect(() => {
          if (isDeleteSuccess) {
               dispatch(handleAppSuccess(deleteData?.message));
          }
     }, [isDeleteSuccess, dispatch, deleteData?.message]);

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

     const columns: ColumnDef<IUserType>[] = [
          {
               accessorKey: "type_name",
               header: "Role Name",
               meta: {
                    className: "capitalize",
               },
          },
          {
               accessorKey: "is_active",
               header: "Account Status",
               meta: {
                    className:
                         "text-right flex items-center justify-end w-full",
               },
               cell: ({ row }) => {
                    return (
                         <div>
                              <p
                                   className={clsx(
                                        "px-3 py-1 rounded-lg text-center text-white",
                                        row.original.is_active &&
                                             "bg-green-500",
                                        !row.original.is_active && "bg-red-500"
                                   )}
                              >
                                   {row.original.is_active
                                        ? "Active"
                                        : "Inactive"}
                              </p>
                         </div>
                    );
               },
          },
          {
               header: "Created On",
               accessorKey: "created_at",
               meta: {
                    className: "text-right",
               },
               cell: ({ row }) => {
                    return (
                         <div>
                              {moment(row.original.created_at).format("lll")}
                         </div>
                    );
               },
          },
          {
               accessorKey: "_id",
               header: "Actions",
               meta: {
                    className: "text-right",
               },
               cell: ({ row }) => {
                    return (
                         <div className="flex items-center gap-3 justify-end pr-3">
                              <button
                                   onClick={() => {
                                        dispatch(handleNewUserTypeModal(true));
                                        dispatch(
                                             handleNewInputs({
                                                  name: row.original.type_name,
                                                  _id: row.original
                                                       ._id as string,
                                                  active: row.original
                                                       .is_active,
                                             })
                                        );
                                   }}
                                   className="p-2 bg-gray-300 rounded-lg"
                              >
                                   <AiOutlineEdit className="size-5" />
                              </button>
                              <button
                                   onClick={() =>
                                        handleDelete(row.original._id as string)
                                   }
                                   className="p-2 bg-gray-300 rounded-lg"
                              >
                                   <AiOutlineDelete className="size-5" />
                              </button>
                         </div>
                    );
               },
          },
     ];

     const handleSubmit = async () => {
          if (newInputs._id) {
               await UpdateUserType({
                    data: {
                         type_name: newInputs.name,
                         is_active: newInputs.active,
                    },
                    id: newInputs._id,
               });
          } else {
               await NewUserType({
                    type_name: newInputs.name,
                    is_active: true,
               });
          }
     };

     const handleDelete = async (id: string) => {
          await DeleteUserType(id);
     };
     return (
          <div>
               <PageTitle title="User Types" />
               <div className="my-5 flex items-center gap-5">
                    <div className="flex flex-1 gap-2 items-center border border-gray-500 rounded-lg px-3">
                         <AiOutlineSearch className="size-6 fill-gray-500" />
                         <input
                              value={searchInput}
                              onChange={(e) =>
                                   dispatch(setSearchInput(e.target.value))
                              }
                              type="search"
                              placeholder="Search user type"
                              className="bg-transparent placeholder:text-gray-500 w-full py-2 focus:outline-none"
                         />
                    </div>
                    <AppButton
                         onClick={() => dispatch(handleNewUserTypeModal(true))}
                    >
                         New User Type
                    </AppButton>
               </div>
               {!isLoading &&
                    !isDeleteLoading &&
                    !isError &&
                    filteredUserType && (
                         <div>
                              <AppTable
                                   tableTitle="regional admin"
                                   columns={columns}
                                   data={filteredUserType || []}
                              />
                         </div>
                    )}
               {isLoading && isDeleteLoading && isCreateLoading && (
                    <AppLoader />
               )}
               <AppModal
                    width="md"
                    action={handleSubmit}
                    btnTitle={newInputs._id ? "Save Changes" : "Save"}
                    isOpen={newUserTypeModal}
                    toggle={() => {
                         dispatch(handleNewUserTypeModal(false));
                         dispatch(
                              handleNewInputs({
                                   name: "",
                                   _id: "",
                                   active: false,
                              })
                         );
                    }}
                    modalTitle="New User Type"
                    btnLoader={isCreateLoading || isUpdateLoading}
               >
                    <div>
                         <AppInput
                              label="Role Name"
                              placeholder="Role Name"
                              value={newInputs.name}
                              onChange={(e) =>
                                   dispatch(
                                        handleNewInputs({
                                             ...newInputs,
                                             name: e.target.value as string,
                                        })
                                   )
                              }
                         />
                         {newInputs._id && <Switch></Switch>}
                    </div>
               </AppModal>
          </div>
     );
};
