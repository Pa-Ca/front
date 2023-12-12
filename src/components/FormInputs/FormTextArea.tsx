import { FC } from "react";
import classNames from "classnames";
import { FormikErrors } from "formik";
import { FormLabel } from "./FormLabel";
import { inputClassName } from "./FormText";

export interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  labelcontainerClassName?: string;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
}
export const FormTextArea: FC<FormTextAreaProps> = ({
  name,
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
  return (
    <div className={containerClassName}>
      <FormLabel
        label={label}
        htmlFor={name}
        required={required}
        className={labelClassName}
        containerClassName={labelcontainerClassName}
      />

      <div className="flex flex-1 flex-col">
        <div className="relative flex flex-1 items-center">
          <textarea
            {...props}
            name={name}
            disabled={disabled}
            className={classNames(
              inputClassName,
              !!error && "ring-red-500",
              disabled && "bg-gray-100 text-gray-500",
              className
            )}
          />
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
