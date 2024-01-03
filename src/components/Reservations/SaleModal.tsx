import { FC, useMemo } from "react";
import { Modal } from "../Atoms/Modal";
import { SaleInterface } from "@objects";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { saleStatusColor, formatSaleStatus } from "@utils";

interface SaleModalProps {
  sale: SaleInterface;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const SaleModal: FC<SaleModalProps> = ({ sale, open, setOpen }) => {
  const owner = useMemo(() => {
    return sale.client ?? sale.guest;
  }, [sale]);

  const saleDate = useMemo(() => {
    let weekDay = new Date(sale.sale.startTime).toLocaleDateString("es-ES", {
      weekday: "long",
    });
    weekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    const date = new Date(sale.sale.startTime).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const hour = new Date(sale.sale.startTime).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const endHour = new Date(sale.sale.endTime).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const duration = `${hour} - ${endHour}`
      .replace(new RegExp("a. m.", "g"), "AM")
      .replace(new RegExp("p. m.", "g"), "PM");

    return { weekDay, date, duration };
  }, [sale]);

  const color = useMemo(() => {
    return saleStatusColor(sale.sale.status);
  }, [sale]);

  const subTotal = useMemo(() => {
    return sale.products.reduce((acc, curr) => acc + curr.amount * curr.price, 0);
  }, [sale.products]);

  const total = useMemo(() => {
    return (
      subTotal +
      sale.taxes.reduce(
        (acc, curr) =>
          acc + (curr.isPercentage ? (subTotal * curr.value) / 100 : curr.value),
        0
      )
    );
  }, [subTotal, sale.taxes]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-full !m-2 md:!m-8 max-w-[50rem]">
      {/* Header */}
      <div className="flex w-full justify-between gap-4 items-start">
        <p className="text-2xl font-light">
          Venta{" "}
          <span className="font-medium text-gray-800 italic ml-1">{sale.sale.id}</span>
        </p>

        <div>
          <button
            type="button"
            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-700"
            onClick={() => setOpen(false)}
          >
            <span className="absolute -inset-2.5" />
            <span className="sr-only">Close panel</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <hr className="w-full my-5" />

      {/* Body */}
      <div className="flex flex-col w-full text-lg">
        {/* Status */}
        <div className="flex flex-col sm:flex-row w-full sm:gap-6 mb-4 leading-tight">
          <p className="sm:flex-1 font-light sm:text-right">Estado</p>
          <p className={`sm:flex-[2] font-bold text-${color}`}>
            {formatSaleStatus(sale.sale.status)}
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col sm:flex-row w-full sm:gap-6 leading-tight mb-4">
          <p className="flex-1 font-light sm:text-right">Fecha</p>
          <div className="flex-[2] font-normal text-base">
            <p className="leading-tight text-gray-800 font-medium">{saleDate.weekDay}</p>
            <p className="leading-tight">{saleDate.date}</p>
            <p className="leading-tight">{saleDate.duration}</p>
          </div>
        </div>

        {/* Owner */}
        <div className="flex flex-col sm:flex-row w-full sm:gap-6 leading-tight mb-4">
          <p className="flex-1 font-light sm:text-right">Cliente</p>
          <div className="flex-[2] font-normal text-base">
            <p className="leading-tight text-gray-800 font-medium">
              {owner?.name} {owner?.surname}{" "}
              <span className="italic font-light ml-2">
                {sale.guest ? "(No Registrado)" : "(Registrado)"}
              </span>
            </p>
            <p className="leading-tight">{owner?.email}</p>
            <p className="leading-tight">{owner?.phoneNumber}</p>
            <p className="leading-tight">{owner?.identityDocument}</p>
            {sale.client?.address && (
              <p className="leading-tight text-sm">{sale.client.address}</p>
            )}
          </div>
        </div>

        {/* Number of clients */}
        <div className="flex w-full gap-2 sm:gap-6 leading-tight">
          <p className="sm:flex-1 w-32 sm:w-auto font-light sm:text-right">
            Nº de Clientes
          </p>
          <p className="sm:flex-[2] font-normal">{sale.sale.clientQuantity}</p>
        </div>

        {/* Number of tables */}
        <div className="flex w-full gap-2 sm:gap-6 leading-tight">
          <p className="sm:flex-1 w-32 sm:w-auto font-light sm:text-right">Nº de Mesas</p>
          <p className="sm:flex-[2] font-normal">{sale.tables.length}</p>
        </div>

        {/* Number of products */}
        <div className="flex w-full gap-2 sm:gap-6 leading-tight">
          <p className="sm:flex-1 w-32 sm:w-auto font-light sm:text-right">
            Nº de Productos
          </p>
          <p className="sm:flex-[2] font-normal">
            {sale.products.reduce((acc, curr) => acc + curr.amount, 0)}
          </p>
        </div>

        {/* Occasion */}
        <div className="flex flex-col sm:flex-row w-full sm:gap-6 leading-tight mt-2">
          <p className="flex-1 font-light sm:text-right">Nota</p>
          <p className="flex-[2] font-normal text-sm">{sale.sale.note}</p>
        </div>

        <hr className="w-full my-5" />

        <div className="flex w-full justify-end text-base mb-8">
          <div className="flex flex-col justify-between w-full max-w-[25rem]">
            {sale.products.map((product) => {
              return (
                <div className="flex justify-between" key={product.id}>
                  <p className="font-light">
                    ({product.amount}) {product.name}
                  </p>
                  <p className="font-light">
                    ${(product.price * product.amount).toFixed(2)}
                  </p>
                </div>
              );
            })}

            {sale.taxes.map((tax) => {
              return (
                <div className="flex justify-between" key={tax.id}>
                  <p className="font-light">
                    {tax.name} {tax.isPercentage ? `(${tax.value}%)` : ""}
                  </p>
                  <p className="font-light">
                    $
                    {tax.isPercentage
                      ? `${(subTotal * (tax.value / 100)).toFixed(2)}`
                      : `${tax.value.toFixed(2)}`}
                  </p>
                </div>
              );
            })}

            <div className="flex flex-col items-end mt-2">
              <p className="font-light text-xl">Total:</p>
              <p className="font-light text-2xl font-medium text-gray-800">
                ${total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
