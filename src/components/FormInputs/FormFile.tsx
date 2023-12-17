import { FC, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { FormikErrors } from "formik";
import { inputClassName } from "./FormText";
import {
  XMarkIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface FormFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  selected?: File;
  description?: string;
  containerClassname?: string;
  labelContainerClassname?: string;
  error?: string | string[] | FormikErrors<object> | FormikErrors<object>[];
  onSelectFile: (file?: File) => void;
}
export const FormFile: FC<FormFileProps> = ({
  label = "",
  name,
  error,
  disabled,
  selected,
  description,
  className,
  containerClassname,
  labelContainerClassname,
  onSelectFile,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileImage = useMemo(() => {
    if (!selected) return undefined;

    if (selected.type.includes("image")) {
      return URL.createObjectURL(selected);
    }

    return undefined;
  }, [selected]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    // Verify that the mouse is not over the input
    const rect = labelRef.current?.getBoundingClientRect();
    if (
      !!rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      return;
    }
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!!file && !!inputRef.current) {
      inputRef.current.files = e.dataTransfer.files;
      onSelectFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (file) {
      onSelectFile(file);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    // event.preventDefault();
    event.stopPropagation();
    inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      inputRef.current?.click();
    }
  };

  return (
    <div className={classNames("flex flex-col gap-4 w-full", containerClassname)}>
      <label
        tabIndex={0}
        ref={labelRef}
        htmlFor="dropzone-file"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={classNames(
          isDraggingOver ? "bg-gray-200" : "bg-gray-50",
          "flex flex-col items-center justify-center overflow-hidden w-full border-2 border-orange-500 border-dashed rounded-lg cursor-pointer hover:bg-gray-200",
          labelContainerClassname
        )}
      >
        {!fileImage && (
          <div className="flex flex-col items-center justify-center p-6">
            <CloudArrowUpIcon className="w-12 h-12 mb-4 text-orange-700" />
            <p className="mb-2 text-sm text-gray-500 text-center">
              <span className="font-semibold text-orange-700">{label}</span>
              <br />
              <span>
                <span className="font-semibold">Haz click</span> para subir o arrastra y
                suelta tu archivo aquí
              </span>
            </p>
            <p className="text-xs text-gray-500 text-center">{description}</p>
          </div>
        )}

        {!!fileImage && (
          <img src={fileImage} alt={selected?.name} className="w-full h-full" />
        )}
      </label>

      <div>
        <input
          {...props}
          type="file"
          id="dropzone-file"
          name={name}
          ref={inputRef}
          disabled={disabled}
          onChange={handleChange}
          className="hidden"
        />

        <div
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={classNames(
            inputClassName,
            !!error && "ring-red-500",
            disabled && "bg-gray-100 text-gray-500",
            "flex items-center relative px-4 pr-11 cursor-pointer hover:bg-gray-100",
            className
          )}
        >
          {selected?.name ? (
            <span className="truncate">{selected.name}</span>
          ) : (
            <span className="text-gray-400 truncate">
              No se ha seleccionado ningún archivo
            </span>
          )}

          {!selected && (
            <MagnifyingGlassIcon
              className="cursor-pointer absolute right-3 h-5 w-5 text-gray-400 hover:text-orange-700"
              aria-hidden="true"
              onClick={handleClick}
              style={{ top: "calc(50% - 0.6rem)" }}
            />
          )}

          {selected && (
            <XMarkIcon
              className="cursor-pointer absolute right-3 h-5 w-5 text-gray-400 hover:text-orange-700"
              aria-hidden="true"
              onClick={(event) => {
                event.stopPropagation();
                onSelectFile(undefined);
              }}
              style={{ top: "calc(50% - 0.6rem)" }}
            />
          )}
        </div>

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
