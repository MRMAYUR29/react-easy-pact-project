import { AiOutlineUser } from "react-icons/ai";
// import { GoInbox } from "react-icons/go";
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
    useAllUsersQuery, // Keep this import
    useGetCategoriesQuery,
} from "../../redux/api";
import { useAppDispatch } from "../../redux";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    // const roleTitles: Record<string, string> = {
    //     admin: "The Maestro",
    //     regional: "Experience Leader",
    //     employee: "Virtual Guide",
    // };
    
    const {
        data: categoryData,
        isLoading: isCategoryLoading,
        isError: isCategoryError,
        error: categoryError,
        isSuccess: isCategorySuccess,
    } = useGetCategoriesQuery();

    // Corrected: Destructure 'data' as 'allUsersResponse' or similar,
    // and then access allUsersResponse.data to get the array.
    const { data: allUsersResponse } = useAllUsersQuery();
    
    const { role } = useAppSlice();
    const navigate = useNavigate();

    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(0);

    const offset = currentPage * itemsPerPage;

    const { isError, error, data, isLoading, isSuccess } = useGetAllProductsQuery({
        page: currentPage + 1,
        size: itemsPerPage,
    });

    const { filteredProducts } = useProductSlice();
    const currentItems = filteredProducts?.slice(offset, offset + itemsPerPage);

    const dispatch = useAppDispatch();

    // Now, access the 'data' property from allUsersResponse to get the array
// -    const adminCount = allUsersData?.filter((user: any) => user.user_type_id?.type_name === "admin").length || 0;
// -    const regionalCount = allUsersData?.filter((user: any) => user.user_type_id?.type_name === "regional").length || 0;
// -    const employeeCount = allUsersData?.filter((user: any) => user.user_type_id?.type_name === "employee").length || 0;
    const adminCount = allUsersResponse?.data?.filter((user: any) => user.user_type_id?.type_name === "admin").length || 0;
    const regionalCount = allUsersResponse?.data?.filter((user: any) => user.user_type_id?.type_name === "regional").length || 0;
    const employeeCount = allUsersResponse?.data?.filter((user: any) => user.user_type_id?.type_name === "employee").length || 0;

    const cardLengths = [
        // { label: "Total Demos", Icon: GoInbox, value: data?.totalCount ?? 0 },
        { label: "Maestro", Icon: AiOutlineUser, value: adminCount },  //Admin
        { label: "Experience Leaders", Icon: AiOutlineUser, value: regionalCount },  //regional admin
        { label: "Virtual Guide", Icon: AiOutlineUser, value: employeeCount }, //employee
    ];

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    useEffect(() => {
        if (isSuccess && data?.data.length > 0) {
            dispatch(handleProducts(data?.data));
            setCurrentPage(0);
        }
    }, [isSuccess, data?.data, dispatch]);

    useEffect(() => {
        if (isCategorySuccess) {
            dispatch(setCategories(categoryData?.data));
        }
    }, [isCategorySuccess, dispatch, categoryData?.data]);

    useEffect(() => {
        if (isError) {
            const err = error as { data?: { message: string }; message: string };
            dispatch(handleAppError(err.data?.message || err.message));
        }
    }, [dispatch, isError, error]);

    useEffect(() => {
        if (isCategoryError) {
            const err = categoryError as { data?: { message: string }; message: string };
            dispatch(handleAppError(err.data?.message || err.message));
        }
    }, [dispatch, isCategoryError, categoryError]);

    return (
        <div className={clsx("container mx-auto px-4", role === "employee" && "max-w-7xl")}>
            {role === "admin" && (
                <DataLengths
                    lengthsData={cardLengths}
                    hourLabel="watch hours"
                    totalHours="1 hr 10 mins"
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 gap-4">
                <h6 className="text-2xl">Recent Demos</h6>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <AppSelect
                        selectLabel="Categories"
                        defaultValue="all"
                        onChange={(e) =>
                            dispatch(handleFilterCategory(e.target.value as string))
                        }
                        options={[
                            { label: "All", value: "all" },
                            ...(categoryData?.data?.map((category) => ({
                                label: category.name as string,
                                value: category._id as string,
                            })) || []),
                        ]}
                    />
                    <AppSelect
                        selectLabel="Sort By"
                        defaultValue="all"
                        onChange={(e) =>
                            dispatch(setFilterOption(e.target.value as filterType))
                        }
                        options={[
                            { label: "All", value: "all" },
                            { label: "New to Old", value: "newToOld" },
                            { label: "Old to New", value: "oldToNew" },
                            { label: "Recently Launched", value: "recentlyLaunched" },
                        ]}
                    />
                </div>
            </div>

            {(isLoading || isCategoryLoading) && <AppLoader />}

            {!isLoading && !isCategoryLoading && (
                <div className="grid grid-cols-12 mt-6 gap-4 sm:gap-6">
                    {currentItems && currentItems.length > 0 ? (
                        currentItems.map((item, i) => (
                            <div
                                key={i}
                                className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
                            >
                                <DemoCard
                                    uploadedAt={item.created_at as Date}
                                    category={item.product_category_id?.name ?? "Not Available"}
                                    image={item.image_url}
                                    name={item.title}
                                    productId={item._id as string}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-12 flex flex-col items-center my-10">
                            <p>No demo product found!</p>
                            <AppButton onClick={() => navigate("/new-demo")}>
                                Start Upload
                            </AppButton>
                        </div>
                    )}

                    {data?.totalPages as number > 1 && (
                        <div className="col-span-12 my-8 flex justify-center">
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="Next >"
                                previousLabel="< Prev"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={data?.totalPages || 0}
                                containerClassName="flex gap-2 items-center flex-wrap"
                                pageClassName="rounded border text-sm px-3 py-1 hover:bg-gray-100"
                                pageLinkClassName="text-gray-500"
                                activeClassName="bg-gray-300 text-white"
                                previousClassName="rounded px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                nextClassName="rounded px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                breakClassName="text-gray-500"
                                disabledClassName="opacity-50 cursor-not-allowed"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};