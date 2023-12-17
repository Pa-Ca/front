import { FC, useMemo } from "react";
import classNames from "classnames";
import { LocalTime } from "@objects";
import { FormikErrors } from "formik";
import { handleNaturalNumberChange } from "@utils";

export interface FormLocalTimeProps {
  id: string;
  name: string;
  value: LocalTime;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  labelcontainerClassName?: string;
  error?: string | string[] | FormikErrors<object> | FormikErrors<object>[];
  onChange: (value: LocalTime) => void;
}
export const FormLocalTime: FC<FormLocalTimeProps> = ({
  id,
  name,
  error,
  value,
  disabled,
  required,
  labelClassName,
  containerClassName,
  labelcontainerClassName,
  label = "",
  onChange,
}) => {
  const hours = useMemo(() => {
    return value.split(":")[0];
  }, [value]);

  const minutes = useMemo(() => {
    return value.split(":")[1];
  }, [value]);

  const handleChange = (hours: string, minutes: string) => {
    const value = `${hours}:${minutes}:00` as LocalTime;
    onChange(value);
  };

  return (
    <div className={containerClassName}>
      <div className={classNames("flex justify-between", labelcontainerClassName)}>
        <div>
          <p
            className={classNames(
              "block text-sm font-semibold leading-6 text-gray-800 truncate",
              labelClassName
            )}
          >
            {required && <span className="text-red-500">*</span>}
            {label}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="relative flex flex-1 items-center gap-2 items-center">
          <input
            id={`${id}-hours`}
            name={`${name}-hours`}
            value={hours}
            maxLength={2}
            disabled={disabled}
            onChange={(e) =>
              handleNaturalNumberChange(e, (event) =>
                handleChange(event.target.value, minutes)
              )
            }
            className={classNames(
              "border-0 border-b focus:border-orange-700 focus:border-b-[0.15rem] focus:ring-0 w-12 text-center",
              !!error && "border-red-500 border-b-[0.1rem]"
            )}
          />

          <label htmlFor={`${id}-hours`}>:</label>

          <input
            id={`${id}-minutes`}
            name={`${name}-minutes`}
            value={minutes}
            maxLength={2}
            disabled={disabled}
            onChange={(e) =>
              handleNaturalNumberChange(e, (event) =>
                handleChange(hours, event.target.value)
              )
            }
            className={classNames(
              "border-0 border-b focus:border-orange-700 focus:border-b-[0.15rem] focus:ring-0 w-12 text-center",
              !!error && "border-red-500 border-b-[0.1rem]"
            )}
          />

          <label htmlFor={`${name}-minutes`}></label>
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
