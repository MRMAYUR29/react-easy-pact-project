import {
     Menu,
     MenuButton,
     MenuItem,
     MenuItems,
     Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { FC, Fragment } from "react";
import { IconType } from "react-icons";
import { MdChevronRight, MdOutlineMoreHoriz } from "react-icons/md";
import { NavLink } from "react-router-dom";

export interface DropdownProps {
     btnLabel: string;
     menus: {
          label: string;
          href: string;
     }[];
     Icon?: IconType;
}

export const Dropdown: FC<DropdownProps> = ({ btnLabel, menus, Icon }) => {
     return (
          <Menu as="div" className="w-full relative">
               <MenuButton
                    className={({ focus, open }) =>
                         clsx(
                              "flex items-center w-full hover:bg-primary-500 hover:text-white justify-between gap-x-1.5 rounded-md py-3 px-3  text-gray-500",
                              open && "bg-gray-300",
                              focus && "bg-gray-300"
                         )
                    }
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
               >
                    {({ open }) => (
                         <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-4">
                                   {Icon && <Icon className="size-6" />}
                                   <p className="capitalize text-md hidden md:block">
                                        {btnLabel}
                                   </p>
                              </div>
                              {open ? (
                                   <MdChevronRight className="size-6" />
                              ) : (
                                   <MdOutlineMoreHoriz className="size-6" />
                              )}
                         </div>
                    )}
               </MenuButton>

               <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
               >
                    <MenuItems
                         as="div"
                         anchor="right start"
                         className="absolute right-0 ml-5 z-10 mt-2 w-56 px-2 py-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                    >
                         {menus.map(({ href, label }, i) =>
                              href === "divider" && label === "divider" ? (
                                   <div
                                        key={`divider-${i}`}
                                        className="border-t border-gray-300 my-2"
                                   ></div>
                              ) : (
                                   <MenuItem as="div" key={i}>
                                        <NavLink
                                             to={href}
                                             className={({ isActive }) => {
                                                  return clsx(
                                                       "block my-1 px-2 hover:bg-primary-500 hover:text-white capitalize py-2 text-sm text-gray-500",
                                                       isActive &&
                                                            "bg-primary-500 text-white"
                                                  );
                                             }}
                                        >
                                             {label}
                                        </NavLink>
                                   </MenuItem>
                              )
                         )}
                    </MenuItems>
               </Transition>
          </Menu>
     );
};
