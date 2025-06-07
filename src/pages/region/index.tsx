import {
  AppInput,
  AppLoader,
  AppModal,
  AppSelect,
  AppTable,
  PageTitle,
} from "../../component";
import {
  useCreateCountryMutation,
  useCreateRegionMutation,
  useGetAllRegionQuery,
  useLazyGetCountriesQuery,
  useUpdateRegionMutation,
  useUpdateCountryMutation,
} from "../../redux/api";
import {
  handleAppError,
  handleAppSuccess,
  handleCountryModal,
  handleRegionModal,
  handleSelection,
  initialRegion,
  setRegion,
  setRegionInput,
  useAppSlice,
  useGeoGraphicsSlice,
} from "../../redux/slice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux";
import { ColumnDef } from "@tanstack/react-table";
import { RegionProps, CountryProps } from "../../interface";
import { AiOutlineEdit } from "react-icons/ai";
import clsx from "clsx";


export const RegionPage = () => {
  const { regions, regionModal, regionInput, countryModal, selection } =
    useGeoGraphicsSlice();
  const { isError, error, data, isLoading, isSuccess } = useGetAllRegionQuery();
  const [
    GetCountries,
    {
      data: countryDataFromLazy,
      isError: isCountryError,
      error: countryError,
      isLoading: isCountryLoading,
    },
  ] = useLazyGetCountriesQuery();
  const [
    UpdateRegion,
    {
      isError: isUpdateRegionError,
      error: updateRegionError,
      data: updateRegionData,
      isLoading: isUpdateRegionLoading,
      isSuccess: isUpdateRegionSuccess,
    },
  ] = useUpdateRegionMutation();
  const [
    New,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
      isSuccess: isCreateSuccess,
    },
  ] = useCreateRegionMutation();

  const [
    NewCountry,
    {
      isError: isNewCountryError,
      error: newCountryError,
      data: newCountryData,
      isLoading: isNewCountryLoading,
      isSuccess: isNewCountrySuccess,
    },
  ] = useCreateCountryMutation();

  const [
    updateCountry,
    {
      isError: isUpdateCountryError,
      error: updateCountryError,
      isLoading: isUpdateCountryLoading,
      isSuccess: isUpdateCountrySuccess,
    },
  ] = useUpdateCountryMutation();

  const dispatch = useAppDispatch();
  const { appUser, appError } = useAppSlice();

  const [fetchedCountriesMap, setFetchedCountriesMap] = useState<
    Record<string, CountryProps[]>
  >({});

  // useEffect to handle fetching countries for the 'Create Country' modal
  useEffect(() => {
    if (selection.region && countryModal) {
      (async () => {
        await GetCountries(selection.region);
      })();
    }
  }, [selection.region, GetCountries, countryModal]);

  // useEffect to update global regions state
  useEffect(() => {
    if (isSuccess) {
      dispatch(setRegion(data?.data));
    }
  }, [isSuccess, data?.data, dispatch]);

  // Handle errors for getAllRegion
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

  // Handle errors for GetCountries (lazy query)
  useEffect(() => {
    if (isCountryError) {
      const err = countryError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isCountryError, countryError]);

  // Error handling for other mutations...
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
    if (isUpdateRegionError) {
      const err = updateRegionError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isUpdateRegionError, updateRegionError]);

  useEffect(() => {
    if (isNewCountryError) {
      const err = newCountryError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isNewCountryError, newCountryError]);

  useEffect(() => {
    if (isUpdateCountryError) {
      const err = updateCountryError as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isUpdateCountryError, updateCountryError]);

  // Success handling for mutations...
  useEffect(() => {
    if (isCreateSuccess) {
      dispatch(handleAppSuccess(createData?.message));
      dispatch(setRegionInput(initialRegion));
      dispatch(handleRegionModal(false));
    }
  }, [isCreateSuccess, createData?.message, dispatch]);

  useEffect(() => {
    if (isUpdateRegionSuccess) {
      dispatch(handleAppSuccess(updateRegionData?.message));
      dispatch(handleRegionModal(false));
    }
  }, [isUpdateRegionSuccess, updateRegionData?.message, dispatch]);

  useEffect(() => {
    if (isNewCountrySuccess) {
      dispatch(handleCountryModal(false));
      dispatch(
        handleSelection({
          city: "",
          country: "",
          region: "",
        })
      );
      dispatch(handleAppSuccess(newCountryData?.message));
    }
  }, [isNewCountrySuccess, newCountryData?.message, dispatch]);

  useEffect(() => {
    if (isUpdateCountrySuccess) {
      dispatch(handleAppSuccess("Country status updated successfully"));
      // The `fetchedCountriesMap` is already optimistically updated in the cell.
      // If your API call refetches all regions, this effect might be redundant.
    }
  }, [isUpdateCountrySuccess, dispatch]);


  const handleSubmit = async () => {
    if (regionInput._id) {
      await UpdateRegion({
        id: regionInput._id as string,
        payload: {
          name: regionInput.name as string,
          is_active: regionInput.is_active as boolean,
        },
      });
    } else {
      await New({
        name: regionInput.name as string,
        is_active: regionInput.is_active as boolean,
      });
    }
  };

  const handleNewCountry = async () => {
    const isValidId = /^[0-9a-fA-F]{24}$/.test(selection.region);

    if (!isValidId) {
      dispatch(handleAppError("Please select a valid region"));
      return;
    }

    if (!selection.country) {
      dispatch(handleAppError("Please enter country name"));
      return;
    }

    try {
      await NewCountry({
        region_id: selection.region,
        name: selection.country,
      });
    } catch (error) {
      console.error("Country creation failed:", error);
    }
  };

  const columns: ColumnDef<RegionProps>[] = [
    { accessorKey: "name", header: "Region Name" },
    {
      accessorKey: "countries",
      header: "Countries",
      cell: ({ row }) => {
        const regionId = row.original._id as string;
        const countriesForThisRegion = fetchedCountriesMap[regionId] || [];

        // Find the currently selected country if it belongs to this region
        const currentSelectedCountryInThisRegion = countriesForThisRegion.find(
          (country) =>
            country._id === selection.country && country.region_id === regionId
        );


        useEffect(() => {
          if (regionId && !fetchedCountriesMap[regionId] && !isCountryLoading) {
            (async () => {
              const { data: response } = await GetCountries(regionId);
              if (response?.data) {
                setFetchedCountriesMap((prev) => ({
                  ...prev,
                  [regionId]: response.data,
                }));
              }
            })();
          }
        }, [regionId, GetCountries, fetchedCountriesMap, isCountryLoading]);

        return (
          <div className="flex flex-col">
            {isCountryLoading && !countriesForThisRegion.length ? (
              <p>Loading countries...</p>
            ) : (
              <AppSelect
                value={
                  currentSelectedCountryInThisRegion
                    ? currentSelectedCountryInThisRegion._id
                    : ""
                }
                onChange={(e) => {
                  const countryId = e.target.value;
                  dispatch(
                    handleSelection({
                      ...selection,
                      region: regionId, // Set region to the current row's region
                      country: countryId,
                    })
                  );
                }}
                selectLabel="Select Country"
                options={
                  countriesForThisRegion.map((country: CountryProps) => ({
                    value: country._id,
                    label: country.name,
                  })) as { label: string; value: string }[]
                }
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Region Status",
      meta: {
        className: "text-right",
      },
      cell: ({ row }) => {
        return <p>{row.original.is_active ? "Active" : "Inactive"}</p>;
      },
    },
    {
      accessorKey: "country_status",
      header: "Country Status",
      meta: {
        className: "text-center",
      },
      cell: ({ row }) => {
        const regionId = row.original._id as string;
        const countriesInThisRow = fetchedCountriesMap[regionId] || [];
        const currentSelectedCountryInThisRow = countriesInThisRow.find(
          (country) =>
            country._id === selection.country && country.region_id === regionId
        );

        const handleCountryStatusToggle = async () => { // Removed `newStatus` parameter
          if (!currentSelectedCountryInThisRow?._id) {
            dispatch(handleAppError("No country selected to update status."));
            return;
          }
          const newStatus = !currentSelectedCountryInThisRow.is_active; // Determine new status

          try {
            await updateCountry({
              id: currentSelectedCountryInThisRow._id,
              data: { is_active: newStatus, region_id: currentSelectedCountryInThisRow.region_id }, // Pass region_id for tag invalidation
            }).unwrap();

            // Optimistically update the UI in fetchedCountriesMap
            setFetchedCountriesMap((prev) => ({
              ...prev,
              [regionId]: prev[regionId]?.map((c) =>
                c._id === currentSelectedCountryInThisRow._id
                  ? { ...c, is_active: newStatus }
                  : c
              ),
            }));
            dispatch(
              handleAppSuccess(
                `Country status updated to ${newStatus ? "Active" : "Inactive"}`
              )
            );
          } catch (error) {
            const err = error as { data?: { message: string }; message: string };
            dispatch(handleAppError(err.data?.message || err.message));
          }
        };

        return (
          <div className="flex justify-center items-center">
            {currentSelectedCountryInThisRow ? (
              <div className="flex items-center gap-2">
                {/* Replaced Switch with your custom button */}
                <button
                  onClick={handleCountryStatusToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    currentSelectedCountryInThisRow.is_active ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      currentSelectedCountryInThisRow.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={clsx(
                    "capitalize text-sm",
                    currentSelectedCountryInThisRow.is_active
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {currentSelectedCountryInThisRow.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            ) : (
              <p className="text-gray-500">Select a country</p>
            )}
          </div>
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
                  onClick={() => {
                    dispatch(handleRegionModal(true));
                    dispatch(
                      setRegionInput({
                        is_active: row.original.is_active,
                        name: row.original.name,
                        _id: row.original._id as string,
                      })
                    );
                  }}
                  className="p-2 bg-gray-300 rounded-lg"
                >
                  <AiOutlineEdit className="size-5" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      <PageTitle title="Region List & Management" />
      <div className="flex items-center flex-wrap gap-5">
        <AppInput placeholder="Search Region" />
        <div className="flex gap-5 items-center justify-end w-full">
          <button
            onClick={() => dispatch(handleRegionModal(true))}
            className="p-2 bg-gray-300 rounded-lg"
          >
            Create Region
          </button>

          <button
            onClick={() => dispatch(handleCountryModal(true))}
            className="p-2 bg-gray-300 rounded-lg"
          >
            Create Country
          </button>
        </div>
      </div>
      {regions && <AppTable data={regions} columns={columns} />}
      {(isLoading || isUpdateRegionLoading || isUpdateCountryLoading) && (
        <AppLoader />
      )}
      <AppModal
        btnLoader={isCreateLoading || isUpdateRegionLoading}
        width="md"
        action={handleSubmit}
        btnTitle={regionInput._id ? "Save Changes" : "Save Region"}
        isOpen={regionModal}
        toggle={() => {
          dispatch(handleRegionModal(false));
          dispatch(setRegionInput(initialRegion));
        }}
        modalTitle={regionInput._id ? `Update Region` : "Create Region"}
        subTitle={
          regionInput._id
            ? `Update ${regionInput.name} Region`
            : "Create a new region"
        }
      >
        <AppInput
          value={regionInput.name}
          onChange={(e) => {
            const letters = e.target.value.replace(/[^A-Za-z\s]/g, "");
            dispatch(
              setRegionInput({
                ...regionInput,
                name: letters,
              })
            );
          }}
          placeholder="Region Name"
        />
      </AppModal>
      <AppModal
        btnLoader={isNewCountryLoading}
        isOpen={countryModal}
        toggle={() => {
          dispatch(handleCountryModal(false));
          dispatch(
            handleSelection({
              city: "",
              country: "",
              region: "",
            })
          );
        }}
        btnTitle="Save Country"
        action={handleNewCountry}
        modalTitle="Create Country"
        width="md"
      >
        <div className="space-y-3">
          {appError && <p className="text-red-500">{appError}</p>}
          <AppSelect
            value={selection?.region}
            onChange={(e) => {
              dispatch(
                handleSelection({
                  ...selection,
                  region: e.target.value,
                  country: "",
                })
              );
            }}
            selectLabel="Region"
            options={
              regions?.map((region) => ({
                value: region._id,
                label: region.name,
              })) as {
                label: string;
                value: string;
              }[]
            }
          />
          <AppInput
            value={selection.country || ""}
            onChange={(e) => {
              const letters = e.target.value.replace(/[^A-Za-z\s]/g, "");
              dispatch(
                handleSelection({
                  ...selection,
                  country: letters,
                })
              );
            }}
            placeholder="Country Name"
          />
        </div>
      </AppModal>
    </div>
  );
};