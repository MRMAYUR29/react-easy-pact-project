// MappedProductsPage.tsx

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
  useGetAllUsersQuery, // Keep this for fetching all users
  useGetAllRegionQuery,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
  useLazyGetCountriesQuery,
  useLazyGetUsersByFieldQuery, // Keep this for filtered users
} from "../../redux/api";
import { useEffect, useState } from "react";
import {
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
  setSelectedGeoGraphics,
  clearAssignedUser,
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
import { PaginationState } from "@tanstack/react-table";

export const MappedProductsPage = () => {
  const [filteredUsers, setFilteredUsers] = useState<IUserProps[]>([]);
  const [autoSelectAll, setAutoSelectAll] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [query, setQuery] = useState(""); // For Combobox internal search
  const [hasFilteredBeenClicked, setHasFilteredBeenClicked] = useState(false);

  const { data: departments } = useGetDepartmentsQuery();
  const { data: designations } = useGetDesignationsQuery();
  const { selectedGeoGraphics } = useUserSlice();
  const { data: regions } = useGetAllRegionQuery();
  const [GetCountry, { data: countries }] = useLazyGetCountriesQuery();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // initial page index
    pageSize: 50, // initial page size
  });

  useEffect(() => {
    if (selectedGeoGraphics.region) {
      (async () => {
        await GetCountry(selectedGeoGraphics.region as string);
      })();
    }
  }, [GetCountry, selectedGeoGraphics.region]);

  const [getUsersByField, { isLoading: isFilteredUsersLoading }] =
    useLazyGetUsersByFieldQuery();

  const fetchFilteredUsers = async () => {
    if (
      selectedGeoGraphics.region &&
      selectedGeoGraphics.country &&
      selectedDepartment &&
      selectedDesignation
    ) {
      setHasFilteredBeenClicked(true);
      const result = await getUsersByField({
        region_id: selectedGeoGraphics.region,
        country_id: selectedGeoGraphics.country,
        department: selectedDepartment,
        designation: selectedDesignation,
      });

      if ("data" in result && result.data?.data) {
        setFilteredUsers(result.data.data);
        // Auto-select all users if checkbox is checked AND filtered users are available
        if (autoSelectAll) {
          const usersToAssign = result.data.data.map((user) => ({
            id: user._id as string,
            name: user.name,
          }));
          dispatch(setAssignedUsers(usersToAssign));
        }
      } else {
        // If query resulted in an error or no data, ensure filteredUsers is empty
        setFilteredUsers([]);
      }
    } else {
      dispatch(handleAppError("Please select all filters"));
      setHasFilteredBeenClicked(false);
    }
  };

  const toggleAutoSelectAll = () => {
    setAutoSelectAll((prev) => {
      const newAutoSelectAll = !prev; // Calculate the new state

      if (newAutoSelectAll && filteredUsers.length > 0) {
        // If turning ON auto-select and filtered users exist, assign them
        const usersToAssign = filteredUsers.map((user) => ({
          id: user._id as string,
          name: user.name,
        }));
        dispatch(setAssignedUsers(usersToAssign));
      } else if (!newAutoSelectAll) {
        // If turning OFF auto-select, clear assigned users
        dispatch(setAssignedUsers([]));
      }
      return newAutoSelectAll; // Return the new state
    });
  };

  const {
    data: employeeData,
    isError: isEmployeeError,
    error: employeeError,
    isSuccess: isEmployeeSuccess,
  } = useGetAllUsersQuery(); // This fetches ALL users
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
  const { users } = useUserSlice(); // This `users` state holds ALL users from `useGetAllUsersQuery`

  const dispatch = useAppDispatch();
  const { mappedProduct, assignedUsers } = useMappedProductSlice();
  const [selectedPerson, setSelectedPerson] = useState({
    id: users?.[0]?._id || "", // Initialize with empty string or default if available
    name: users?.[0]?.name || "", // Initialize with empty string or default if available
  });

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
      if (
        productData.data.length > 0 &&
        (!assignment.demo_product_id ||
          assignment.demo_product_id !== productData.data[0]._id)
      ) {
        dispatch(
          handleDemoAssignment({
            ...assignment,
            demo_product_id: productData.data[0]._id as string,
          })
        );
      }
    }
  }, [isProductSuccess, productData?.data, dispatch]); // Removed 'assignment' from dependencies

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
      // Clear fields after successful assignment
      dispatch(clearAssignedUser()); // Clears the assignedUsers array in mappedProductSlice
      dispatch(
        setSelectedGeoGraphics({
          region: "", // Reset region in userSlice
          country: "", // Reset country in userSlice
        })
      );
      setSelectedDepartment(""); // Reset local state for department
      setSelectedDesignation(""); // Reset local state for designation
      setFilteredUsers([]); // Clear filtered users
      setQuery(""); // Clear the combobox search query
      setSelectedPerson({ id: "", name: "" }); // Reset selected person in combobox
    }
  }, [isMapSuccess, mapData?.message, dispatch]);

  const handleMapProduct = async () => {
    console.log("Assignment:", assignment);
    console.log("Demo Product ID:", assignment?.demo_product_id);
    console.log("Assigned Users:", assignedUsers);
    console.log("Assigned Users Length:", assignedUsers?.length);

    if (!assignment?.demo_product_id || !assignedUsers?.length) {
      console.log("Validation failed - missing product or users");
      return dispatch(handleAppError("Please select a product and user"));
    }

    try {
      await Promise.all(
        assignedUsers.map((assignedUser) =>
          CreateMapProduct({
            demo_product_id: assignment.demo_product_id,
            user_id: assignedUser.id,
          })
        )
      );
    } catch (err) {
      dispatch(handleAppError("Failed to assign product"));
    }
  };

  const handleAssign = () => {
    if (!selectedPerson.id || !selectedPerson.name) {
      return dispatch(handleAppError("Please select a user to add"));
    }
    if (assignedUsers.some((user) => user.id === selectedPerson.id)) {
      return dispatch(handleAppError("User already assigned"));
    }

    dispatch(
      setAssignedUsers({
        id: selectedPerson.id as string,
        name: selectedPerson.name as string,
      })
    );

    setSelectedPerson({ id: "", name: "" }); // Reset selected person after adding
    setQuery(""); // Clear search query after adding to prepare for next search
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
      cell: ({ row }) => {
        // Safe access for demo_product_id title
        const productTitle =
          typeof row.original.demo_product_id === "object"
            ? row.original.demo_product_id.title
            : row.original.demo_product_id; // Fallback to ID if it's just a string

        return <p>{productTitle}</p>;
      },
    },
    {
      accessorKey: "user_id.name",
      header: "Employee Name",
      meta: {
        className: "text-gray-500",
      },
      cell: ({ row }) => {
        // Safe access for user_id name
        const userName =
          typeof row.original.user_id === "object"
            ? row.original.user_id.name
            : row.original.user_id; // Fallback to ID if it's just a string

        return <p>{userName}</p>;
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

  // Helper to determine if all filter fields are filled
  const areAllFiltersFilled =
    selectedGeoGraphics.region &&
    selectedGeoGraphics.country &&
    selectedDepartment &&
    selectedDesignation;

  // Determine the source of users for the Combobox and if it should be visible
  let comboboxUsersSource: IUserProps[] = [];
  let showCombobox = false;

  if (autoSelectAll) {
    // If auto-select is on, combobox is generally not needed for selection
    showCombobox = false;
  } else if (areAllFiltersFilled) {
    // If all filters are filled AND auto-select is off,
    // show combobox to select from filteredUsers (after 'Filter Users' is clicked)
    comboboxUsersSource = filteredUsers;
    showCombobox = true;
  } else {
    // If filters are NOT all filled AND auto-select is off,
    // show combobox for searching ALL users
    comboboxUsersSource = users || []; // Fallback to empty array if 'users' is null
    showCombobox = true;
  }

  // Filter the combobox source based on the search query
  const displayedComboboxOptions = comboboxUsersSource?.filter((person) => {
    const isAlreadyAssigned = assignedUsers.some(
      (assigned) => assigned.id === person._id
    );
    return (
      !isAlreadyAssigned &&
      person?.name?.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div>
      <PageTitle title="Assigned Products" />
      {(isLoading || isProductLoading || isDeleteLoading) && <AppLoader />}
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
          <AppTable
            columns={columns}
            data={mappedProduct}
            pagination={pagination}
            setPagination={setPagination}
          />
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
        <div className="space-y-4">
          {/* Region and Country filters */}
          <div className="flex items-start gap-3">
            <AppSelect
              value={selectedGeoGraphics.region}
              onChange={(e) => {
                dispatch(
                  setSelectedGeoGraphics({
                    ...selectedGeoGraphics,
                    region: e.target.value,
                    country: "",
                  })
                );
                // Clear states relevant to filters when region changes
                setFilteredUsers([]);
                setAutoSelectAll(false);
                dispatch(setAssignedUsers([]));
                setQuery(""); // Clear combobox search
                setSelectedPerson({ id: "", name: "" });
                setHasFilteredBeenClicked(false);
              }}
              selectLabel="Region *"
              options={
                regions?.data?.map((prop) => {
                  return {
                    label: prop.name,
                    value: prop._id,
                  };
                }) as []
              }
            />
            <AppSelect
              value={selectedGeoGraphics.country}
              onChange={(e) => {
                dispatch(
                  setSelectedGeoGraphics({
                    ...selectedGeoGraphics,
                    country: e.target.value,
                  })
                );
                // Clear states relevant to filters when country changes
                setFilteredUsers([]);
                setAutoSelectAll(false);
                dispatch(setAssignedUsers([]));
                setQuery(""); // Clear combobox search
                setSelectedPerson({ id: "", name: "" });
                setHasFilteredBeenClicked(false);
              }}
              selectLabel="Country *"
              options={
                countries?.data?.map((prop) => {
                  return {
                    label: prop.name,
                    value: prop._id,
                  };
                }) as []
              }
            />
            <AppSelect
              selectLabel="Department *"
              options={
                departments?.map((dept) => ({
                  label: dept,
                  value: dept,
                })) as []
              }
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                // Clear states relevant to filters when department changes
                setFilteredUsers([]);
                setAutoSelectAll(false);
                dispatch(setAssignedUsers([]));
                setQuery(""); // Clear combobox search
                setSelectedPerson({ id: "", name: "" });
                setHasFilteredBeenClicked(false);
              }}
            />
            <AppSelect
              selectLabel="Designation *"
              options={
                designations?.map((desig) => ({
                  label: desig,
                  value: desig,
                })) as []
              }
              value={selectedDesignation}
              onChange={(e) => {
                setSelectedDesignation(e.target.value);
                // Clear states relevant to filters when designation changes
                setFilteredUsers([]);
                setAutoSelectAll(false);
                dispatch(setAssignedUsers([]));
                setQuery(""); // Clear combobox search
                setSelectedPerson({ id: "", name: "" });
                setHasFilteredBeenClicked(false);
              }}
            />
            <AppButton
              onClick={fetchFilteredUsers}
              disabled={!areAllFiltersFilled} // Disable if not all filters are filled
              loading={isFilteredUsersLoading} // <-- Add isLoading prop here
            >
              Filter Users
            </AppButton>
          </div>

          {/* Auto-select all checkbox and filtered user count */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-select-checkbox"
              checked={autoSelectAll}
              onChange={toggleAutoSelectAll}
              className="h-5 w-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 border-2"
            />
            <label
              htmlFor="auto-select-checkbox"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Auto-select all filtered users
            </label>
            {/* Display filtered user count here */}
            {hasFilteredBeenClicked &&
              !isFilteredUsersLoading &&
              filteredUsers.length > 0 && ( // NEW CONDITION: hasFilteredBeenClicked
                <span className="text-sm text-gray-600 ml-2">
                  ({filteredUsers.length} users found)
                </span>
              )}
            {/* Optional: Show message if no users found after filtering */}
            {hasFilteredBeenClicked &&
              !isFilteredUsersLoading &&
              filteredUsers.length === 0 &&
              areAllFiltersFilled && ( // NEW CONDITION: hasFilteredBeenClicked
                <span className="text-sm text-red-500 ml-2">
                  No users found for selected filters.
                </span>
              )}
          </div>

          {/* User Assignment Combobox (conditionally rendered) */}
          {showCombobox && (
            <div>
              <Combobox
                as="div"
                className="w-full"
                value={selectedPerson}
                onChange={(person: IUserProps | unknown) => {
                  setSelectedPerson({
                    id: (person as IUserProps)?._id || "",
                    name: (person as IUserProps)?.name || "",
                  });
                }}
                onClose={() => setQuery("")}
              >
                <Label>Select User</Label>
                <div className="flex items-center gap-2 mb-3">
                  <ComboboxInput
                    placeholder="Search User by name"
                    className="border border-gray-400 p-2 rounded-lg w-full"
                    aria-label="Assignee"
                    displayValue={(person: { name: string }) =>
                      person?.name || ""
                    }
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {selectedPerson.id && (
                    <AppButton
                      onClick={handleAssign}
                      className="bg-primary-500 p-2 rounded-lg px-5"
                    >
                      Add
                    </AppButton>
                  )}
                </div>
                <ComboboxOptions
                  anchor="bottom"
                  className="border empty:invisible w-1/3 p-1 bg-white max-h-60 overflow-y-auto"
                >
                  {displayedComboboxOptions.length > 0 ? (
                    displayedComboboxOptions.map((person) => (
                      <ComboboxOption
                        key={person._id}
                        value={person}
                        className="data-[focus]:bg-blue-100 p-2 rounded-lg"
                      >
                        {person.name}
                      </ComboboxOption>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No matching users.</div>
                  )}
                </ComboboxOptions>
              </Combobox>
            </div>
          )}

          {/* Assigned Users Table */}
          {assignedUsers.length > 0 && (
            <div>
              <AppTable
                pagination={pagination}
                setPagination={setPagination}
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
          )}

          {/* Demo Product Selection */}
          <div className="flex mt-5 items-center gap-5">
            <AppSelect
              onChange={(e) =>
                dispatch(
                  handleDemoAssignment({
                    ...assignment,
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
              value={
                typeof assignment.demo_product_id === "object" &&
                assignment.demo_product_id !== null
                  ? (
                      assignment.demo_product_id as {
                        title: string;
                        _id: string;
                      }
                    )?._id || "" // Cast to ensure _id is accessible, then use it
                  : assignment.demo_product_id || "" // If it's a string or undefined/null, use directly
              }
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
