import { AiOutlineSearch } from "react-icons/ai";
import {
  AppButton,
  AppLoader,
  AppModal,
  AppSelect,
  AppTable,
  PageTitle,
} from "../../component";
import {
  useCreateMapProductMutation,
  useDeleteMapProductMutation,
  useGetAllMappedProductsQuery,
  useGetAllProductsQuery,
  useGetAllUsersQuery,
} from "../../redux/api";
import { useEffect, useState } from "react";
import {
  clearAssignedUser,
  handleAppError,
  handleAppSuccess,
  handleAssignProductModal,
  handleDemoAssignment,
  handleProducts,
  removeAssignedUser,
  setAssignedUsers,
  setMappedProduct,
  setUsers,
  useMappedProductSlice,
  useProductSlice,
  useUserSlice,
} from "../../redux/slice";
import { useAppDispatch } from "../../redux";
import moment from "moment";
import { TbTrash, TbX } from "react-icons/tb";
import { IMapProductProps, IUserProps } from "../../interface";
import { ColumnDef } from "@tanstack/react-table";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";

export const MappedProductsPage = () => {
  const {
    data: employeeData,
    isError: isEmployeeError,
    error: employeeError,
    isSuccess: isEmployeeSuccess,
  } = useGetAllUsersQuery();
  const {
    isError: isProductError,
    error: productError,
    data: productData,
    isLoading: isProductLoading,
    isSuccess: isProductSuccess,
  } = useGetAllProductsQuery({
    page: 1,
    size: 1000,
  });
  const [
    CreateMapProduct,
    {
      isLoading: isMapLoading,
      isError: isMapError,
      error: mapError,
      isSuccess: isMapSuccess,
      data: mapData,
    },
  ] = useCreateMapProductMutation();
  const [
    DeleteMap,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteMapProductMutation();
  const { data, isError, error, isSuccess, isLoading } =
    useGetAllMappedProductsQuery();
  const { assignment, filteredProducts, assignProductModal } =
    useProductSlice();
  const { users } = useUserSlice();

  const dispatch = useAppDispatch();
  const { mappedProduct, assignedUsers } = useMappedProductSlice();
  const [selectedPerson, setSelectedPerson] = useState({
    id: users?.[0]._id,
    name: users?.[0].name,
  });
  const [query, setQuery] = useState("");

  const filteredPeople =
    users?.filter((person) => {
      // Remove already assigned users
      const isAlreadyAssigned = assignedUsers.some(
        (assigned) => assigned.id === person._id
      );

      // Apply search filter and exclusion of assigned users
      return (
        !isAlreadyAssigned &&
        person.name.toLowerCase().includes(query.toLowerCase())
      );
    }) || [];

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
    if (isSuccess) {
      dispatch(setMappedProduct(data.data));
    }
  }, [isSuccess, dispatch, data?.data]);

  useEffect(() => {
    if (isDeleteSuccess) {
      dispatch(handleAppSuccess(deleteData.message));
    }
  }, [isDeleteSuccess, dispatch, deleteData?.message]);

  useEffect(() => {
    if (isProductSuccess && productData?.data.length > 0) {
      dispatch(handleProducts(productData?.data));
    }
  }, [isProductSuccess, productData?.data, dispatch]);

  useEffect(() => {
    if (isEmployeeError) {
      const err = employeeError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isEmployeeError, employeeError]);

  useEffect(() => {
    if (isMapError) {
      const err = mapError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isMapError, mapError]);

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
    if (isProductError) {
      const err = productError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isProductError, productError]);

  useEffect(() => {
    if (isEmployeeSuccess) {
      dispatch(setUsers(employeeData?.data));
    }
  }, [isEmployeeSuccess, dispatch, employeeData?.data]);

  useEffect(() => {
    if (isMapSuccess) {
      dispatch(handleAppSuccess(mapData?.message));
      dispatch(handleAssignProductModal(false));
    }
  }, [isMapSuccess, mapData?.message, dispatch]);

  const handleMapProduct = async () => {
    if (assignment?.demo_product_id) {
      if (assignedUsers) {
        assignedUsers.map(async (assignedUser) => {
          await CreateMapProduct({
            demo_product_id: assignment?.demo_product_id as string,
            user_id: assignedUser.id as string,
          });
        });
      }
    } else {
      dispatch(handleAppError("Please select a product and user"));
    }
  };

  const handleAssign = () => {
    if (assignedUsers.some((user) => user.id === selectedPerson.id)) {
      return dispatch(handleAppError("User already assigned"));
    }

    dispatch(
      setAssignedUsers({
        id: selectedPerson.id as string,
        name: selectedPerson.name as string,
      })
    );

    setSelectedPerson({ id: "", name: "" });
  };

  const handleDeleteMap = async (id: string) => {
    await DeleteMap(id);
  };

  const columns: ColumnDef<IMapProductProps>[] = [
    {
      accessorKey: "demo_product_id.title",
      header: "Product",
      meta: {
        className: "font-bold",
      },
    },
    {
      accessorKey: "user_id.name",
      header: "Employee Name",
      meta: {
        className: "text-gray-500",
      },
      cell: ({ row }) => {
        return (
          <p>
            {(
              row.original?.user_id as {
                name: string;
              }
            )?.name ?? "N/A"}
          </p>
        );
      },
    },
    {
      accessorKey: "created_at",
      meta: {
        className: "text-right text-sm text-gray-500",
      },
      cell: ({ row }) => {
        return (
          <div>
            <p>{moment(row.original.created_at).format("lll")}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      meta: {
        className: "text-right",
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-5 items-center justify-end">
            <button
              onClick={() => {
                handleDeleteMap(row.original._id as string);
              }}
            >
              <TbTrash className="size-6" />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <PageTitle title="Assigned Products" />
      {isLoading && isProductLoading && !isDeleteLoading && <AppLoader />}
      {!isLoading && !isProductLoading && !isDeleteLoading && mappedProduct && (
        <div className="flex items-center w-full gap-4">
          <div className="flex items-center gap-5 my-5 flex-1">
            <div className="flex flex-1 gap-2 items-center border border-gray-500 rounded-lg px-3">
              <AiOutlineSearch className="size-6 fill-gray-500" />
              <input
                type="search"
                placeholder="Search by employee name or product"
                className="bg-transparent placeholder:text-gray-500 w-full py-2 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <AppButton
              fullWidth
              onClick={() => dispatch(handleAssignProductModal(true))}
            >
              Assign To
            </AppButton>
          </div>
        </div>
      )}
      {mappedProduct && !isLoading && (
        <div>
          <AppTable columns={columns} data={mappedProduct} />
        </div>
      )}
      <AppModal
        modalTitle="Search & Assign Products to Employees"
        subTitle="Demo Product assign"
        isOpen={assignProductModal}
        action={handleMapProduct}
        width="lg"
        btnTitle="Assign"
        btnLoader={isMapLoading}
        toggle={() => dispatch(handleAssignProductModal(false))}
      >
        <div>
          <div>
            <Combobox
              as="div"
              className="w-full "
              value={selectedPerson}
              onChange={(person: IUserProps | unknown) => {
                {
                  setSelectedPerson({
                    id: (person as IUserProps)?._id,
                    name: (person as IUserProps)?.name,
                  });
                }
              }}
              onClose={() => setQuery("")}
            >
              <Label>Select User</Label>
              <div className="flex items-center gap-2">
                <ComboboxInput
                  placeholder="Search User by name"
                  className="border border-gray-400 p-2 rounded-lg w-full"
                  aria-label="Assignee"
                  displayValue={(person: { name: string }) => person.name}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {selectedPerson.id && (
                  <button
                    onClick={handleAssign}
                    className="bg-primary-500 p-2 rounded-lg px-5"
                  >
                    Add
                  </button>
                )}
              </div>
              <ComboboxOptions
                anchor="bottom"
                className="border empty:invisible w-1/3 p-1 bg-white"
              >
                {filteredPeople &&
                  filteredPeople.map((person) => (
                    <ComboboxOption
                      key={person._id}
                      value={person}
                      className="data-[focus]:bg-blue-100 p-2 rounded-lg"
                    >
                      {person.name}
                    </ComboboxOption>
                  ))}
              </ComboboxOptions>
            </Combobox>
            <div>
              <AppTable
                newBtnAction={() => dispatch(clearAssignedUser())}
                tableTitle="Clear"
                enableSearch
                columns={[
                  {
                    accessorKey: "name",
                  },
                  {
                    accessorKey: "id",
                    header: "action",
                    meta: {
                      className: "text-right",
                    },
                    cell: ({ row }) => {
                      return (
                        <button
                          onClick={() =>
                            dispatch(removeAssignedUser(row.original.id))
                          }
                        >
                          <TbX className="size-6" />
                        </button>
                      );
                    },
                  },
                ]}
                data={assignedUsers}
              />
            </div>
          </div>
          <div className="flex mt-5 items-center gap-5">
            <AppSelect
              onChange={(e) =>
                dispatch(
                  handleDemoAssignment({
                    ...(assignment as IMapProductProps),
                    demo_product_id: e.target.value as string,
                  })
                )
              }
              options={
                (filteredProducts &&
                  filteredProducts.map((demo) => {
                    return {
                      label: demo.title as string,
                      value: demo._id as string,
                    };
                  })) ||
                []
              }
              selectLabel="Demo"
              defaultValue={
                filteredProducts?.length ? filteredProducts[0]._id : undefined
              }
            />
          </div>
        </div>
      </AppModal>
    </div>
  );
};
