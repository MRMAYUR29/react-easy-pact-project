import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";

export interface AppButtonProps {
  fullWidth?: boolean;
  black?: boolean;
  loading?: boolean;
  danger?: boolean;
}

export const AppButton: FC<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    AppButtonProps
> = ({ fullWidth, children, black, loading, disabled, danger, ...rest }) => {
  return (
    <button
      disabled={loading || disabled}
      className={clsx(
        "px-2 justify-center trainsition-all duration-300 rounded-lg py-2 flex flex-row items-center gap-2",
        fullWidth && "w-full",
        black
          ? "bg-gray-950 text-white"
          : "bg-primary-500 hover:bg-primary-600 hover:shadow-xl disabled:bg-primary-400 text-white",
        danger && "bg-red-500 disabled:bg-red-100 text-white"
      )}
      {...rest}
    >
      {loading ? (
        <AiOutlineLoading className="animate-spin size-6" />
      ) : (
        children
      )}
    </button>
  );
};
