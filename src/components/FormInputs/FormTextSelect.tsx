import { Fragment, useState } from "react";
import classNames from "classnames";
import { FormikErrors } from "formik";
import { FormLabel } from "./FormLabel";
import { inputClassName } from "./FormText";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

interface Option<T> {
  value: T;
  id: string;
  name: string;
}
export interface FormTextSelectProps<T>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  selected: Option<T>;
  options: Option<T>[];
  required?: boolean;
  defaultOption?: string;
  labelClassName?: string;
  containerClassName?: string;
  labelcontainerClassName?: string;
  selectContainerClassNames?: string;
  error?: string | string[] | FormikErrors<object> | FormikErrors<object>[];
  ref?: React.Ref<HTMLInputElement>;
  onSelectOption: (value: T) => void;
}
export function FormTextSelect<T>({
  ref,
  name,
  selected,
  options,
  type,
  error,
  disabled,
  required,
  className,
  defaultOption,
  labelClassName,
  containerClassName,
  labelcontainerClassName,
  selectContainerClassNames,
  label = "",
  onSelectOption,
  ...props
}: FormTextSelectProps<T>) {
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
          <Listbox value={selected.value} onChange={onSelectOption}>
            {({ open }) => (
              <div className={classNames("flex flex-1 flex-col")}>
                <Listbox.Label htmlFor={name} className="hidden"></Listbox.Label>

                <div className="relative flex w-full">
                  <Listbox.Button
                    className={classNames(
                      "relative w-full h-10 cursor-default rounded-md rounded-r-none bg-white py-1.5 pl-3 pr-6 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm sm:leading-6",
                      inputClassName,
                      selectContainerClassNames,
                      !!error && "ring-red-500"
                    )}
                  >
                    <span className="block truncate">
                      {selected.name ? (
                        selected.name
                      ) : (
                        <span className="italic italic opacity-50">{defaultOption}</span>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-2 top-full max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {options.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            classNames(
                              active ? "bg-orange-700 text-white" : "text-gray-900",
                              "relative cursor-pointer select-none py-2 pl-6 pr-4"
                            )
                          }
                          value={option.value}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {option.name ? (
                                  option.name
                                ) : (
                                  <span className="italic italic opacity-50">
                                    {defaultOption}
                                  </span>
                                )}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-orange-700",
                                    "absolute inset-y-0 left-0 flex items-center pl-1"
                                  )}
                                >
                                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </div>
            )}
          </Listbox>

          <input
            {...props}
            ref={ref}
            name={name}
            type={currentType}
            disabled={disabled}
            className={classNames(
              inputClassName,
              "rounded-l-none",
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
}
