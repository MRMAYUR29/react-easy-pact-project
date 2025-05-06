import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../redux";

export const appServerRequest = fetchBaseQuery({
     baseUrl: import.meta.env.VITE_APP_BACKEND_URL,
     prepareHeaders: (headers, state) => {
          const appToken: string = (state.getState() as RootState).app
               .token as string;
          const appSession: string = (state.getState() as RootState).app.appUser?.session_id as string
          headers.set("Authorization", `Bearer ${appToken}`);
          headers.set('x-session-id', appSession)
     },
});
