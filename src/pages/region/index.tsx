import {
     AppInput,
     AppLoader,
     AppModal,
     AppSelect,
     AppTable,
     PageTitle,
} from "../../component";
import {
     useCreateCityMutation,
     useCreateCountryMutation,
     useCreateRegionMutation,
     useDeleteRegionMutation,
     useGetAllRegionQuery,
     useLazyGetCountriesQuery,
     useUpdateRegionMutation,
} from "../../redux/api";
import {
     handleAppError,
     handleAppSuccess,
     handleCityModal,
     handleCountryModal,
     handleRegionModal,
     handleSelection,
     initialRegion,
     setRegion,
     setRegionInput,
     useAppSlice,
     useGeoGraphicsSlice,
} from "../../redux/slice";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux";
import { ColumnDef } from "@tanstack/react-table";
import { RegionProps } from "../../interface";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export const RegionPage = () => {
     const {
          regions,
          regionModal,
          regionInput,
          countryModal,
          selection,
          cityModal,
     } = useGeoGraphicsSlice();
     const { isError, error, data, isLoading, isSuccess } =
          useGetAllRegionQuery();
     const [
          GetCountries,
          {
               isError: isCountryError,
               error: countryError,
               data: countryData,
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
          DeleteRegion,
          {
               isError: isDeleteError,
               error: deleteError,
               data: deleteData,
               isLoading: isDeleteLoading,
               isSuccess: isDeleteSuccess,
          },
     ] = useDeleteRegionMutation();

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
          NewCity,
          {
               isError: isNewCityError,
               error: newCityError,
               data: newCityData,
               isLoading: isNewCityLoading,
               isSuccess: isNewCitySuccess,
          },
     ] = useCreateCityMutation();

     const dispatch = useAppDispatch();
     const { appUser, appError } = useAppSlice();

     useEffect(() => {
          if (selection.region && cityModal) {
               (async () => {
                    await GetCountries(selection.region);
               })();
          }
     }, [selection.region, GetCountries, cityModal]);

     useEffect(() => {
          if (isDeleteSuccess) {
               dispatch(handleAppSuccess(deleteData.message));
          }
     }, [isDeleteSuccess, deleteData, dispatch]);

     useEffect(() => {
          if (isSuccess) {
               dispatch(setRegion(data?.data));
          }
     }, [isSuccess, data?.data, dispatch]);

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
          if (isNewCityError) {
               const err = newCityError as {
                    data?: { message: string };
                    message: string;
               };
               if (err.data) {
                    dispatch(handleAppError(err.data.message));
               } else {
                    dispatch(handleAppError(err.message));
               }
          }
     }, [dispatch, isNewCityError, newCityError]);

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
                         country_code: "",
                    })
               );
               dispatch(handleAppSuccess(newCountryData?.message));
          }
     }, [isNewCountrySuccess, newCountryData?.message, dispatch]);

     useEffect(() => {
          if (isNewCitySuccess) {
               dispatch(handleCityModal(false));
               dispatch(
                    handleSelection({
                         city: "",
                         country: "",
                         region: "",
                         country_code: "",
                    })
               );
               dispatch(handleAppSuccess(newCityData?.message));
          }
     }, [isNewCitySuccess, newCityData?.message, dispatch]);

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
          if (!selection.country || !selection.region) {
               dispatch(handleAppError("Please add region and country"));
          } else {
               await NewCountry({
                    region_id: selection.region,
                    name: selection.country,
                    country_code: selection.country_code,
               });
          }
     };

     const handleNewCity = async () => {
          if (!selection.country || !selection.region) {
               dispatch(handleAppError("Please add region and country"));
          } else {
               await NewCity({
                    country_id: selection.country,
                    name: selection.city,
               });
          }
     };

     const handleDelete = async (id: string) => {
          await DeleteRegion(id);
     };

     const columns: ColumnDef<RegionProps>[] = [
          { accessorKey: "name" },
          {
               accessorKey: "totalCountries",
               header: "total countries",
               meta: {
                    className: "text-right",
               },
          },
          {
               accessorKey: "totalCities",
               header: "total cities",
               meta: {
                    className: "text-right",
               },
          },
          {
               accessorKey: "is_active",
               header: "Status",
               meta: {
                    className: "text-right",
               },
               cell: ({ row }) => {
                    return (
                         <p>{row.original.is_active ? "Active" : "Inactive"}</p>
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
                                               dispatch(
                                                    handleRegionModal(true)
                                               );
                                               dispatch(
                                                    setRegionInput({
                                                         is_active:
                                                              row.original
                                                                   .is_active,
                                                         name: row.original
                                                              .name,
                                                         _id: row.original
                                                              ._id as string,
                                                    })
                                               );
                                          }}
                                          className="p-2 bg-gray-300 rounded-lg"
                                     >
                                          <AiOutlineEdit className="size-5" />
                                     </button>
                                     <button
                                          onClick={() =>
                                               handleDelete(
                                                    row.original._id as string
                                               )
                                          }
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

                         <button
                              onClick={() => dispatch(handleCityModal(true))}
                              className="p-2 bg-gray-300 rounded-lg"
                         >
                              Create City
                         </button>
                    </div>
               </div>
               {regions && <AppTable data={regions} columns={columns} />}
               {isLoading && isDeleteLoading && isUpdateRegionLoading && (
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
                    modalTitle={
                         regionInput._id ? `Update Region` : "Create Region"
                    }
                    subTitle={
                         regionInput._id
                              ? `Update ${regionInput.name} Region`
                              : "Create a new region"
                    }
               >
                    <AppInput
                         value={regionInput.name}
                         onChange={(e) => {
                              const letters = e.target.value.replace(
                                   /[^A-Za-z\s]/g,
                                   ""
                              );
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
                    }}
                    btnTitle="Save Country"
                    action={handleNewCountry}
                    modalTitle="Create Country"
                    width="md"
               >
                    <div className="space-y-3">
                         {appError && (
                              <p className="text-red-500">{appError}</p>
                         )}
                         <AppSelect
                              value={selection?.region}
                              onChange={(e) => {
                                   const letters = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                   );
                                   dispatch(
                                        handleSelection({
                                             ...selection,
                                             region: letters as string,
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
                                   const letters = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                   );
                                   dispatch(
                                        handleSelection({
                                             ...selection,
                                             country: letters,
                                        })
                                   );
                              }}
                              placeholder="Country Name"
                         />
                         <AppInput
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={4} // Adjust max length as needed
                              minLength={1} // Optional: for form submission validation
                              value={selection.country_code || ""}
                              onChange={(e) => {
                                   const value = e.target.value;
                                   // Allow only digits and limit length
                                   if (
                                        /^\d*$/.test(value) &&
                                        value.length <= 4
                                   ) {
                                        dispatch(
                                             handleSelection({
                                                  ...selection,
                                                  country_code: value,
                                             })
                                        );
                                   }
                              }}
                              placeholder="Country Phone Code (exclude '+')"
                         />
                    </div>
               </AppModal>

               <AppModal
                    isOpen={cityModal}
                    toggle={() => {
                         dispatch(handleCityModal(false));
                    }}
                    modalTitle="Create City"
                    width="md"
                    btnTitle="Save City"
                    btnLoader={isNewCityLoading}
                    action={handleNewCity}
               >
                    <div className="space-y-3">
                         {appError && (
                              <p className="text-red-500">{appError}</p>
                         )}
                         <AppSelect
                              value={selection?.region}
                              onChange={(e) => {
                                   dispatch(
                                        handleSelection({
                                             ...selection,
                                             region: e.target.value as string,
                                             country: "",
                                        })
                                   );
                                   if (e.target.value.length) {
                                        handleSelection({
                                             ...selection,
                                             country: "",
                                        });
                                   }
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

                         {!isCountryLoading && (
                              <AppSelect
                                   value={selection?.country.toString() || ""}
                                   defaultValue={
                                        selection?.country.toString() || ""
                                   }
                                   onChange={(e) => {
                                        dispatch(
                                             handleSelection({
                                                  ...selection,
                                                  country: e.target.value,
                                             })
                                        );
                                   }}
                                   selectLabel="Country"
                                   options={
                                        countryData?.data?.map((region) => ({
                                             value: region._id,
                                             label: region.name,
                                        })) as {
                                             label: string;
                                             value: string;
                                        }[]
                                   }
                              />
                         )}

                         <AppInput
                              value={selection.city}
                              onChange={(e) => {
                                   const letters = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                   );
                                   dispatch(
                                        handleSelection({
                                             ...selection,
                                             city: letters,
                                        })
                                   );
                              }}
                              placeholder="City Name"
                         />
                    </div>
               </AppModal>
          </div>
     );
};
