import { FC, useState } from "react";
import classNames from "classnames";
import { FormikErrors } from "formik";
import { FormLabel } from "./FormLabel";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export const inputClassName =
  "focus block w-full rounded-lg border-0 text-gray-800 " +
  "shadow-sm ring-1 ring-inset ring-gray-300 " +
  "placeholder:text-gray-400 focus:ring-2 focus:ring-inset " +
  "focus:ring-orange-500 sm:text-sm sm:leading-6 " +
  "invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer " +
  "h-10";
export interface FormTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  labelcontainerClassName?: string;
  error?: string | string[] | FormikErrors<object> | FormikErrors<object>[];
  ref?: React.Ref<HTMLInputElement>;
}
export const FormText: FC<FormTextProps> = ({
  ref,
  name,
  type,
  error,
  disabled,
  required,
  className,
  labelClassName,
  containerClassName,
  labelcontainerClassName,
  label = "",
  ...props
}) => {
  const [currentType, setCurrentType] = useState(type);

  return (
    <div className={containerClassName}>
      <FormLabel
        label={label}
        htmlFor={name}
        required={required}
        className={labelClassName}
        containerClassName={labelcontainerClassName}
      />

      <div className="flex w-full flex-col">
        <div className="relative flex flex-1 items-center">
          <input
            {...props}
            ref={ref}
            name={name}
            type={currentType}
            disabled={disabled}
            className={classNames(
              inputClassName,
              !!error && "ring-red-500",
              disabled && "bg-gray-100 text-gray-500",
              className
            )}
          />
          {type === "password" && currentType === "password" && (
            <EyeIcon
              onClick={() => setCurrentType("text")}
              className="absolute cursor-pointer text-orange-800 h-6 w-6 right-2"
            />
          )}
          {type === "password" && currentType === "text" && (
            <EyeSlashIcon
              onClick={() => setCurrentType("password")}
              className="absolute cursor-pointer text-orange-800 h-6 w-6 right-2"
            />
          )}
        </div>

        {typeof error === "string" && !!error && (
          <span className="text-sm text-red-500 text-start">{error}</span>
        )}
        {Array.isArray(error) && (
          <span className="text-sm text-red-500 text-start">{error.join(", ")}</span>
        )}
      </div>
    </div>
  );
};
