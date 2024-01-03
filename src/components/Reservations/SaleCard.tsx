import { FC, useMemo, useState } from "react";
import classNames from "classnames";
import { LinkText } from "../FormInputs/Buttons";
import { SaleInterface, TableInterace } from "@objects";
import { ClockIcon } from "@heroicons/react/24/outline";
import { CurrencyDollarIcon, InboxStackIcon, UserIcon } from "@heroicons/react/24/solid";

interface SaleCardProps {
  id: string;
  sale: SaleInterface;
  selected?: boolean;
  onSelectSale?: (sale: SaleInterface) => void;
  onSelectTable?: (table: TableInterace) => void;
}
export const SaleCard: FC<SaleCardProps> = ({
  id,
  sale,
  selected,
  onSelectSale = () => {},
  onSelectTable = () => {},
}) => {
  const [start, setStart] = useState(0);

  const owner = useMemo(() => sale.client ?? sale.guest, [sale]);

  const total = useMemo(
    () =>
      sale.products
        .reduce((acc, product) => acc + product.price * product.amount, 0)
        .toFixed(2),
    [sale.products]
  );

  return (
    <div
      id={id}
      key={sale.sale.id}
      onClick={() => onSelectSale(sale)}
      className={classNames(
        "flex p-4 gap-6 bg-white shadow hover:shadow-lg rounded-lg cursor-pointer border-2",
        selected && "border-orange-500"
      )}
    >
      <div className="flex flex-[1.75] flex-col justify-center">
        <p className="text-gray-900 font-semibold">
          {owner?.name} {owner?.surname}
        </p>
        <p className="text-sm leading-tight">{owner?.phoneNumber}</p>

        <p
          className="flex items-center text-sm leading-tight"
          title="Hora de inicio"
          data-te-toggle="tooltip"
        >
          <ClockIcon className="w-[0.8rem] h-[0.8rem] inline-block mr-1" />
          {new Date(sale.sale.startTime).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>

        <div className="flex w-full items-center justify-between">
          <p
            className="flex flex-1 items-center text-sm leading-tight"
            title={`${sale.sale.clientQuantity} Clientes`}
            data-te-toggle="tooltip"
          >
            <UserIcon className="w-[0.8rem] h-[0.8rem] inline-block mr-1" />
            {sale.sale.clientQuantity}
          </p>

          <p
            className="hidden lg:flex flex-1 items-center text-sm leading-tight"
            title={`${sale.products.length} Productos`}
            data-te-toggle="tooltip"
          >
            <InboxStackIcon className="w-[0.9rem] h-[0.9rem] inline-block mr-1" />
            {sale.products.length}
          </p>

          <p
            className="flex flex-1 items-center justify-end text-xs leading-tight"
            title={`$${total} en Productos`}
            data-te-toggle="tooltip"
          >
            <CurrencyDollarIcon className="w-[1rem] h-[1rem] inline-block mr-1" />
            {total}
          </p>
        </div>
      </div>

      <div className="hidden xl:flex flex-1 flex-col items-center h-[6rem] justify-center">
        <div className="flex flex-1 w-full flex-col flex-wrap gap-1 max-h-[5rem]">
          {sale.tables
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(start, start + 8)
            .map((table) => (
              <div
                key={table.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTable(table);
                }}
                className="flex flex-col flex-1 items-center justify-center bg-orange-700 shadow rounded cursor-pointer hover:shadow-2xl hover:bg-orange-600 transition max-h-[1rem]"
              >
                <p className="text-white font-bold text-xs">{table.name}</p>
              </div>
            ))}
        </div>

        <div className="flex w-full justify-between">
          <div>
            {start > 0 && (
              <LinkText
                text={`< ${start}`}
                className="text-center text-xs select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setStart(start - 8);
                }}
              />
            )}
          </div>

          <div>
            {sale.tables.length > start + 8 && (
              <LinkText
                className="text-center text-xs select-none"
                text={`${sale.tables.length - start - 8} >`}
                onClick={(e) => {
                  e.stopPropagation();
                  setStart(start + 8);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
