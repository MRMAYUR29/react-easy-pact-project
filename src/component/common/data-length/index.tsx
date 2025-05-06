import { FC } from "react";
import { IconType } from "react-icons";
import { CiStopwatch } from "react-icons/ci";

export interface DataLengthsProps {
     lengthsData: {
          Icon: IconType;
          label: string;
          value: number | string;
     }[];
     totalHours: string;
     hourLabel: string;
}

export const DataLengths: FC<DataLengthsProps> = ({
     lengthsData,
     totalHours,
     hourLabel,
}) => {
     return (
          <div className="grid grid-cols-12 gap-5">
               {lengthsData.map(({ Icon, label, value }, i) => (
                    <div
                         className="group transition-all duration-200 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-12 col-span-12 bg-white p-5 rounded-lg border flex items-center"
                         key={i}
                    >
                         <div className="w-1/3">
                              <Icon className="size-20 text-primary-500" />
                              <p className="capitalize text-xl group-hover:text-primary-500">
                                   {label}
                              </p>
                         </div>
                         <p className="text-5xl capitalize">{value}</p>
                    </div>
               ))}
               <div className="xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-12 col-span-12 bg-white p-5 rounded-lg border flex items-center">
                    <div className="w-1/3">
                         <CiStopwatch className="size-20 text-primary-500" />
                         <p className="text-gray-500 text-xl capitalize">
                              {hourLabel}
                         </p>
                    </div>
                    <p className="text-4xl capitalize">{totalHours}</p>
               </div>
          </div>
     );
};
