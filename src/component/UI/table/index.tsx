import { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  PaginationState,
  RowSelectionState, // Import RowSelectionState
  getFilteredRowModel, // Useful for client-side filtering (if you implement it in AppTable)
} from "@tanstack/react-table";
import clsx from "clsx";
import { AiOutlineSearch } from "react-icons/ai";
import { AppButton } from "../button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface AppTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  tableTitle?: string;
  newBtnAction?: () => void;
  enableSearch?: boolean;
  tableClassName?: string;
  rowClassName?: string;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  // New props for row selection
  rowSelection: RowSelectionState;
  onRowSelectionChange: (
    updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => void;
  // New prop to specify the unique ID accessor
  getRowId?: (originalRow: T, index: number) => string;
}

export const AppTable = <T extends { _id?: string }>({ // Extend T to ensure _id exists
  columns,
  data,
  tableTitle,
  newBtnAction,
  enableSearch,
  tableClassName,
  rowClassName,
  pagination,
  setPagination,
  rowSelection, // Destructure new prop
  onRowSelectionChange, // Destructure new prop
  getRowId, // Destructure new prop
}: AppTableProps<T>) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable<T>({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Added for client-side filtering if you want to implement search within AppTable
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      rowSelection, // Pass external row selection state
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: onRowSelectionChange, // Pass external row selection setter
    manualPagination: false, // Keep false if RTK Query handles all data, true if your API paginates
    // Define how to get a unique ID for each row, essential for selection
    getRowId: getRowId || ((row) => (row._id as string) || String(Math.random())), // Default to _id or fallback
  });

  return (
    <div className="select-none">
      {enableSearch && (
        <div className="bg-gray-100 p-3 flex justify-between gap-5 items-center rounded-t-lg">
          <div className="flex items-center gap-3 flex-1 p-2 bg-white rounded-lg">
            <AiOutlineSearch className="size-6 fill-gray-400" />
            <input
              className="w-full bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-500"
              placeholder={`Search ${tableTitle ?? "Table"}`}
              // The search input for AppTable is commented out as it's handled in UsersListPage
              // If you want to move search here, you'd need a local search state and filter the table data here.
            />
          </div>
          {tableTitle && (
            <AppButton onClick={newBtnAction}>{tableTitle}</AppButton>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
          className={clsx("table-auto relative pt-3", tableClassName)}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={clsx("bg-gray-100")}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={clsx(
                      "uppercase text-base font-semibold text-left p-3",
                      "border border-gray-400",
                      (header.column.columnDef.meta as { className?: string })
                        ?.className
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={clsx(
                  "hover:bg-gray-100",
                  rowClassName,
                  { "bg-blue-50": row.getIsSelected() } // Highlight selected rows
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={clsx(
                      "p-2 border border-gray-400 text-sm",
                      (cell.column.columnDef.meta as { className?: string })
                        ?.className
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className={clsx(
              "border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm",
              rowClassName,
              { "bg-blue-50": row.getIsSelected() } // Highlight selected rows on mobile
            )}
          >
            {/* Add checkbox for mobile view at the top of the card */}
            <div className="mb-2 flex justify-end">
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
                className="form-checkbox h-5 w-5 text-primary-600 rounded"
              />
            </div>
            {row.getVisibleCells().map((cell) => (
              <div
                key={cell.id}
                className={clsx(
                  "flex mb-2 last:mb-0 items-baseline",
                  {
                    "pt-4 border-t border-gray-200 mt-4":
                      cell.column.id === "_id" || cell.column.id === "select", // Apply border if it's the actions column or select column
                    "flex-row items-center justify-between":
                      cell.column.id === "is_active",
                  }
                )}
              >
                {/* Do not display header for the select column itself, as the checkbox is the header */}
                {cell.column.id !== "_id" && cell.column.id !== "select" && (
                  <span className="font-semibold text-gray-700 text-sm flex-shrink-0 mr-2">
                    {" "}
                    {typeof cell.column.columnDef.header === "string"
                      ? cell.column.columnDef.header
                      : cell.column.id.charAt(0).toUpperCase() +
                        cell.column.id.slice(1).replace(/_/g, " ")}{" "}
                    :
                  </span>
                )}
                <span
                  className={clsx(
                    "text-gray-900 text-base flex-grow",
                    {
                      "ml-2": cell.column.id === "is_active",
                      "flex justify-end w-full": cell.column.id === "_id" || cell.column.id === "select",
                    }
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-end gap-5 items-center bg-gray-100 p-2 rounded-b-lg">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <p>Rows per page</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="focus:outline-none cursor-pointer"
          >
            {[50, 100, 150].map((size, i) => (
              <option key={i} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={clsx(
            "border rounded disabled:bg-gray-100 border-gray-500 p-2",
            "disabled:opacity-50"
          )}
        >
          <FaChevronLeft className="size-4 text-gray-800 disabled:text-gray-400" />
        </button>
        <div className="text-md flex items-center gap-3">
          <span>{table.getState().pagination.pageIndex + 1}</span>/
          <span>{table.getPageCount()}</span>
        </div>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={clsx(
            "border rounded disabled:bg-gray-100 border-gray-500 p-2",
            "disabled:opacity-50"
          )}
        >
          <FaChevronRight className="size-4 text-gray-800 disabled:text-gray-400" />
        </button>
      </div>
    </div>
  );
};