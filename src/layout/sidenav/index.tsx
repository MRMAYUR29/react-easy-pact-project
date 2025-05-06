import clsx from "clsx";
import { FC } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GiPokecog } from "react-icons/gi";
import { Dropdown, MenuButton } from "../../component";
import { useAppSlice } from "../../redux/slice";
import { TbCube3dSphere, TbHelp, TbHome2, TbUser } from "react-icons/tb";

export const SideNav: FC = () => {
     const { role } = useAppSlice();
     const adminMenu = [
          {
               href: "/new-users",
               label: "add new users",
          },
          {
               href: "/new-demo",
               label: "add new product",
          },
          {
               href: "/assigned-products",
               label: "Assigned Products",
          },
          {
               href: "divider",
               label: "divider",
          },
          {
               href: "region",
               label: "Demographics",
          },
          {
               href: "audit-logs",
               label: "application Logs",
          },
     ];

     return (
          <div
               className={clsx(
                    "w-[14%] flex justify-between flex-col p-2 bg-gray-100"
               )}
          >
               <div>
                    <img src="/images/logo.jpeg" alt="logo" />
                    <div className="mt-5 space-y-3 w-full">
                         <MenuButton Icon={TbHome2} label="Home" path="/" />
                         <MenuButton
                              Icon={TbCube3dSphere}
                              label="Demos"
                              path="/demo"
                         />
                         {role === "regional" && (
                              <MenuButton
                                   Icon={TbUser}
                                   label="Employee"
                                   path="/users"
                              />
                         )}
                         {role === "admin" && (
                              <MenuButton
                                   label="Users"
                                   Icon={AiOutlineUser}
                                   path="users"
                              />
                         )}
                         {role === "admin" && (
                              <Dropdown
                                   Icon={GiPokecog}
                                   btnLabel="Settings"
                                   menus={(role === "admin" && adminMenu) || []}
                              />
                         )}
                         <MenuButton
                              label="Help Desk"
                              Icon={TbHelp}
                              path="/need-help"
                         />
                    </div>
               </div>
          </div>
     );
};
