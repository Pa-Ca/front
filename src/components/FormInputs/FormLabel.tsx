import classNames from "classnames";
import { FC } from "react";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  required?: boolean;
  containerClassname?: string;
}
export const FormLabel: FC<FormLabelProps> = ({
  label,
  htmlFor,
  required,
  className = "",
  containerClassname = "",
  ...props
}) => {
  return (
    <div className={classNames("flex justify-between", containerClassname)}>
      <div>
        <label
          {...props}
          htmlFor={htmlFor}
          className={classNames(
            "block text-sm font-semibold leading-6 text-gray-800 truncate",
            className
          )}
        >
          {required && <span className="text-red-500">*</span>}
          {label}
        </label>
      </div>
    </div>
  );
};
