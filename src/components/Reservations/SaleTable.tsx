import { FC, useMemo, useState } from "react";
import classNames from "classnames";
import { SaleModal } from "./SaleModal";
import { SaleInterface } from "@objects";
import { formatSaleStatus, saleStatusColor } from "@utils";

interface SaleTableElementProps {
  index: number;
  hideStatus?: boolean;
  data: SaleInterface;
}
const SaleTableElement: FC<SaleTableElementProps> = ({ data, index, hideStatus }) => {
  const [openModal, setOpenModal] = useState(false);

  const rowData = useMemo(() => {
    let weekDay = new Date(data.sale.startTime).toLocaleDateString("es-ES", {
      weekday: "long",
    });
    weekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    const date = new Date(data.sale.startTime).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const hour = new Date(data.sale.startTime).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const endHour = new Date(data.sale.endTime).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const duration = `${hour} - ${endHour}`
      .replace(new RegExp("a. m.", "g"), "AM")
      .replace(new RegExp("p. m.", "g"), "PM");
    const owner = data.client ?? data.guest;
    const name = `${owner?.name} ${owner?.surname}`;
    const phone = owner?.phoneNumber;

    return { weekDay, date, duration, name, phone };
  }, [data]);

  const total = useMemo(() => {
    const subTotal = data.products.reduce(
      (acc, curr) => acc + curr.amount * curr.price,
      0
    );

    return (
      subTotal +
      data.taxes.reduce(
        (acc, curr) =>
          acc + (curr.isPercentage ? (subTotal * curr.value) / 100 : curr.value),
        0
      )
    );
  }, [data.products, data.taxes]);

  const color = useMemo(() => {
    return saleStatusColor(data.sale.status);
  }, [data.sale.status]);

  return (
    <tr
      onClick={() => setOpenModal(true)}
      className={classNames(
        "hover:bg-gray-100 cursor-pointer text-sm",
        index % 2 === 0 && "bg-gray-50"
      )}
    >
      <td className="px-4 py-4 font-semibold text-gray-500">
        <p className="text-gray-700">{rowData.weekDay}</p>
        <p className="truncate">{rowData.date}</p>
        <p className="font-normal truncate">{rowData.duration}</p>
      </td>

      <td className="px-4 py-4 font-semibold text-gray-500">
        <p className="text-gray-700 truncate">{rowData.name}</p>
        <p className="truncate">{rowData.phone}</p>
      </td>

      <td className="px-4 py-4 font-semibold text-gray-500 text-base text-center">
        {data.sale.clientQuantity}
      </td>

      <td className="px-4 py-4 font-semibold text-gray-500 text-base text-center">
        {data.tables.length}
      </td>

      <td className="px-4 py-4 font-semibold text-gray-500 text-base text-center">
        {data.products.reduce((acc, curr) => acc + curr.amount, 0)}
      </td>

      <td className="text-base text-right px-4 py-4 font-semibold text-gray-700">
        ${total.toFixed(2)}
      </td>

      {!hideStatus && (
        <td className={`italic text-${color} text-right px-4 py-4 font-bold`}>
          {formatSaleStatus(data.sale.status).toUpperCase()}
        </td>
      )}

      <td onClick={(e) => e.stopPropagation()}>
        <SaleModal sale={data} open={openModal} setOpen={setOpenModal} />
      </td>
    </tr>
  );
};

export interface SaleTableProps {
  sales: SaleInterface[];
  hideStatus?: boolean;
}
export const SaleTable: FC<SaleTableProps> = ({ sales, hideStatus }) => {
  return (
    <div className="flex w-full flex-col bg-white rounded-lg border px-8 pb-6 pt-4">
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="text-sm font-semibold text-gray-800">
              <th className="text-left px-4 py-2">FECHA</th>

              <th className="text-left px-4 py-2">CLIENTE</th>

              <th className="truncate text-center px-4 py-2">Nº PERSONAS</th>

              <th className="truncate text-center px-4 py-2">Nº MESAS</th>

              <th className="truncate text-center px-4 py-2">Nº PRODUCTOS</th>

              <th className="text-right px-4 py-2">TOTAL</th>

              {!hideStatus && <th className="text-right px-4 py-2">ESTADO</th>}
            </tr>
          </thead>
          <tbody>
            {sales.map((data, index) => (
              <SaleTableElement
                data={data}
                index={index}
                hideStatus={hideStatus}
                key={data.sale.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
