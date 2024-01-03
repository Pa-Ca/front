import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { Sale } from "./Sale";
import { useFetch } from "@hooks";
import classNames from "classnames";
import { Modal } from "../Atoms/Modal";
import { FormikHelpers } from "formik";
import { createSale } from "@services";
import { SaleSearch } from "./SaleSearch";
import { ReservationsContext } from "@utils";
import { useAppSelector } from "src/store/hooks";
import { FormSelect } from "../FormInputs/FormSelect";
import { PrimaryButton } from "../FormInputs/Buttons";
import { SaleForm, SaleFormValues } from "./SaleForm";
import saleNotFound from "../../assets/images/sale-not-found2.png";
import { SaleStatus, SaleInterface, ReservationInfoInterface } from "@objects";

interface OngoingSalesProps {
  reservations: ReservationInfoInterface[];
}
export const OngoingSales: FC<OngoingSalesProps> = ({ reservations }) => {
  const fetch = useFetch();
  const { tables, setSales } = useContext(ReservationsContext);
  const branch = useAppSelector((state) => state.branches.selected);

  const saleSearchRef = useRef<HTMLDivElement>(null);
  const saleSelectedRef = useRef<HTMLDivElement>(null);
  const [sale, setSale] = useState<SaleInterface | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedSales, setSelectedSales] = useState<SaleInterface[]>([]);

  const saleSelected = useMemo(() => {
    const owner = sale?.client ?? sale?.guest;

    return {
      value: sale,
      id: sale?.sale.id.toString() ?? "",
      name:
        owner?.name && owner?.surname
          ? `${owner.name} ${owner.surname}`
          : "Seleccionar venta",
    };
  }, [sale]);

  const handleCreation = async (
    values: SaleFormValues,
    formik: FormikHelpers<SaleFormValues>
  ) => {
    if (!branch) {
      return;
    }

    const sale: SaleInterface = {
      sale: {
        id: 0,
        invoiceId: 0,
        clientGuestId: 0,
        branchId: branch.id,
        clientQuantity: +values.clientQuantity,
        status: SaleStatus.ONGOING,
        startTime: new Date().toISOString(),
        endTime: "",
        dollarExchange: 1,
        note: values.note,
      },
      insite: true,
      guest: {
        id: 0,
        name: values.guestName,
        surname: values.guestSurname,
        email: values.guestEmail,
        phoneNumber: values.guestPhoneNumber,
        identityDocument: values.guestIdentityDocument,
      },
      taxes: branch.defaultTaxes,
      tables: values.tables,
      products: [],
    };

    fetch((token: string) => createSale(sale, token)).then((response) => {
      const { data } = response;
      if (response.isError || !data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      setSales((sales) => {
        const newSales = [...sales, data];
        newSales.sort((a, b) => moment(a.sale.startTime).diff(moment(b.sale.startTime)));
        return newSales;
      });
      setOpenCreateModal(false);
    });
  };

  useEffect(() => {
    const updateHeight = () => {
      if (saleSearchRef.current && saleSelectedRef.current) {
        saleSearchRef.current.style.maxHeight = `max(45rem, ${saleSelectedRef.current.clientHeight}px)`;
      }
    };

    if (saleSelectedRef.current) {
      new ResizeObserver(updateHeight).observe(saleSelectedRef.current as Element);
    }
  }, [saleSelectedRef.current?.clientHeight]);

  useEffect(() => {
    if (selectedSales.length === 0) setSale(null);
    else setSale(selectedSales[0]);
  }, [selectedSales]);

  return (
    <div className="flex gap-8 mb-12">
      <div className="w-[17rem] xl:w-[23rem]" ref={saleSearchRef}>
        <SaleSearch saleSelected={sale} onSelectSales={setSelectedSales} />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div ref={saleSelectedRef}>
          <div className="flex w-full items-center gap-4 justify-end mb-4">
            <FormSelect
              label=""
              id="select-sales"
              name="select-sales"
              selected={saleSelected}
              options={selectedSales.map((sale) => {
                const owner = sale?.client ?? sale?.guest;
                return {
                  value: sale,
                  id: sale.sale.id.toString(),
                  name: `${owner?.name} ${owner?.surname}`,
                  description: new Date(sale.sale.startTime).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }),
                };
              })}
              onChange={(sale) => setSale(sale)}
              containerClassName={classNames(selectedSales.length === 0 && "hidden")}
            />

            <PrimaryButton className="w-32" onClick={() => setOpenCreateModal(true)}>
              Crear Venta
            </PrimaryButton>
          </div>

          {sale && <Sale sale={sale} reservations={reservations} />}

          {!sale && (
            <div className="flex flex-col items-center flex-1">
              <img
                src={saleNotFound}
                alt="Sale not found"
                className="w-[20rem] h-[20rem] object-cover opacity-[0.5]"
              />
              <p className="text-xl text-center font-light text-gray-700 max-w-[40rem]">
                Parece que no has seleccionado ninguna venta. Prueba clickeando una venta
                en la lista de la izquierda o creando una nueva.
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        className="w-full max-w-[55rem] m-8"
        open={openCreateModal}
        setOpen={setOpenCreateModal}
      >
        <p className="text-2xl font-light mb-4">Crear Reserva</p>

        <SaleForm
          tables={tables}
          onSubmit={handleCreation}
          onCancel={() => setOpenCreateModal(false)}
        />
      </Modal>
    </div>
  );
};
