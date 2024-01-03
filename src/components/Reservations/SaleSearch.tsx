import { FC, useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { Icon } from "@iconify/react";
import { SaleCard } from "./SaleCard";
import { SaleInterface } from "@objects";
import { ReservationsContext } from "@utils";
import { FormText } from "../FormInputs/FormText";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import saleNotFound from "../../assets/images/sale-not-found.png";
import tableNotFound from "../../assets/images/table-not-found.png";
import fileDocumentCheckOutline from "@iconify/icons-mdi/file-document-check-outline";
import tableRestaurantRounded from "@iconify/icons-material-symbols/table-restaurant-rounded";

enum SearchMode {
  TABLE,
  SALE,
}

interface SaleSearchProps {
  saleSelected: SaleInterface | null;
  onSelectSales?: (sales: SaleInterface[]) => void;
}
export const SaleSearch: FC<SaleSearchProps> = ({
  saleSelected,
  onSelectSales = () => {},
}) => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState(SearchMode.SALE);
  const { tables, sales } = useContext(ReservationsContext);

  const handleModeChange = () => {
    if (mode === SearchMode.TABLE) setMode(SearchMode.SALE);
    else setMode(SearchMode.TABLE);
  };

  const filteredTables = useMemo(() => {
    return tables.filter((table) =>
      search ? table.name.toLowerCase().includes(search.toLowerCase()) : true
    );
  }, [search, tables]);

  const tablesWithSales = useMemo(() => {
    return filteredTables.filter((table) =>
      sales.some((sale) => sale.tables.some((t) => t.id === table.id))
    );
  }, [filteredTables, sales]);

  const tablesWithoutSales = useMemo(() => {
    return filteredTables.filter(
      (table) => !sales.some((sale) => sale.tables.some((t) => t.id === table.id))
    );
  }, [filteredTables, sales]);

  const filteredSales = useMemo(() => {
    const tokens = search.toLowerCase().split(" ");

    return sales.filter(
      (sale) =>
        !search ||
        tokens.every(
          (token) =>
            sale.sale.id.toString().includes(token) ||
            sale.client?.name.toLowerCase().includes(token) ||
            sale.client?.email.toLowerCase().includes(token) ||
            sale.client?.surname.toLowerCase().includes(token) ||
            sale.client?.phoneNumber.toLowerCase().includes(token) ||
            sale.client?.identityDocument.toLowerCase().includes(token) ||
            sale.guest?.name.toLowerCase().includes(token) ||
            sale.guest?.email.toLowerCase().includes(token) ||
            sale.guest?.surname.toLowerCase().includes(token) ||
            sale.guest?.phoneNumber.toLowerCase().includes(token) ||
            sale.guest?.identityDocument.toLowerCase().includes(token)
        )
    );
  }, [search, sales]);

  useEffect(() => {
    const saleList = document.getElementById("sales");
    const sale = document.getElementById(`sale-${saleSelected?.sale.id}`);

    if (!saleList || !sale) return;

    const position = sale.offsetTop - saleList.offsetTop - 10;
    saleList.scrollTop = position;
  }, [saleSelected]);

  useEffect(() => {
    if (!sales.some((sale) => sale.sale.id === saleSelected?.sale.id)) {
      onSelectSales([]);
    }
  }, [sales, saleSelected, onSelectSales]);

  return (
    <div className="flex flex-col gap-6 border-2 border-gray-300 rounded-lg p-4 min-h-[45rem] max-h-full">
      {/* Input text search */}
      <div className="flex items-center gap-4">
        <FormText
          label=""
          id="sale-search"
          name="sale-search"
          autoComplete="off"
          value={search}
          containerClassName="flex-1"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={mode === SearchMode.TABLE ? "Buscar mesa..." : "Buscar venta..."}
        />

        <div
          className="flex items-center group cursor-pointer gap-2"
          title={mode === SearchMode.TABLE ? "Buscar venta" : "Buscar mesa"}
          data-te-toggle="tooltip"
          onClick={handleModeChange}
        >
          <ArrowsRightLeftIcon className="w-7 h-7 text-gray-500 group-hover:text-gray-800" />

          {mode === SearchMode.SALE && (
            <Icon
              icon={tableRestaurantRounded}
              className="w-7 h-7 text-gray-500 group-hover:text-gray-800"
            />
          )}

          {mode === SearchMode.TABLE && (
            <Icon
              icon={fileDocumentCheckOutline}
              className="w-7 h-7 text-gray-500 group-hover:text-gray-800"
            />
          )}
        </div>
      </div>

      {/* Tables */}
      <div
        className={classNames(
          mode !== SearchMode.TABLE && "hidden",
          "flex flex-col pr-2 pt-2 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full sm:flex-row flex-wrap gap-2 sm:gap-6 sm:justify-evenly mb-6"
        )}
      >
        {tablesWithSales.map((table) => (
          <div
            key={table.id}
            onClick={() => {
              setMode(SearchMode.SALE);
              onSelectSales(
                sales.filter((sale) => sale.tables.some((t) => t.id === table.id))
              );
            }}
            className="flex flex-col items-center justify-center flex-1 sm:min-w-[9rem] sm:max-w-[13rem] h-24 bg-orange-700 shadow rounded-lg cursor-pointer hover:shadow-2xl hover:bg-orange-600 transition"
          >
            <p className="text-white font-bold text-3xl">{table.name}</p>
          </div>
        ))}

        {tablesWithoutSales.map((table) => (
          <div
            key={table.id}
            className="flex flex-col items-center justify-center flex-1 sm:min-w-[9rem] sm:max-w-[13rem] h-24 bg-gray-400 shadow rounded-lg"
          >
            <p className="text-white font-bold text-3xl">{table.name}</p>
          </div>
        ))}

        {tablesWithSales.length === 0 && tablesWithoutSales.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1">
            <img
              src={tableNotFound}
              alt="Table not found"
              className="w-[15rem] h-[15rem] object-cover opacity-[0.5]"
            />
            <p className="text-xl text-center font-light text-gray-700">
              No se encontraron mesas
            </p>
          </div>
        )}
      </div>

      {/* Sales */}
      <div
        id="sales"
        className={classNames(
          mode !== SearchMode.SALE && "hidden",
          "flex flex-col pr-2 pt-2 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full gap-2 sm:gap-6 scroll-smooth"
        )}
      >
        {filteredSales.map((sale) => (
          <SaleCard
            sale={sale}
            key={sale.sale.id}
            id={`sale-${sale.sale.id}`}
            selected={sale.sale.id === saleSelected?.sale.id}
            onSelectSale={() => onSelectSales([sale])}
            onSelectTable={(table) =>
              onSelectSales(sales.filter((s) => s.tables.some((t) => t.id === table.id)))
            }
          />
        ))}

        {filteredSales.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1">
            <img
              src={saleNotFound}
              alt="Table not found"
              className="w-[15rem] h-[15rem] object-cover opacity-[0.5]"
            />
            <p className="text-xl text-center font-light text-gray-700">
              No se encontraron ventas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
