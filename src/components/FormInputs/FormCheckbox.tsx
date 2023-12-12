import { FC } from "react";
import classNames from "classnames";
import { FormikErrors } from "formik";
import { FormLabel } from "./FormLabel";

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  ref?: React.Ref<HTMLInputElement>;
  containerClassName?: string;
  inputClassName?: string;
  labelcontainerClassName?: string;
  labelClassName?: string;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
}
export const FormCheckbox: FC<FormCheckboxProps> = ({
  label = "",
  name,
  error,
  className,
  labelClassName,
  inputClassName,
  containerClassName,
  labelcontainerClassName,
  ref,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <div className="flex items-center">
        <input
          {...props}
          ref={ref}
          name={name}
          type="checkbox"
          className={classNames(
            "peer h-4 w-4 text-orange-700 focus:ring-orange-700 border-gray-300 shadow rounded",
            inputClassName
          )}
        />

        <FormLabel
          label={label}
          htmlFor={name}
          className={classNames("ml-2 text-sm", labelClassName)}
          containerClassName={labelcontainerClassName}
        />
      </div>

      {typeof error === "string" && !!error && (
        <span className="text-sm text-red-500 text-start">{error}</span>
      )}
      {Array.isArray(error) && (
        <span className="text-sm text-red-500 text-start">{error.join(", ")}</span>
      )}
    </div>
  );
};
