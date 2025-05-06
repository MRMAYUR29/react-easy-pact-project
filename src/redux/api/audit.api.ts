import { createApi } from "@reduxjs/toolkit/query/react";
import { appServerRequest } from "../../utils";
import { IActivityLog } from "../../interface";

const AuditLogsApi = createApi({
     reducerPath: "auditLogsApi",
     baseQuery: appServerRequest,
     tagTypes: ["AuditLogs"],
     endpoints: (builder) => ({
          getAllLogs: builder.query<{ data: IActivityLog[] }, void>({
               query: () => "/activity-logs",
               providesTags: ["AuditLogs"],
          }),
     }),
});

export const {
     useGetAllLogsQuery,
     reducer: auditLogsApiReducer,
     middleware: auditLogsApiMiddleware,
} = AuditLogsApi;
