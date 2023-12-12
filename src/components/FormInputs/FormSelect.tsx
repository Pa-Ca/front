import { Fragment } from "react";
import classNames from "classnames";
import { FormikErrors } from "formik";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

interface Option<T> {
  value: T;
  id: string;
  name: string;
  description?: string;
}
interface FormSelectProps<T> {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  selected: Option<T>;
  options: Option<T>[];
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  onChange: (value: T) => void;
}
export const FormSelect = <T extends any>({
  id,
  name,
  label,
  required,
  selected,
  options,
  labelClassName,
  inputClassName,
  containerClassName,
  error,
  onChange,
}: FormSelectProps<T>) => {
  return (
    <Listbox value={selected.value} onChange={onChange}>
      {({ open }) => (
        <div className={classNames("flex flex-1 flex-col", containerClassName)}>
          <Listbox.Label
            htmlFor={name}
            className={classNames(
              "block text-sm font-medium leading-6 text-gray-900",
              labelClassName
            )}
          >
            {required && <span className="text-red-500">*</span>}
            {label}
          </Listbox.Label>

          <div className="relative flex w-full">
            <Listbox.Button
              id={id}
              className={classNames(
                "relative w-full h-10 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm sm:leading-6",
                inputClassName
              )}
            >
              <span className="block truncate">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            {typeof error === "string" && !!error && (
              <span className="text-sm text-red-500 text-start">{error}</span>
            )}
            {Array.isArray(error) && (
              <span className="text-sm text-red-500 text-start">{error.join(", ")}</span>
            )}

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
                        "relative cursor-pointer select-none py-2 pl-8 pr-4"
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
                          {option.name}
                        </span>
                        <p className={classNames("block truncate text-xs ")}>
                          {option.description}
                        </p>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-orange-700",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
  );
};
