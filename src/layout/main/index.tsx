import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
     handleAppError,
     handleAppSuccess,
     setToken,
     useAppSlice,
} from "../../redux/slice";
import { SideNav } from "../sidenav";
import { useAppDispatch } from "../../redux";
import { TbCheck, TbX } from "react-icons/tb";
import { NavBar } from "../navbar";

export interface MainLayoutProps {
     region?: string;
}

export const MainLayout: FC<MainLayoutProps> = () => {
     const { sideNav, role, appError, appSuccess, toastTimer } = useAppSlice();
     const dispatch = useAppDispatch();

     useEffect(() => {
          if (appError) {
               setTimeout(() => {
                    dispatch(handleAppError(null));
               }, toastTimer);
          }
          if (
               appError === "Unauthorized: No token provided" ||
               appError === "Unauthorized: Invalid token" ||
               appError === "Unauthorized: Invalid user"
          ) {
               dispatch(handleAppError(null));
               dispatch(
                    setToken({
                         role: null,
                         token: null,
                         user: null,
                    })
               );
          }
     }, [dispatch, appError, toastTimer]);

     useEffect(() => {
          if (appSuccess) {
               setTimeout(() => {
                    dispatch(handleAppSuccess(null));
               }, toastTimer);
          }
     }, [dispatch, appSuccess, toastTimer]);
     return (
          <section className="flex h-screen relative">
               {(role === "admin" || role === "regional") && sideNav && (
                    <SideNav />
               )}
               {appError && (
                    <div
                         id="toast-default"
                         className="absolute right-6 top-32  z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-red-400 rounded-lg shadow-xl dark:text-gray-400"
                         role="alert"
                    >
                         <div className="inline-flex items-center justify-center shrink-0 w-8 h-8  bg-red-100 rounded-lg ">
                              <TbX />
                         </div>
                         <div className="ms-3 text-white text-sm font-normal">
                              {appError}
                         </div>
                         <button
                              onClick={() => dispatch(handleAppError(null))}
                              type="button"
                              className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white"
                              data-dismiss-target="#toast-default"
                              aria-label="Close"
                         >
                              <span className="sr-only">Close</span>
                              <TbX />
                         </button>
                    </div>
               )}
               {appSuccess && (
                    <div
                         id="toast-default"
                         className="absolute right-6 top-32  z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-primary-400 rounded-lg shadow-xl dark:text-gray-400"
                         role="alert"
                    >
                         <div className="inline-flex items-center justify-center shrink-0 w-8 h-8  bg-primary-100 rounded-lg ">
                              <TbCheck />
                              <span className="sr-only">Fire icon</span>
                         </div>
                         <div className="ms-3 text-white text-sm font-normal">
                              {appSuccess}
                         </div>
                         <button
                              onClick={() => dispatch(handleAppSuccess(null))}
                              type="button"
                              className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-primary-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white"
                              data-dismiss-target="#toast-default"
                              aria-label="Close"
                         >
                              <span className="sr-only">Close</span>
                              <TbX />
                         </button>
                    </div>
               )}
               <main className="flex-1 overflow-y-scroll h-full block relative">
                    <NavBar />
                    <section className="pt-5 px-5">
                         <Outlet />
                    </section>
               </main>
          </section>
     );
};
