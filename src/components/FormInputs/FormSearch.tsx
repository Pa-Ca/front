import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { FormikErrors } from "formik";
import { inputClassName } from "./FormText";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface Option<T> {
  value: T;
  id: string;
  name: string;
  description?: string;
}
interface FormSearchProps<T> extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  selected: Option<T>;
  options: Option<T>[];
  defaultOption?: string;
  labelClassName?: string;
  containerClassName?: string;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  onSelectOption: (value: T) => void;
}
export const FormSearch = <T extends any>({
  name,
  label,
  disabled,
  required,
  selected,
  options,
  className,
  defaultOption = "Seleccionar...",
  labelClassName,
  containerClassName,
  error,
  onSelectOption,
  ...props
}: FormSearchProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter(
      (option) =>
        !search ||
        !option.name ||
        option.name.toLowerCase().includes(search.toLowerCase()) ||
        option.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  useEffect(() => {
    if (open) {
      setSearch("");
    } else {
      setSearch(selected.name);
    }
  }, [open, selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setOpen]);

  return (
    <Listbox
      value={selected.value}
      onChange={(option) => {
        setOpen(false);
        onSelectOption(option);
      }}
    >
      <div className={containerClassName}>
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

        <div ref={ref} className="relative w-full">
          <div className="relative w-full">
            <input
              {...props}
              name={name}
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={disabled}
              onFocus={() => setOpen(true)}
              className={classNames(
                inputClassName,
                !!error && "ring-red-500",
                disabled && "bg-gray-100 text-gray-500",
                "pr-10",
                className
              )}
            />

            <div className="absolute right-2 inset-y-0 right-0 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>

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
            <Listbox.Options className="absolute z-10 top-full mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className="group relative cursor-pointer select-none py-2 pl-8 pr-4 text-gray-900 hover:bg-orange-700 hover:text-white"
                  value={option.value}
                >
                  {!!option.name ? (
                    <span
                      className={classNames(
                        selected.id === option.id ? "font-semibold" : "font-normal",
                        "block truncate"
                      )}
                    >
                      {option.name}
                    </span>
                  ) : (
                    <span
                      className={classNames(
                        selected.id === option.id ? "font-semibold" : "font-normal",
                        "block truncate italic opacity-50"
                      )}
                    >
                      {defaultOption}
                    </span>
                  )}
                  <p className={classNames("block truncate text-xs ")}>
                    {option.description}
                  </p>

                  {selected.id === option.id && (
                    <span
                      className={classNames(
                        "absolute inset-y-0 left-0 flex items-center pl-1.5 text-orange-700 text-black group-hover:text-white"
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
    </Listbox>
  );
};
