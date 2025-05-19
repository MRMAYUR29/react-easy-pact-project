import { ColumnDef } from "@tanstack/react-table";
import { AppButton, AppLoader, AppTable, PageTitle } from "../../component";
import { IUserProps } from "../../interface";
import clsx from "clsx";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { useGetAllUsersQuery } from "../../redux/api";
import {
  handleAppError,
  handleAppSuccess,
  handleUserSearch,
  setUsers,
  useAppSlice,
  useUserSlice,
} from "../../redux/slice";
import { useAppDispatch } from "../../redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../component/UI/newModal";
import { UserForm } from "../user-edit";
import { useUpdateUserMutation } from "../../redux/api";

export const UsersListPage = () => {
  const { data, isLoading, isError, error, isSuccess } = useGetAllUsersQuery();
  // const [
  //   Delete,
  //   {
  //     isLoading: isDeleteLoading,
  //     isError: isDeleteError,
  //     error: deleteError,
  //     data: deleteData,
  //     isSuccess: isDeleteSuccess,
  //   },
  // ] = useDeleteUserMutation();
  const { users, searchUserInput } = useUserSlice();
  const { appUser, role } = useAppSlice();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null);
  const [updateUser] = useUpdateUserMutation();

  const handleEditUser = (user: IUserProps) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (values: IUserProps) => {
    if (!selectedUser?._id) return;
    
    try {
      await updateUser({
        id: selectedUser._id,
        data: values
      }).unwrap();
      
      setIsEditModalOpen(false);
      dispatch(handleAppSuccess("User updated successfully"));
    } catch (error) {
      const err = error as { data?: { message: string }; message: string };
      dispatch(handleAppError(err.data?.message || err.message));
    }
  };

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

  // useEffect(() => {
  //   if (isDeleteError) {
  //     const err = deleteError as {
  //       data?: { message: string };
  //       message: string;
  //     };
  //     if (err.data) {
  //       dispatch(handleAppError(err.data.message));
  //     } else {
  //       dispatch(handleAppError(err.message));
  //     }
  //   }
  // }, [dispatch, isDeleteError, deleteError]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUsers(data?.data));
    }
  }, [isSuccess, dispatch, data?.data]);

  // useEffect(() => {
  //   if (isDeleteSuccess) {
  //     dispatch(handleAppSuccess(deleteData.message));
  //   }
  // }, [isDeleteSuccess, dispatch, deleteData?.message]);
  

  const columns: ColumnDef<IUserProps>[] = [
    {
      accessorKey: "seS_id",
      header: "SESA ID"
    },
    {
      accessorKey: "Account name",
      header: "Account Name",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-bold capitalize">
            {row.original.name}{" "}
            {appUser?._id === row.original._id && (
              <span className="text-xs text-primary-500">(You)</span>
            )}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "user_type_id.type_name",
      header: "Role",
    },
    {
      accessorKey: "mobile",
      header: "Mobile No.",
      cell: ({ row }) => (
        <p className="text-sm text-gray-600">{row.original.mobile}</p>
      ),
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => (
        <p className="text-sm text-gray-600">{row.original.email}</p>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Account Status",
      cell: ({ row }) => {
        const [isActive, setIsActive] = useState(row.original.is_active);
        
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={clsx(
              "capitalize text-sm",
              isActive ? "text-green-500" : "text-red-500"
            )}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    ...(appUser?.user_type_id.type_name === "admin"
      ? [
          {
            accessorKey: "_id",
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEditUser(row.original)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded"
                >
                  <AiOutlineEdit className="size-5 text-blue-600" />
                </button>
                {/* <button
                  onClick={() => handleDeleteUser(row.original._id)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded"
                >
                  <AiOutlineDelete className="size-5 text-red-600" />
                </button> */}
              </div>
            ),
          },
        ]
      : []),
  ];


  // const handleDeleteUser = async (id: string) => {
  //   if (users?.length === 1) {
  //     dispatch(handleAppError("You cannot delete the last user"));
  //   }
  //   if (appUser === null || appUser._id === id) {
  //     dispatch(handleAppError("You cannot delete yourself"));
  //   } else {
  //     await Delete(id);
  //   }
  // };

  return (
    <div className="space-y-5">
      <PageTitle title="Users Management" />
      <div className="flex items-center gap-5">
        <div className="flex flex-1 gap-2 items-center border border-gray-500 rounded-lg px-3">
          <AiOutlineSearch className="size-6 fill-gray-500" />
          <input
            value={searchUserInput}
            onChange={(e) => dispatch(handleUserSearch(e.target.value))}
            type="search"
            placeholder="Search users"
            className="bg-transparent placeholder:text-gray-500 w-full py-2 focus:outline-none"
          />
        </div>
        {appUser?.user_type_id.type_name === "admin" && (
          <AppButton onClick={() => navigate("/new-users?role=admin")}>
            Add User
          </AppButton>
        )}
      </div>

      {!isLoading && isSuccess && (
        <div className="my-10">
          <AppTable
            tableTitle="admin"
            columns={columns}
            data={
              users?.filter((user) =>
                role === "regional"
                  ? user.user_type_id.type_name === "employee"
                  : true
              ) || []
            }
            tableClassName="border border-gray-300" // Ensure your AppTable passes this to <table />
            rowClassName="border border-gray-200"   // Optional, for row styling
          />
        </div>
      )}

      {isLoading && <AppLoader />}
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit User - ${selectedUser?.name || ''}`}
      >
        {selectedUser && (
          <UserForm
            initialValues={{
              ...selectedUser,
              confirmPassword: "", // Add if needed
            }}
            onSubmit={handleUpdateUser}
            isEdit={true}
            // roles={roles}
            // regions={regions}
            // countries={countries}
            // cities={cities}
            // selectedGeoGraphics={selectedGeoGraphics}
            dispatch={dispatch}
          />
        )}
      </Modal>
    </div>
  );
};
