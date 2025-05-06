import clsx from "clsx";
import { InputHTMLAttributes, DetailedHTMLProps, FC } from "react";

export interface AppInputProps {
  label?: string;
  touched?: boolean;
  error?: string;
  centered?: boolean;
  prefix?: React.ReactNode;
}

type NativeInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const AppInput: FC<AppInputProps & NativeInputProps> = ({
  label,
  error,
  centered,
  type,
  prefix,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        "space-y-0 w-full",
        centered && "flex flex-col justify-end items-end"
      )}
    >
      {label && (
        <label
          className="text-md font-normal text-gray-600 capitalize text-center"
          htmlFor={label}
        >
          {label}
        </label>
      )}

      {/* Wrapper for input and prefix */}
      <div className="flex w-full items-center">
        {prefix && (
          <span className="px-3 py-2 bg-gray-100 border border-gray-400 rounded-l-lg text-gray-600">
            {prefix}
          </span>
        )}
        <input
          {...(rest as NativeInputProps)}
          className={clsx(
            "border border-gray-400 focus:outline-none py-2 px-5 rounded-lg w-full",
            centered && "text-center",
            type === "number" && "appearance-none"
          )}
          type={type}
        />
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};
