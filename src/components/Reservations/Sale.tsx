import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useFetch } from "@hooks";
import { SaleTax } from "./SaleTax";
import { FormikHelpers } from "formik";
import { Modal } from "../Atoms/Modal";
import { ReservationsContext } from "@utils";
import { SaleProductTable } from "./SaleProductTable";
import { IconButton } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FormTextArea } from "../FormInputs/FormTextArea";
import { TaxForm, TaxFormValues } from "../Profile/TaxForm";
import { LinkText, PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import { alertService, closeReservation, createSaleTax, updateSale } from "@services";
import {
  SaleInterface,
  SaleDataInterface,
  ReservationInfoInterface,
  SaleStatus,
} from "@objects";

interface SaleProps {
  sale: SaleInterface;
  reservations: ReservationInfoInterface[];
}
export const Sale: FC<SaleProps> = ({ sale, reservations }) => {
  const fetch = useFetch();
  const { setSales, onRefresh } = useContext(ReservationsContext);

  const [note, setNote] = useState(sale.sale.note);
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [openStartModal, setOpenStartModal] = useState(false);

  const owner = useMemo(() => {
    return sale.client ?? sale.guest;
  }, [sale]);

  const saleReservation = useMemo(() => {
    return reservations.find((r) => r.reservation.id === sale.reservationId);
  }, [reservations, sale.reservationId]);

  const subTotal = useMemo(() => {
    return sale.products.reduce((prev, curr) => {
      return prev + curr.price * curr.amount;
    }, 0);
  }, [sale.products]);

  const total = useMemo(() => {
    return sale.taxes.reduce((prev, curr) => {
      return prev + (curr.isPercentage ? (subTotal * curr.value) / 100 : curr.value);
    }, subTotal);
  }, [sale.taxes, subTotal]);

  const handleUpdate = async (sale: SaleDataInterface) => {
    return await fetch((token: string) => updateSale(sale, token)).then((response) => {
      if (response.isError) {
        alertService.error(
          "Error al actualizar la venta",
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
        );
        return;
      }

      setSales((prev) => {
        const index = prev.findIndex((s) => s.sale.id === sale.id);
        const newSales = [...prev];
        newSales[index].sale = sale;

        return newSales;
      });
    });
  };

  const handleNoteChange = async () => {
    const newSale = {
      ...sale.sale,
      note,
    };

    await handleUpdate(newSale);
  };

  const handleTaxCreation = async (
    values: TaxFormValues,
    formik: FormikHelpers<TaxFormValues>
  ) => {
    const dto = {
      saleId: sale.sale.id,
      tax: {
        id: 0,
        name: values.name,
        value: +values.value,
        isPercentage: values.type === "Porcentaje",
      },
    };
    return await fetch((token: string) => createSaleTax(dto, token)).then((response) => {
      const { data } = response;
      if (response.isError || !data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      setSales((prev) => {
        const saleIndex = prev.findIndex((s) => s.sale.id === sale.sale.id);
        const newSales = [...prev];
        const newTaxes = [...newSales[saleIndex].taxes];
        newTaxes.push(data);
        newSales[saleIndex].taxes = newTaxes;

        return newSales;
      });
      setOpenTaxModal(false);
    });
  };

  const handleClose = async () => {
    const reservationId = sale.reservationId;

    if (reservationId) {
      await fetch((token: string) => closeReservation(reservationId, token)).then(
        (response) => {
          if (response.isError) {
            alertService.error(
              "Error al cerrar la reserva",
              response.error?.message ?? response.exception?.message,
              { autoClose: false }
            );
            return;
          }
        }
      );
    }

    const dto = {
      ...sale.sale,
      status: SaleStatus.CLOSED,
    };
    await fetch((token: string) => updateSale(dto, token)).then((response) => {
      if (response.isError) {
        alertService.error(
          "Error al finalizar la venta",
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
        );
        return;
      }

      onRefresh();
      setOpenStartModal(false);
    });
  };

  useEffect(() => {
    setNote(sale.sale.note);
  }, [sale.sale]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-6">
        {/* Owner */}
        <div className="flex-1">
          <p className="font-light text-xl mb-1">Cliente:</p>

          <p className="leading-tight text-gray-800 font-medium text-lg">
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

          {/* Reservation */}
          <div className="flex flex-1 flex-col gap-1">
            {saleReservation && (
              <p className="font-light text-lg">
                Ver <LinkText text="Reserva" /> asociada
              </p>
            )}

            {!saleReservation && (
              <p className="font-light text-lg">No tiene reserva asociada</p>
            )}
          </div>
        </div>

        {/* Tables */}
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-light text-xl">Mesas:</p>

          <div className="flex flex-wrap gap-2 max-h-[10rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            {sale.tables
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((table) => {
                return (
                  <div
                    key={table.id}
                    className="flex flex-col flex-1 items-center justify-center bg-orange-700 shadow rounded hover:shadow-lg hover:bg-orange-600 transition py-2 min-w-[5rem] max-w-[5rem]"
                  >
                    <p className="text-white font-bold text-xs">{table.name}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <SaleProductTable saleId={sale.sale.id} saleProducts={sale.products} />

      <div className="flex w-full gap-12">
        {/* Note */}
        <div className="flex flex-col flex-1 gap-1">
          <FormTextArea
            id="note"
            name="note"
            label="Nota"
            value={note}
            className="h-40 resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
            labelClassName="!font-light text-xl mb-1"
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="flex w-full justify-end">
            <PrimaryButton
              className="!px-2 !py-1"
              disabled={sale.sale.note === note}
              onClick={handleNoteChange}
            >
              Guardar
            </PrimaryButton>
          </div>
        </div>

        {/* Totals */}
        <div className="flex-1 flex-col">
          <div className="flex flex-col gap-1 px-8">
            <div className="flex justify-between">
              <p className="font-light text-lg">Subtotal:</p>
              <p className="font-light text-lg">${subTotal.toFixed(2)}</p>
            </div>

            <hr className="border-gray-300 my-2" />

            <div className="flex flex-col gap-2">
              {sale.taxes.map((tax) => (
                <SaleTax
                  key={tax.id}
                  saleId={sale.sale.id}
                  tax={tax}
                  subTotal={subTotal}
                />
              ))}

              <div className="flex w-full justify-end">
                <IconButton
                  color="orange"
                  size="md"
                  variant="outlined"
                  title="Añadir tarifa"
                  data-te-toggle="tooltip"
                  onClick={() => setOpenTaxModal(true)}
                  className="rounded-full border-2"
                >
                  <PlusIcon className="w-5 h-5" />
                </IconButton>
              </div>
            </div>

            <hr className="border-gray-300 my-2" />

            <div className="flex flex-col items-end">
              <p className="font-light text-xl">Total:</p>
              <p className="font-light text-2xl font-medium text-gray-800">
                ${total.toFixed(2)}
              </p>
            </div>

            <div className="flex w-full justify-end mt-6">
              <PrimaryButton className="w-40" onClick={() => setOpenStartModal(true)}>
                Cerrar Mesa
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openTaxModal}
        setOpen={setOpenTaxModal}
        className="w-full m-8 max-w-[30rem]"
      >
        <p className="text-2xl font-light mb-4">Crear Tarifa</p>

        <TaxForm onSubmit={handleTaxCreation} onCancel={() => setOpenTaxModal(false)} />
      </Modal>

      <Modal
        open={openStartModal}
        setOpen={setOpenStartModal}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <p className="text-xl font-light mb-4">Cerrar venta</p>

        <p className="mb-4">¿Estás seguro que deseas finalizar la venta?</p>

        <hr className="my-2" />

        {sale.products.map((product) => {
          return (
            <div className="flex justify-between" key={product.id}>
              <p className="font-light">
                ({product.amount}) {product.name}
              </p>
              <p className="font-light">${(product.price * product.amount).toFixed(2)}</p>
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

        <hr className="my-2" />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenStartModal(false)}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton onClick={handleClose} type="submit" className="w-full sm:w-40">
            Finalizar
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
