import { Select, SelectProps } from "@headlessui/react";
import clsx from "clsx";
import { FC } from "react";

export interface AppSelectProps {
     options: { value: string; label: string }[];
     selectLabel?: string;
     touched?: boolean;
     error?: string;
     centered?: boolean;
     disabled?: boolean;
}

export const AppSelect: FC<AppSelectProps & SelectProps> = ({
     options,
     selectLabel,
     error,
     centered,
     disabled,
     ...rest
}) => {
     return (
          <div
               className={clsx(
                    "space-y-0 w-full",
                    centered && "flex flex-col items-center"
               )}
          >
               {selectLabel && (
                    <label
                         className="text-sm text-gray-600 capitalize text-center"
                         htmlFor={selectLabel}
                    >
                         {selectLabel}
                    </label>
               )}
               <Select
                    disabled={disabled}
                    className={clsx(
                         "border border-gray-400 focus:outline-none py-2 px-5 rounded-lg w-full",
                         centered && "text-center"
                    )}
                    name={selectLabel}
                    {...rest}
               >
                    <option value="" selected disabled>
                         Select {selectLabel}
                    </option>
                    {options?.map(({ value, label }) => (
                         <option key={value} value={value}>
                              {label}
                         </option>
                    ))}
               </Select>
               {error && <p className="text-red-700">{error}</p>}
          </div>
     );
};
