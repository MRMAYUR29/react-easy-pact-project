import { ColumnDef } from "@tanstack/react-table";
import { AppButton, AppLoader, AppTable, PageTitle } from "../../component";
import { IUserProps } from "../../interface";
import clsx from "clsx";
import { AiOutlineDelete, AiOutlineSearch } from "react-icons/ai";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../../redux/api";
import {
  handleAppError,
  handleAppSuccess,
  handleUserSearch,
  setUsers,
  useAppSlice,
  useUserSlice,
} from "../../redux/slice";
import { useAppDispatch } from "../../redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UsersListPage = () => {
  const { data, isLoading, isError, error, isSuccess } = useGetAllUsersQuery();
  const [
    Delete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteUserMutation();
  const { users, searchUserInput } = useUserSlice();
  const { appUser, role } = useAppSlice();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    if (isSuccess) {
      dispatch(setUsers(data?.data));
    }
  }, [isSuccess, dispatch, data?.data]);

  useEffect(() => {
    if (isDeleteSuccess) {
      dispatch(handleAppSuccess(deleteData.message));
    }
  }, [isDeleteSuccess, dispatch, deleteData?.message]);

  const columns: ColumnDef<IUserProps>[] = [
    {
      accessorKey: "Account name",
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-base font-bold capitalize">
              {row.original.name}{" "}
              {appUser?._id === row.original._id && (
                <span className="text-xs text-primary-500">(You)</span>
              )}
            </p>
            <p className="text-xs">{row.original.department}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "user_type_id.type_name",
      header: "Role",
      meta: {
        className: "uppercase",
      },
    },
    {
      accessorKey: "email",
      header: "Mobile no.",
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <p className="text-sm text-gray-500">{row.original.mobile}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Account Status",
      meta: {
        className: "text-center",
      },
      cell: ({ row }) => {
        return (
          <p
            className={clsx(
              "capitalize text-sm rounded-lg",
              row.original.is_active && "text-green-500",
              !row.original.is_active && "text-red-500"
            )}
          >
            {row.original.is_active ? "Active" : "Inactive"}
          </p>
        );
      },
    },
    ...(appUser?.user_type_id.type_name === "admin"
      ? [
          {
            accessorKey: "_id",
            header: "Actions",
            meta: {
              className: "text-right",
            },
            cell: ({ row }) => (
              <div className="flex items-center gap-3 justify-end pr-3">
                <button
                  onClick={() => handleDeleteUser(row.original._id)}
                  className="p-2 bg-gray-300 rounded-lg"
                >
                  <AiOutlineDelete className="size-5" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleDeleteUser = async (id: string) => {
    if (users?.length === 1) {
      dispatch(handleAppError("You cannot delete the last user"));
    }
    if (appUser === null || appUser._id === id) {
      dispatch(handleAppError("You cannot delete yourself"));
    } else {
      await Delete(id);
    }
  };

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
      {!isLoading && !isDeleteLoading && isSuccess && (
        <div className="my-10">
          <AppTable
            tableTitle="admin"
            columns={columns}
            data={
              users?.filter((user) => {
                if (role === "regional") {
                  return user.user_type_id.type_name === "employee";
                } else {
                  return user;
                }
              }) || []
            }
          />
        </div>
      )}
      {isLoading && isDeleteLoading && <AppLoader />}
    </div>
  );
};
