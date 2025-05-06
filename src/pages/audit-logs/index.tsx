import { useEffect } from "react";
import { AppLoader, PageTitle } from "../../component";
import { useGetAllLogsQuery } from "../../redux/api";
import { useAppDispatch } from "../../redux";
import { handleAppError } from "../../redux/slice";
import moment from "moment";
import { IActivityLog } from "../../interface";

export const AuditLogsPage = () => {
     const { data, isError, error, isLoading } = useGetAllLogsQuery();
     const dispatch = useAppDispatch();

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
     return (
          <div>
               <PageTitle title="Audit Logs" />
               {isLoading && <AppLoader />}
               {!isLoading && (
                    <div className="text-center text-xl text-gray-500 mt-10">
                         {data?.data.length === 0 && "No Activity found"}
                    </div>
               )}
               {(data?.data.length as number) > 0 && (
                    <div className="mt-10">
                         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                   <tr>
                                        <th scope="col" className="px-6 py-3">
                                             Action
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                             User
                                        </th>
                                        <th
                                             scope="col"
                                             className="px-6 py-3 text-right"
                                        >
                                             Time
                                        </th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {[
                                        ...(data?.data as unknown as IActivityLog[]),
                                   ]
                                        .sort(
                                             (a, b) =>
                                                  new Date(
                                                       b.created_at as unknown as string
                                                  ).getTime() -
                                                  new Date(
                                                       a.created_at as unknown as string
                                                  ).getTime()
                                        )
                                        .map((log) => (
                                             <tr
                                                  className="bg-white border-b"
                                                  key={log._id}
                                             >
                                                  <td className="px-6 py-4">
                                                       {log.action} -{" "}
                                                       {log.module}
                                                  </td>
                                                  <td className="px-6 py-4">
                                                       By{" "}
                                                       {log.performed_by
                                                            ?.name ?? "N/A"}
                                                  </td>
                                                  <td className="px-6 text-right py-4">
                                                       {moment(
                                                            log.created_at
                                                       ).format("lll")}
                                                  </td>
                                             </tr>
                                        ))}
                              </tbody>
                         </table>
                    </div>
               )}
          </div>
     );
};
