import { ColumnDef } from "@tanstack/react-table";
import { AppButton, AppLoader, AppTable, PageTitle } from "../../component";
import { IUserProps } from "../../interface";
import clsx from "clsx";
import {
  AiOutlineEdit,
  AiOutlineSearch,
  AiOutlineDelete,
} from "react-icons/ai";
import {
  useAllUsersQuery,
  useUpdateUserMutation,
  useGetAllUserTypeQuery,
  useDeleteUserMutation,
} from "../../redux/api";
import {
  useGetAllRegionQuery,
  useGetCountriesQuery,
} from "../../redux/api/geographic.api";

import {
  handleAppError,
  handleAppSuccess,
  handleUserSearch,
  setUsers,
  useAppSlice,
  useUserSlice,
  setSelectedGeoGraphics,
} from "../../redux/slice";
import { useAppDispatch } from "../../redux";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../component/UI/newModal";
import { UserForm } from "../user-edit";
import { PaginationState, RowSelectionState } from "@tanstack/react-table";

export const UsersListPage = () => {
  const { data, isLoading, isError, error, isSuccess } = useAllUsersQuery();
  const { users, searchUserInput, selectedGeoGraphics } = useUserSlice();
  const { appUser, role } = useAppSlice();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    data: rolesData,
    isError: rolesError,
    error: rolesApiError,
  } = useGetAllUserTypeQuery({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // State to manage pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  // State to manage row selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Memoize the selected user IDs from the rowSelection object
  const selectedUserIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  );

  const {
    data: regionsData,
    isError: regionsError,
    error: regionsApiError,
  } = useGetAllRegionQuery();

  const {
    data: countriesData,
    isError: countriesError,
    error: countriesApiError,
    isFetching: isCountriesFetching,
  } = useGetCountriesQuery(selectedGeoGraphics.region, {
    skip: !selectedGeoGraphics.region,
  });

  console.log("Countries query state:", {
    regionParam: selectedGeoGraphics.region,
    isFetching: isCountriesFetching,
    data: countriesData,
    error: countriesError,
    skipCondition: !selectedGeoGraphics.region,
  });

  console.log("Regions data:", regionsData);

  const roleDisplayNames: { [key: string]: string } = {
    admin: "The Maestro",
    regional: "Experience Leader",
    employee: "Virtual Guide",
  };

  const handleEditUser = (user: IUserProps) => {
    console.log("Edit clicked - Raw user data:", user);

    const regionId =
      typeof user.region_id === "string"
        ? user.region_id
        : user.region_id?._id || "";

    const countryId =
      typeof user.country_id === "string"
        ? user.country_id
        : user.country_id?._id || "";

    console.log("Processed IDs:", { regionId, countryId });

    setSelectedUser(user);

    dispatch(
      setSelectedGeoGraphics({
        region: regionId,
        country: countryId,
      })
    );

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
      // RTK Query's invalidation will handle refetching, maintaining pagination.
    } catch (error) {
      const err = error as { data?: { message: string }; message: string };
      dispatch(handleAppError(err.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (user: IUserProps) => {
    if (!user._id) {
      dispatch(handleAppError("User ID is missing for deletion"));
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        await deleteUser(user._id).unwrap();
        dispatch(handleAppSuccess(`User "${user.name}" deleted successfully`));
        // RTK Query will refetch, maintaining pagination.
        // If the deleted user was selected, clear it from selection
        setRowSelection((prev) => {
          const newSelection = { ...prev };
          delete newSelection[user._id!];
          return newSelection;
        });
      } catch (error) {
        const err = error as { data?: { message: string }; message: string };
        dispatch(handleAppError(err.data?.message || err.message));
      }
    }
  };

  // New: Bulk update function
  const handleBulkUpdateStatus = async (newStatus: boolean) => {
    if (selectedUserIds.length === 0) {
      dispatch(handleAppError("No users selected for bulk update."));
      return;
    }

    const confirmAction = window.confirm(
      `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } ${selectedUserIds.length} selected user(s)?`
    );

    if (!confirmAction) {
      return;
    }

    try {
      // Execute all update mutations concurrently
      const promises = selectedUserIds.map((id) =>
        updateUser({ id, data: { is_active: newStatus } }).unwrap()
      );
      await Promise.all(promises);

      dispatch(
        handleAppSuccess(
          `${selectedUserIds.length} user(s) status updated successfully!`
        )
      );
      setRowSelection({}); // Clear selection after bulk update
    } catch (error) {
      const err = error as { data?: { message: string }; message: string };
      dispatch(
        handleAppError(`Bulk update failed: ${err.data?.message || err.message}`)
      );
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
    if (rolesError) {
      const err = rolesApiError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(`Roles Error: ${err.data.message}`));
      } else {
        dispatch(handleAppError(`Roles Error: ${err.message}`));
      }
    }
  }, [dispatch, rolesError, rolesApiError]);

  useEffect(() => {
    if (regionsError) {
      const err = regionsApiError as {
        data?: { message: string };
        message: string;
      };
      dispatch(
        handleAppError(`Regions Error: ${err.data?.message || err.message}`)
      );
    }
  }, [dispatch, regionsError, regionsApiError]);

  useEffect(() => {
    if (countriesError) {
      const err = countriesApiError as {
        data?: { message: string };
        message: string;
      };
      dispatch(
        handleAppError(`Countries Error: ${err.data?.message || err.message}`)
      );
    }
  }, [dispatch, countriesError, countriesApiError]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUsers(data.data));
    }
  }, [isSuccess, dispatch, data?.data]);

  const columns: ColumnDef<IUserProps>[] = useMemo(
    () => [
      // NEW: Selection Checkbox Column
      {
        id: "select", // Unique ID for the selection column
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="form-checkbox h-4 w-4 text-primary-600 rounded"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="form-checkbox h-4 w-4 text-primary-600 rounded"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-10", // Small width for checkbox column
        },
      },
      {
        accessorKey: "seS_id",
        header: "SESA ID",
        meta: {
          className: "w-1/6",
        },
      },
      {
        accessorKey: "name", // Corrected accessorKey
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
        meta: {
          className: "w-2/6",
        },
      },
      {
        accessorKey: "user_type_id.type_name",
        header: "Role",
        cell: ({ row }) => {
          const roleTypeName = row.original.user_type_id?.type_name; // Add null check
          return (
            <p className="text-sm text-gray-600">
              {roleTypeName ? roleDisplayNames[roleTypeName] || roleTypeName : "N/A"}
            </p>
          );
        },
        meta: {
          className: "w-1/6",
        },
      },
      {
        accessorKey: "email",
        header: "E-mail",
        cell: ({ row }) => (
          <p className="text-sm text-gray-600">{row.original.email}</p>
        ),
        meta: {
          className: "w-2/6",
        },
      },
      {
        accessorKey: "is_active",
        header: "Account Status",
        cell: ({ row }) => {
          // It's still fine to have an individual toggle here, as it uses the same mutation.
          const handleToggle = async () => {
            if (!row.original._id) {
              dispatch(handleAppError("User ID is missing"));
              return;
            }

            const newStatus = !row.original.is_active;
            try {
              await updateUser({
                id: row.original._id,
                data: { is_active: newStatus },
              }).unwrap();

              dispatch(
                handleAppSuccess(
                  `User status updated to ${newStatus ? "Active" : "Inactive"}`
                )
              );
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
                {row.original.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          );
        },
        meta: {
          className: "w-1/6",
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
                  <button
                    onClick={() => handleDeleteUser(row.original)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded"
                  >
                    <AiOutlineDelete className="size-5 text-red-600" />
                  </button>
                </div>
              ),
              meta: {
                className: "w-1/6 text-center", // Center align actions
              },
            },
          ]
        : []),
    ],
    [appUser, roleDisplayNames, dispatch, handleEditUser, handleDeleteUser, updateUser] // Dependencies for useMemo
  );

  const filteredUsers = useMemo(() => {
    let currentUsers = users || [];

    // Filter by role if not admin
    if (role === "regional") {
      currentUsers = currentUsers.filter(
        (user) => user.user_type_id?.type_name === "employee"
      );
    }

    // Apply search filter
    if (searchUserInput) {
      const lowerCaseSearch = searchUserInput.toLowerCase();
      currentUsers = currentUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(lowerCaseSearch) ||
          user.email?.toLowerCase().includes(lowerCaseSearch) ||
          user.seS_id?.toLowerCase().includes(lowerCaseSearch) ||
          user.user_type_id?.type_name?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return currentUsers;
  }, [users, role, searchUserInput]); // Memoize filtered users based on all relevant dependencies

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

      {/* NEW: Bulk Action Buttons - Visible when users are selected and admin */}
      {appUser?.user_type_id.type_name === "admin" &&
        selectedUserIds.length > 0 && (
          <div className="flex items-center gap-3 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-semibold text-blue-800">
              {selectedUserIds.length} user(s) selected:
            </span>
            <AppButton
              onClick={() => handleBulkUpdateStatus(true)}
              className="bg-green-600 hover:bg-green-700 text-white p-1 rounded-md"
            >
              Activate Selected
            </AppButton>
            <AppButton
              onClick={() => handleBulkUpdateStatus(false)}
              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md"
            >
              Inactivate Selected
            </AppButton>
            <AppButton
              onClick={() => setRowSelection({})} // Clear selection
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 ml-auto"
            >
              Clear Selection
            </AppButton>
          </div>
        )}

      {!isLoading && isSuccess && (
        <div className="my-10">
          <AppTable
            tableTitle="admin" // This prop doesn't seem to be used for title in AppTable but for newBtnAction
            columns={columns}
            data={filteredUsers} // Use memoized filtered users
            tableClassName="border border-gray-300"
            rowClassName="border border-gray-200"
            pagination={pagination}
            setPagination={setPagination}
            rowSelection={rowSelection} // Pass the row selection state
            onRowSelectionChange={setRowSelection} // Pass the setter for row selection
            // This is crucial for react-table to identify rows correctly for selection
            getRowId={(row) => row._id || String(Math.random())}
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
              confirmPassword: "",
            }}
            onSubmit={handleUpdateUser}
            onCancel={() => setIsEditModalOpen(false)}
            isEdit={true}
            dispatch={dispatch}
            role={role || undefined}
            roles={rolesData}
            regions={regionsData}
            countries={countriesData}
            selectedGeoGraphics={selectedGeoGraphics}
          />
        )}
      </Modal>
    </div>
  );
};