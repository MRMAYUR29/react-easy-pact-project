import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { AppButton, AppLoader, AppTable, PageTitle } from "../../component";
import { IUserProps } from "../../interface";
import clsx from "clsx";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { useGetAllUsersQuery } from "../../redux/api"; // Keep this
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
import { PaginationState } from "@tanstack/react-table";

export const ApproveUser = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } =
    useGetAllUsersQuery(); // Add refetch here
  const { users, searchUserInput } = useUserSlice();
  const { appUser } = useAppSlice();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // initial page index
    pageSize: 50, // initial page size
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null);
  const [updateUser] = useUpdateUserMutation();

  // Define the role display names
  const roleDisplayNames: { [key: string]: string } = {
    admin: "The Maestro",
    regional: "Experience Leader",
    employee: "Virtual Guide",
  };

  const handleEditUser = (user: IUserProps) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (values: IUserProps) => {
    if (!selectedUser?._id) return;

    try {
      await updateUser({
        id: selectedUser._id,
        data: values,
      }).unwrap();

      setIsEditModalOpen(false);
      dispatch(handleAppSuccess("User updated successfully"));
      // Refetch all users to update the table after an edit
      refetch();
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

  useEffect(() => {
    if (isSuccess && data?.data) {
      // Filter out only inactive (rejected) users to set in the Redux store
      const rejectedUsers = data.data.filter(
        (user: IUserProps) => !user.is_active
      );
      dispatch(setUsers(rejectedUsers));
    }
  }, [isSuccess, dispatch, data?.data]);

  const columns: ColumnDef<IUserProps>[] = [
    {
      accessorKey: "seS_id",
      header: "SESA ID",
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
      cell: ({ row }) => {
        const roleTypeName = row.original.user_type_id.type_name;
        return (
          <p className="text-sm text-gray-600">
            {roleDisplayNames[roleTypeName] || roleTypeName}
          </p>
        );
      },
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
        const [updateUser] = useUpdateUserMutation();
        const dispatch = useAppDispatch();

        const handleToggle = async () => {
          if (!row.original._id) {
            dispatch(handleAppError("User ID is missing"));
            return;
          }

          const newStatus = !row.original.is_active;
          try {
            await updateUser({
              id: row.original._id,
              data: { is_active: newStatus, isApproved: newStatus }, // Update both is_active and isApproved
            }).unwrap();

            dispatch(
              handleAppSuccess(
                `User status updated to ${newStatus ? "Approved" : "Rejected"}`
              )
            );
            // After successfully updating a user's status, refetch all users
            // This will cause the useEffect to run again and filter out the approved user
            refetch();
          } catch (error) {
            const err = error as {
              data?: { message: string };
              message: string;
            };
            dispatch(handleAppError(err.data?.message || err.message));
          }
        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                row.original.is_active ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  row.original.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={clsx(
                "capitalize text-sm",
                row.original.is_active ? "text-green-500" : "text-red-500"
              )}
            >
              {row.original.is_active ? "Approved" : "Rejected"}
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
              </div>
            ),
          },
        ]
      : []),
  ];

  const filteredUsers = users?.filter(
    (user) =>
      // Filter by search input first
      user.name.toLowerCase().includes(searchUserInput.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUserInput.toLowerCase()) ||
      user.seS_id.toLowerCase().includes(searchUserInput.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageTitle title="Approve User" />
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
            data={filteredUsers || []} // Use the filteredUsers here
            tableClassName="border border-gray-300"
            rowClassName="border border-gray-200"
            pagination={pagination}
            setPagination={setPagination}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />
        </div>
      )}

      {isLoading && <AppLoader />}
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit User - ${selectedUser?.name || ""}`}
      >
        {selectedUser && (
          <UserForm
            initialValues={{
              ...selectedUser,
              confirmPassword: "", // Add if needed
            }}
            onSubmit={handleUpdateUser}
            onCancel={() => setIsEditModalOpen(false)}
            isEdit={true}
            dispatch={dispatch}
          />
        )}
      </Modal>
    </div>
  );
};
