import { FormikErrors } from "formik";
import { FC } from "react";
import classNames from "classnames";
import { FormLabel } from "./FormLabel";
import { inputClassName } from "./FormText";
import Datepicker, { DatepickerType } from "react-tailwindcss-datepicker";

interface FormDatePickerProps extends DatepickerType {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  labelContainerClassName?: string;
  error?: string | string[] | FormikErrors<object> | FormikErrors<object>[];
}
export const FormDatePicker: FC<FormDatePickerProps> = ({
  id,
  label = "",
  required,
  name,
  error,
  className,
  labelClassName,
  containerClassName,
  labelContainerClassName,
  disabled,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <FormLabel
        label={label}
        htmlFor={name}
        required={required}
        className={labelClassName}
        containerClassName={labelContainerClassName}
      />

      <div className="flex flex-1 flex-col">
        <Datepicker
          {...props}
          asSingle
          showShortcuts
          useRange={false}
          inputId={id}
          inputName={name}
          disabled={disabled}
          inputClassName={classNames(
            inputClassName,
            "!inline-block",
            !!error && "ring-red-500",
            disabled && "bg-gray-100 text-gray-500",
            className
          )}
        />

        {typeof error === "string" && !!error && (
          <span className="mt-2 text-sm text-red-500">{error}</span>
        )}
        {Array.isArray(error) && (
          <span className="mt-2 text-sm text-red-500">{error.join(", ")}</span>
        )}
      </div>
    </div>
  );
};
