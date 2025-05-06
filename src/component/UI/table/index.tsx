import { useMemo, useState } from "react";
import {
     useReactTable,
     flexRender,
     getCoreRowModel,
     getPaginationRowModel,
     ColumnDef,
} from "@tanstack/react-table";
import clsx from "clsx";
import { AiOutlineFilter, AiOutlineSearch } from "react-icons/ai";
import { AppButton } from "../button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Checkbox } from "@headlessui/react";

// Define a generic type for table data
export interface AppTableProps<T> {
     data: T[];
     columns: ColumnDef<T>[];
     tableTitle?: string;
     newBtnAction?: () => void;
     enableSearch?: boolean;
}

export const AppTable = <T,>({
     columns,
     data,
     tableTitle,
     newBtnAction,
     enableSearch,
}: AppTableProps<T>) => {
     const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

     const memoizedColumns = useMemo(() => columns, [columns]);
     const memoizedData = useMemo(() => data, [data]);

     const table = useReactTable<T>({
          data: memoizedData,
          columns: memoizedColumns,
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
     });

     const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked) {
               setSelectedRows(new Set(memoizedData.map((_, index) => index)));
          } else {
               setSelectedRows(new Set());
          }
     };

     const handleSelectRow = (index: number) => {
          const newSelectedRows = new Set(selectedRows);
          if (newSelectedRows.has(index)) {
               newSelectedRows.delete(index);
          } else {
               newSelectedRows.add(index);
          }
          setSelectedRows(newSelectedRows);
     };

     return (
          <div className="select-none">
               {enableSearch && (
                    <div className="bg-gray-100 p-3 flex justify-between gap-5 items-center rounded-t-lg">
                         {/* <button className="p-2 bg-gray-300 rounded-lg">
            <AiOutlineFilter className="size-5" />
          </button> */}
                         <div className="flex items-center gap-3 flex-1 p-2 bg-white rounded-lg">
                              <AiOutlineSearch className="size-6 fill-gray-400" />
                              <input
                                   className="w-full bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-500"
                                   placeholder={`Search ${
                                        tableTitle ?? "Table"
                                   }`}
                              />
                         </div>
                         {tableTitle && (
                              <AppButton onClick={newBtnAction}>
                                   {tableTitle}
                              </AppButton>
                         )}
                    </div>
               )}
               <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                    className="table-auto relative pt-3"
               >
                    <thead>
                         {table.getHeaderGroups().map((headerGroup) => (
                              <tr
                                   key={headerGroup.id}
                                   className={clsx("bg-gray-100")}
                              >
                                   <th className="p-3 w-[70px] text-left">
                                        <input
                                             type="checkbox"
                                             onChange={handleSelectAll}
                                        />
                                   </th>
                                   {headerGroup.headers.map((header) => (
                                        <th
                                             key={header.id}
                                             className={clsx(
                                                  "uppercase text-xs font-semibold text-left p-3",
                                                  (
                                                       header.column.columnDef
                                                            .meta as {
                                                            className?: string;
                                                       }
                                                  )?.className
                                             )}
                                        >
                                             {flexRender(
                                                  header.column.columnDef
                                                       .header,
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
                                   className={clsx("hover:bg-gray-100")}
                              >
                                   <td className="p-3 gap-3 text-gray-500 font-normal">
                                        <div className="flex gap-3 items-center">
                                             <Checkbox
                                                  checked={selectedRows.has(
                                                       row.index
                                                  )}
                                                  onChange={() =>
                                                       handleSelectRow(
                                                            row.index
                                                       )
                                                  }
                                                  className="group block size-4 rounded border bg-white data-[checked]:bg-primary-500"
                                             >
                                                  <svg
                                                       className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                                                       viewBox="0 0 14 14"
                                                       fill="none"
                                                  >
                                                       <path
                                                            d="M3 8L6 11L11 3.5"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                       />
                                                  </svg>
                                             </Checkbox>
                                             <p className="text-lg">
                                                  {row.index + 1}
                                             </p>
                                        </div>
                                   </td>
                                   {row.getVisibleCells().map((cell) => (
                                        <td
                                             key={cell.id}
                                             className={clsx(
                                                  "py-2",
                                                  (
                                                       cell.column.columnDef
                                                            .meta as {
                                                            className?: string;
                                                       }
                                                  )?.className
                                             )}
                                        >
                                             {flexRender(
                                                  cell.column.columnDef.cell,
                                                  cell.getContext()
                                             )}
                                        </td>
                                   ))}
                              </tr>
                         ))}
                    </tbody>
               </table>
               <div className="mt-4 flex justify-end gap-5 items-center bg-gray-100 p-2 rounded-b-lg">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                         <p>Rows per page</p>
                         <select
                              value={table.getState().pagination.pageSize}
                              onChange={(e) =>
                                   table.setPageSize(Number(e.target.value))
                              }
                              className="focus:outline-none cursor-pointer"
                         >
                              {[5, 10, 15, 20].map((size, i) => (
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
                         <span>
                              {table.getState().pagination.pageIndex + 1}
                         </span>
                         /<span>{table.getPageCount()}</span>
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
