import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import {
     AppButton,
     AppLoader,
     AppModal,
     AppSelect,
     DemoCard,
     PageTitle,
} from "../../component";
import {
     useGetAllProductsQuery,
     useGetAllUsersQuery,
     useGetCategoriesQuery,
     useCreateMapProductMutation,
} from "../../redux/api";
import {
     filterType,
     handleAppError,
     handleAppSuccess,
     handleAssignProductModal,
     handleDemoAssignment,
     handleFilterCategory,
     handleProducts,
     handleProductSearch,
     setCategories,
     setFilterOption,
     setUsers,
     useAppSlice,
     useProductSlice,
     useUserSlice,
} from "../../redux/slice";
import { useAppDispatch } from "../../redux";
import { IMapProductProps } from "../../interface";

export const DemoPage = () => {
     const itemsPerPage: number = 12;
     const dispatch = useAppDispatch();
     const navigate = useNavigate();
     const { users } = useUserSlice();
     const { role } = useAppSlice();
     const { filteredProducts, searchInput, assignProductModal, assignment } =
          useProductSlice();
     const [currentPage, setCurrentPage] = useState(1);

     const offset = currentPage * itemsPerPage;

     const { isError, error, data, isLoading, isSuccess } =
          useGetAllProductsQuery({
               page: currentPage,
               size: itemsPerPage,
          });
     const {
          data: categoryData,
          isError: isCategoryError,
          error: categoryError,
          isSuccess: isCategorySuccess,
     } = useGetCategoriesQuery();

     const {
          data: employeeData,
          isError: isEmployeeError,
          error: employeeError,
          isSuccess: isEmployeeSuccess,
     } = useGetAllUsersQuery();
     const [
          MapProduct,
          {
               isLoading: isMapLoading,
               isError: isMapError,
               error: mapError,
               isSuccess: isMapSuccess,
               data: mapData,
          },
     ] = useCreateMapProductMutation();

     useEffect(() => {
          if (isSuccess && data?.data.length > 0) {
               dispatch(handleProducts(data?.data));
               setCurrentPage(0); // Reset pagination when new data is fetched
          }
     }, [isSuccess, data?.data, dispatch]);

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
          if (isEmployeeSuccess) {
               dispatch(setUsers(employeeData?.data));
          }
     }, [isEmployeeSuccess, dispatch, employeeData?.data]);

     useEffect(() => {
          if (isMapSuccess) {
               dispatch(handleAppSuccess(mapData?.message));
          }
     }, [isMapSuccess, mapData?.message, dispatch]);

     useEffect(() => {
          if (isError) {
               const err = error as {
                    data?: { message: string };
                    message: string;
               };
               dispatch(
                    handleAppError(err.data ? err.data.message : err.message)
               );
          }
     }, [dispatch, isError, error]);

     useEffect(() => {
          if (isCategorySuccess) {
               dispatch(setCategories(categoryData?.data));
          }
     }, [isCategorySuccess, dispatch, categoryData?.data]);

     useEffect(() => {
          if (isCategoryError) {
               const err = categoryError as {
                    data?: { message: string };
                    message: string;
               };
               dispatch(
                    handleAppError(err.data ? err.data.message : err.message)
               );
          }
     }, [dispatch, isCategoryError, categoryError]);

     const handlePageClick = (event: { selected: number }) => {
          setCurrentPage(event.selected);
     };

     const currentItems =
          filteredProducts &&
          filteredProducts.slice(offset, offset + itemsPerPage);

     const handleMapProduct = async () => {
          if (assignment?.demo_product_id && assignment.user_id) {
               await MapProduct({
                    demo_product_id: assignment?.demo_product_id as string,
                    user_id: assignment.user_id as string,
               });
          } else {
               dispatch(handleAppError("Please select a product and user"));
          }
     };

     useEffect(() => {
          if (users && filteredProducts) {
               dispatch(
                    handleDemoAssignment({
                         demo_product_id:
                              filteredProducts[0]?._id?.toString() as string,
                         user_id: users
                              .filter((user) => {
                                   return (
                                        user.user_type_id.type_name !== "admin"
                                   );
                              })[0]
                              ._id?.toString() as string,
                    } as IMapProductProps)
               );
          }
     }, [users, filteredProducts, dispatch]);
     return (
          <div className="space-y-5">
               <PageTitle title="Demo Management" subTitle="List of demo" />
               <div className="bg-gray-200 my-5 px-5 py-5 rounded-lg">
                    <div className="flex items-end justify-between gap-5">
                         <div className="flex items-center gap-5 w-1/3">
                              <div className="flex flex-1 gap-2 items-center border border-gray-500 rounded-lg px-3">
                                   <AiOutlineSearch className="size-6 fill-gray-500" />
                                   <input
                                        value={searchInput}
                                        onChange={(e) => {
                                             dispatch(
                                                  handleProductSearch(
                                                       e.target.value
                                                  )
                                             );
                                        }}
                                        type="search"
                                        placeholder="Search demo"
                                        className="bg-transparent placeholder:text-gray-500 w-full py-2 focus:outline-none"
                                   />
                              </div>
                         </div>
                         <div className="flex items-end gap-5 flex-1">
                              {role === "admin" && (
                                   <>
                                        <AppButton
                                             fullWidth
                                             onClick={() =>
                                                  navigate("/categories")
                                             }
                                        >
                                             Categories
                                        </AppButton>
                                        <AppButton
                                             fullWidth
                                             onClick={() =>
                                                  navigate("/new-demo")
                                             }
                                        >
                                             <AiOutlinePlus className="size-6" />
                                             New demo
                                        </AppButton>
                                   </>
                              )}
                              <AppSelect
                                   selectLabel="Categories"
                                   defaultValue="all"
                                   onChange={(e) =>
                                        dispatch(
                                             handleFilterCategory(
                                                  e.target.value as string
                                             )
                                        )
                                   }
                                   options={[
                                        {
                                             label: "All",
                                             value: "all",
                                        },
                                        ...(categoryData?.data?.map(
                                             (category) => ({
                                                  label: category.name as string,
                                                  value: category._id as string,
                                             })
                                        ) || []),
                                   ]}
                              />
                              <AppSelect
                                   selectLabel="Sort By"
                                   defaultValue={"all"}
                                   onChange={(e) =>
                                        dispatch(
                                             setFilterOption(
                                                  e.target.value as filterType
                                             )
                                        )
                                   }
                                   options={[
                                        {
                                             label: "All",
                                             value: "all",
                                        },
                                        {
                                             label: "New to Old",
                                             value: "newToOld",
                                        },
                                        {
                                             label: "Old to New",
                                             value: "oldToNew",
                                        },
                                        {
                                             label: "Recently Launched",
                                             value: "recentlyLaunched",
                                        },
                                   ]}
                              />
                         </div>
                    </div>
               </div>
               {isLoading && <AppLoader />}
               <div className="grid grid-cols-12 mt-5 gap-x-4 gap-y-10">
                    {!isLoading &&
                         currentItems &&
                         currentItems.map(
                              ({
                                   image_url,
                                   title,
                                   product_category_id,
                                   _id,
                                   created_at,
                              }) => (
                                   <div
                                        key={_id} // Fix: key should be unique
                                        className="xl:col-span-3 lg:col-span-2 md:col-span-6 sm:col-span-12 col-span-12"
                                   >
                                        <DemoCard
                                             uploadedAt={created_at as Date}
                                             image={image_url}
                                             name={title}
                                             category={
                                                  product_category_id?.name as string
                                             }
                                             productId={_id as string}
                                        />
                                   </div>
                              )
                         )}
                    {!currentItems && (
                         <div className="col-span-12 gap-3 flex justify-center flex-col items-center my-10">
                              <p>No demo product found!</p>
                              <AppButton onClick={() => navigate("/new-demo")}>
                                   Start Upload
                              </AppButton>
                         </div>
                    )}
               </div>
               {searchInput && !filteredProducts?.length && (
                    <div className="flex items-center justify-center">
                         <p className="text-2xl text-gray-500">
                              No results found
                         </p>
                    </div>
               )}
               {itemsPerPage > 12 &&
                    filteredProducts &&
                    filteredProducts.length > 0 && (
                         <div className="col-span-12 mt-8 flex justify-end">
                              <ReactPaginate
                                   breakLabel="..."
                                   nextLabel="Next >"
                                   previousLabel="< Prev"
                                   onPageChange={({ selected }) =>
                                        handlePageClick({ selected })
                                   }
                                   pageRangeDisplayed={data?.page as number}
                                   marginPagesDisplayed={itemsPerPage}
                                   pageCount={data?.totalPages as number}
                                   containerClassName="flex gap-2 items-center"
                                   pageClassName="rounded border text-lg px-4 py-2 hover:bg-gray-100"
                                   pageLinkClassName="text-gray-500"
                                   activeClassName="bg-gray-200 active:text-white"
                                   previousClassName="rounded px-4 py-2 bg-gray-200 hover:bg-gray-300"
                                   nextClassName="rounded px-4 py-2 bg-gray-200 hover:bg-gray-300"
                                   breakClassName="rounded px-4 py-2 text-gray-500"
                                   disabledClassName="opacity-50"
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
                    <div>
                         <div className="flex items-center gap-5">
                              <AppSelect
                                   onChange={(e) =>
                                        dispatch(
                                             handleDemoAssignment({
                                                  ...(assignment as IMapProductProps),
                                                  demo_product_id: e.target
                                                       .value as string,
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
                                   selectLabel="Select Demo"
                                   defaultValue={
                                        filteredProducts?.length
                                             ? filteredProducts[0]._id
                                             : undefined
                                   }
                              />
                              <AppSelect
                                   onChange={(e) =>
                                        dispatch(
                                             handleDemoAssignment({
                                                  ...(assignment as IMapProductProps),
                                                  user_id: e.target
                                                       .value as string,
                                             })
                                        )
                                   }
                                   options={
                                        users
                                             ?.filter(
                                                  (user) =>
                                                       user.user_type_id
                                                            .type_name !==
                                                       "admin"
                                             )
                                             ?.map((user) => {
                                                  return {
                                                       label: user.name as string,
                                                       value: user._id as string,
                                                  };
                                             }) || []
                                   }
                                   selectLabel="Select User"
                                   defaultValue={
                                        users?.filter(
                                             (user) =>
                                                  user.user_type_id
                                                       .type_name !== "admin"
                                        )?.length
                                             ? users.filter(
                                                    (user) =>
                                                         user.user_type_id
                                                              .type_name !==
                                                         "admin"
                                               )[0]._id
                                             : (assignment?.user_id as string)
                                   }
                              />
                         </div>
                    </div>
               </AppModal>
          </div>
     );
};
