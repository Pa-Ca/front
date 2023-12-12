import { FC, HTMLAttributes, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

interface PaginationButtonProps extends HTMLAttributes<HTMLSpanElement> {
  current?: boolean;
  children: React.ReactNode;
}
const PaginationButton: FC<PaginationButtonProps> = ({
  current = false,
  onClick,
  className,
  children,
  ...props
}) => (
  <span
    className={classNames(
      "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer",
      current
        ? "z-10 bg-orange-700 text-white focus-visible:outline focus-visible:outline-2 hover:bg-orange-500 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:outline-offset-0",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </span>
);

interface PaginationFooterProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}
export const PaginationFooter: FC<PaginationFooterProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const firstElement = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage, itemsPerPage]
  );

  const lastElement = useMemo(
    () => Math.min(firstElement + itemsPerPage, totalItems),
    [firstElement, itemsPerPage, totalItems]
  );

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3 md:px-6">
      <div className="flex flex-1 md:gap-4 md:items-center justify-center md:justify-between">
        <div className="hidden md:block">
          <p className="text-sm text-gray-700">
            Mostrando registros del <span className="font-medium">{firstElement}</span> al{" "}
            <span className="font-medium">{lastElement}</span> de{" "}
            <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>

        <div className={classNames("hidden", totalItems > 0 && "sm:block")}>
          <div
            className="isolate inline-flex -space-x-px rounded-md shadow-sm select-none"
            aria-label="Pagination"
          >
            <div
              onClick={() => onPageChange(currentPage - 1)}
              className={classNames(
                "relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0",
                currentPage === 0 &&
                  "cursor-auto bg-gray-100 hover:!bg-gray-100 pointer-events-none"
              )}
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>

            {totalPages < 8 &&
              new Array(totalPages).fill(0).map((_, index) => (
                <PaginationButton
                  key={index}
                  onClick={() => onPageChange(index)}
                  current={index === currentPage}
                >
                  {index + 1}
                </PaginationButton>
              ))}

            {totalPages >= 8 && currentPage < 4 && (
              <>
                {new Array(5).fill(0).map((_, index) => (
                  <PaginationButton
                    key={index}
                    onClick={() => onPageChange(index)}
                    current={index === currentPage}
                  >
                    {index + 1}
                  </PaginationButton>
                ))}

                <PaginationButton className="cursor-auto bg-white hover:!bg-white">
                  ...
                </PaginationButton>
                <PaginationButton onClick={() => onPageChange(totalPages - 1)}>
                  {totalPages}
                </PaginationButton>
              </>
            )}

            {totalPages >= 8 && currentPage >= 4 && totalPages - currentPage >= 5 && (
              <>
                <PaginationButton onClick={() => onPageChange(0)}>1</PaginationButton>
                <PaginationButton className="cursor-auto bg-white hover:!bg-white">
                  ...
                </PaginationButton>

                {new Array(3).fill(0).map((_, index) => (
                  <PaginationButton
                    key={index}
                    onClick={() => onPageChange(index + currentPage - 1)}
                    current={index === 1}
                  >
                    {index + currentPage}
                  </PaginationButton>
                ))}

                <PaginationButton className="cursor-auto bg-white hover:!bg-white">
                  ...
                </PaginationButton>
                <PaginationButton onClick={() => onPageChange(totalPages - 1)}>
                  {totalPages}
                </PaginationButton>
              </>
            )}

            {totalPages >= 8 && totalPages - currentPage < 5 && (
              <>
                <PaginationButton onClick={() => onPageChange(0)}>1</PaginationButton>
                <PaginationButton className="cursor-auto bg-white hover:!bg-white">
                  ...
                </PaginationButton>

                {new Array(5).fill(0).map((_, index) => (
                  <PaginationButton
                    key={index}
                    onClick={() => onPageChange(index + totalPages - 5)}
                    current={index + totalPages - 5 === currentPage}
                  >
                    {index + totalPages - 4}
                  </PaginationButton>
                ))}
              </>
            )}

            <div
              onClick={() => onPageChange(currentPage + 1)}
              className={classNames(
                "relative inline-flex cursor-pointer items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0",
                currentPage === totalPages - 1 &&
                  "cursor-auto bg-gray-100 hover:!bg-gray-100 pointer-events-none"
              )}
            >
              <span className="sr-only">Siguiente</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className={classNames("sm:hidden", totalItems === 0 && "hidden")}>
          <div
            className="isolate inline-flex -space-x-px rounded-md shadow-sm select-none"
            aria-label="Pagination"
          >
            <div
              onClick={() => onPageChange(currentPage - 1)}
              className={classNames(
                "relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0",
                currentPage === 0 &&
                  "cursor-auto bg-gray-100 hover:!bg-gray-100 pointer-events-none"
              )}
            >
              {" "}
              <span className="sr-only">Anterior</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>

            {currentPage === 0 &&
              new Array(Math.min(3, totalPages)).fill(0).map((_, index) => (
                <PaginationButton
                  key={index}
                  onClick={() => onPageChange(index)}
                  current={index === currentPage}
                >
                  {index + 1}
                </PaginationButton>
              ))}

            {currentPage > 0 &&
              currentPage < totalPages - 1 &&
              new Array(Math.min(3, totalPages)).fill(0).map((_, index) => (
                <PaginationButton
                  key={index}
                  onClick={() => onPageChange(currentPage + index - 1)}
                  current={index === 1}
                >
                  {currentPage + index}
                </PaginationButton>
              ))}

            {currentPage === totalPages - 1 &&
              currentPage > 0 &&
              new Array(Math.min(3, totalPages)).fill(0).map((_, index) => (
                <PaginationButton
                  key={index}
                  onClick={() => onPageChange(totalPages + index - 3)}
                  current={index === 2}
                >
                  {totalPages - 2 + index}
                </PaginationButton>
              ))}

            <div
              onClick={() => onPageChange(currentPage + 1)}
              className={classNames(
                "relative inline-flex cursor-pointer items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0",
                currentPage === totalPages - 1 &&
                  "cursor-auto bg-gray-100 hover:!bg-gray-100 pointer-events-none"
              )}
            >
              {" "}
              <span className="sr-only">Siguiente</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
