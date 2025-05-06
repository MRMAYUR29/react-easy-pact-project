import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useAppDispatch } from "../../redux";
import { setToken, toggleSideNav, useAppSlice } from "../../redux/slice";
import { AppButton } from "../../component";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
     const { sideNav, role, appUser } = useAppSlice();
     const dispatch = useAppDispatch();
     const navigate = useNavigate();
     return (
          <nav
               className={clsx(
                    "flex flex-wrap w-full items-center sticky top-0 z-50 gap-5 justify-between py-3 px-5 bg-gray-100"
               )}
          >
               <div
                    className={clsx(
                         role === "employee"
                              ? "container mx-auto w-[80%]"
                              : "w-full",
                         "flex items-center justify-between"
                    )}
               >
                    {role === "employee" && (
                         <img
                              src="/images/logo.jpeg"
                              className="w-[200px]"
                              alt="logo"
                         />
                    )}
                    {(role === "admin" || role === "regional") && (
                         <button
                              className="fill-black focus:outline-none"
                              onClick={() => dispatch(toggleSideNav())}
                         >
                              {sideNav ? (
                                   <AiOutlineClose className="size-6" />
                              ) : (
                                   <AiOutlineMenu className="size-6" />
                              )}
                         </button>
                    )}
                    <div className={clsx("flex items-center justify-end")}>
                         <div
                              onClick={() => navigate("/profile")}
                              className="h-12 cursor-pointer w-12 flex mr-5 shadow-lg justify-center items-center rounded-full bg-primary-500"
                         >
                              <p className="capitalize text-xl text-white">
                                   {appUser?.name.charAt(0)}
                              </p>
                         </div>
                         {
                              <AppButton
                                   onClick={() =>
                                        dispatch(
                                             setToken({
                                                  token: null,
                                                  user: null,
                                                  role: null,
                                             })
                                        )
                                   }
                              >
                                   Logout
                              </AppButton>
                         }
                    </div>
               </div>
          </nav>
     );
};
