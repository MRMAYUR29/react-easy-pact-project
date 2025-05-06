import { AiOutlineUser } from "react-icons/ai";
import { GoInbox } from "react-icons/go";
import {
     AppButton,
     AppLoader,
     AppSelect,
     DataLengths,
     DemoCard,
} from "../../component";
import {
     filterType,
     handleAppError,
     handleFilterCategory,
     handleProducts,
     setCategories,
     setFilterOption,
     useAppSlice,
     useProductSlice,
} from "../../redux/slice";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
     useGetAllProductsQuery,
     useGetAllUsersQuery,
     useGetCategoriesQuery,
} from "../../redux/api";
import { useAppDispatch } from "../../redux";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
     const {
          data: categoryData,
          isLoading: isCategoryLoading,
          isError: isCategoryError,
          error: categoryError,
          isSuccess: isCategorySuccess,
     } = useGetCategoriesQuery();
     const { data: users } = useGetAllUsersQuery();
     const { role } = useAppSlice();
     const navigate = useNavigate();

     const itemsPerPage: number = 12;
     const [currentPage, setCurrentPage] = useState(0); // Start from 0 for React Paginate

     const offset = currentPage * itemsPerPage;

     const { isError, error, data, isLoading, isSuccess } =
          useGetAllProductsQuery({
               page: currentPage + 1, // Convert zero-based index to one-based for backend
               size: itemsPerPage,
          });
     const { filteredProducts } = useProductSlice();
     const currentItems =
          filteredProducts &&
          filteredProducts.slice(offset, offset + itemsPerPage);

     const dispatch = useAppDispatch();
     const cardLengths = [
          { label: "Demos", Icon: GoInbox, value: data?.totalCount ?? 0 },
          {
               label: "Employes",
               Icon: AiOutlineUser,
               value: users?.totalCount ?? 0,
          },
     ];

     const handlePageClick = (event: { selected: number }) => {
          setCurrentPage(event.selected);
     };

     useEffect(() => {
          if (isSuccess && data?.data.length > 0) {
               dispatch(handleProducts(data?.data));
               setCurrentPage(0); // Reset pagination when new data is fetched
          }
     }, [isSuccess, data?.data, dispatch]);

     useEffect(() => {
          if (isCategorySuccess) {
               dispatch(setCategories(categoryData?.data));
          }
     }, [isCategorySuccess, dispatch, categoryData?.data]);

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

     return (
          <div
               className={clsx(
                    role === "employee" && "container mx-auto w-[80%]"
               )}
          >
               {(role === "admin" || role === "regional") && (
                    <div className="mb-5">
                         <h5 className="text-xl capitalize">
                              Hello! Welcome {role}
                         </h5>
                    </div>
               )}
               {role === "admin" && (
                    <DataLengths
                         lengthsData={cardLengths}
                         hourLabel="watch hours"
                         totalHours="1 hr 10 mins"
                    />
               )}
               <div className="flex items-center justify-between mt-10">
                    <h6 className="text-2xl">Recent Demos</h6>
                    <div className="flex items-center justify-end gap-5">
                         <div className="w-1/2">
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
                                        { label: "All", value: "all" },
                                        ...(categoryData?.data?.map(
                                             (category) => ({
                                                  label: category.name as string,
                                                  value: category._id as string,
                                             })
                                        ) || []),
                                   ]}
                              />
                         </div>
                         <div className="w-1/4">
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
                                        { label: "All", value: "all" },
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

               {(isLoading || isCategoryLoading) && <AppLoader />}
               {(!isLoading || !isCategoryLoading) && (
                    <div
                         className={clsx(
                              "grid grid-cols-12 mt-5 gap-x-4 gap-y-10"
                         )}
                    >
                         {currentItems &&
                              currentItems.map(
                                   (
                                        {
                                             image_url,
                                             title,
                                             _id,
                                             product_category_id,
                                             created_at,
                                        },
                                        i
                                   ) => (
                                        <div
                                             key={i}
                                             className={clsx(
                                                  role === "employee" &&
                                                       "xl:col-span-3 lg:col-span-3 md:col-span-6 sm:col-span-12 col-span-12",
                                                  role === "regional" &&
                                                       "xl:col-span-3 lg:col-span-3 md:col-span-6 sm:col-span-12 col-span-12",
                                                  role === "admin" &&
                                                       "xl:col-span-3 lg:col-span-4 md:col-span-6 sm:col-span-12 col-span-12"
                                             )}
                                        >
                                             <DemoCard
                                                  uploadedAt={
                                                       created_at as Date
                                                  }
                                                  key={i}
                                                  category={
                                                       (product_category_id?.name as string) ??
                                                       "Not Available"
                                                  }
                                                  image={image_url}
                                                  name={title}
                                                  productId={_id as string}
                                             />
                                        </div>
                                   )
                              )}
                         {!currentItems && (
                              <div className="col-span-12 gap-3 flex justify-center flex-col items-center my-10">
                                   <p>No demo product found!</p>
                                   <AppButton
                                        onClick={() => navigate("/new-demo")}
                                   >
                                        Start Upload
                                   </AppButton>
                              </div>
                         )}
                         {itemsPerPage > 12 && (
                              <div className="col-span-12 my-8 flex justify-end">
                                   <ReactPaginate
                                        breakLabel="..."
                                        nextLabel="Next >"
                                        previousLabel="< Prev"
                                        onPageChange={({ selected }) =>
                                             handlePageClick({ selected })
                                        }
                                        pageRangeDisplayed={
                                             data?.page as number
                                        }
                                        marginPagesDisplayed={itemsPerPage}
                                        pageCount={data?.totalPages as number}
                                        containerClassName="flex gap-2 items-center"
                                        pageClassName="rounded border text-lg px-4 py-2 hover:bg-gray-100"
                                        pageLinkClassName="text-gray-500"
                                        activeClassName="bg-gray-200 active:text-white"
                                        previousClassName="rounded px-4 py-2 bg-gray-200 hover:bg-gray-300"
                                        nextClassName="rounded px-4 py-2 bg-gray-200 hover:bg-gray-300"
                                        breakClassName="rounded px-4 py-2 text-gray-500"
                                        disabledClassName="opacity-50 cursor-not-allowed"
                                   />
                              </div>
                         )}
                    </div>
               )}
          </div>
     );
};
