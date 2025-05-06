import clsx from "clsx";
import { FC } from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

export interface MenuButtonProps {
     Icon: IconType;
     label: string;
     path: string;
}

export const MenuButton: FC<MenuButtonProps> = ({ Icon, label, path }) => {
     return (
          <NavLink
               to={path}
               className={({ isActive }) =>
                    clsx(
                         "cursor-pointer flex items-center gap-4 py-3 px-3 rounded-lg hover:bg-primary-500 hover:text-white",
                         isActive
                              ? "bg-primary-500 text-white"
                              : "text-gray-500"
                    )
               }
          >
               <Icon className="size-6" />
               <p className="capitalize hidden md:block">{label}</p>{" "}
          </NavLink>
     );
};
