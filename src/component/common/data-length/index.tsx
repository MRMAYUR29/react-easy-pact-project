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
    <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {lengthsData.map(({ Icon, label, value }, i) => (
        <div
          key={i}
          className="group transition-all duration-200 bg-white p-5 rounded-lg border flex items-center"
        >
          <div className="w-1/3 flex justify-center">
            <Icon className="size-20 text-primary-500" />
          </div>
          <div className="w-2/3">
            <p className="capitalize text-xl font-medium">{label}</p>
            <p className="text-5xl font-semibold">{value}</p>
          </div>
        </div>
      ))}
      <div className="bg-white p-5 rounded-lg border flex items-center">
        <div className="w-1/3 flex justify-center">
          <CiStopwatch className="size-20 text-primary-500" />
        </div>
        <div className="w-2/3">
          <p className="text-gray-500 text-xl capitalize">{hourLabel}</p>
          <p className="text-4xl font-semibold">{totalHours}</p>
        </div>
      </div>
    </div>
  );
};
