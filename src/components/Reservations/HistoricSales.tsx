import { FC, useContext, useMemo, useState } from "react";
import moment from "moment";
import classNames from "classnames";
import { SaleTable } from "./SaleTable";
import { Popover } from "../Atoms/Popover";
import { FormText } from "../FormInputs/FormText";
import { Button, Chip } from "@material-tailwind/react";
import { FormDatePicker } from "../FormInputs/FormDatePicker";
import { ReservationsContext, formatSaleStatus } from "@utils";
import { LinkText, PrimaryButton } from "../FormInputs/Buttons";
import { PaginationFooter } from "../Molecules/PaginationFooter";
import { FormMultiCheckBox } from "../FormInputs/FormMultiCheckbox";
import { HISTORIC_SALE_STATUS, SaleInterface, SaleStatus } from "@objects";
import reservationNotFound from "../../assets/images/reservation-not-found.png";

interface HistoricSalesProps {
  sales: SaleInterface[];
  startTime?: Date;
  endTime?: Date;
  fullname: string;
  identityDocument: string;
  status: SaleStatus[];
  page: number;
  totalItems: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setStartTime: (startTime?: Date) => void;
  setEndTime: (endTime?: Date) => void;
  setFullname: (fullname: string) => void;
  setIdentityDocument: (identityDocument: string) => void;
  setStatus: (status: SaleStatus[]) => void;
}
export const HistoricSales: FC<HistoricSalesProps> = ({
  sales,
  startTime,
  endTime,
  fullname,
  identityDocument,
  status,
  page,
  totalItems,
  itemsPerPage,
  setPage,
  setStartTime,
  setEndTime,
  setFullname,
  setIdentityDocument,
  setStatus,
}) => {
  const { onRefresh } = useContext(ReservationsContext);
  const [open, setOpen] = useState(false);

  const statusOptions = useMemo(() => {
    return HISTORIC_SALE_STATUS.map((s) => ({
      value: s,
      id: s.toString(),
      label: formatSaleStatus(s),
      checked: status.includes(s),
    }));
  }, [status]);

  const popoverButton = useMemo(() => {
    return (
      <Button
        variant="text"
        className="flex w-full sm:w-auto justify-center py-2 px-4 items-center text-gray-700"
      >
        Estados{" "}
        <Chip
          value={status.length}
          size="sm"
          variant="ghost"
          color="blue-gray"
          className={classNames(
            "ml-1 rounded-lg transition-all !opacity-75 group-hover:!opacity-100"
          )}
        />
      </Button>
    );
  }, [status]);

  return (
    <div className="flex flex-1 w-full flex-col">
      {/* Filters */}
      <div className="flex flex-1 flex-col lg:flex-row w-full gap-4 items-end">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <FormText
            label=""
            id="fullname"
            name="fullname"
            autoComplete="off"
            value={fullname}
            placeholder="Buscar por nombre..."
            containerClassName="flex-[2]"
            onChange={(e) => setFullname(e.target.value)}
          />

          <FormText
            label=""
            id="identityDocument"
            name="identityDocument"
            autoComplete="off"
            value={identityDocument}
            placeholder="Buscar por cédula de identidad..."
            containerClassName="flex-[2]"
            onChange={(e) => setIdentityDocument(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full items-center gap-4 justify-between">
          <FormDatePicker
            label=""
            id="reservationDateIn"
            name="reservationDateIn"
            useRange={false}
            maxDate={endTime}
            value={{
              startDate: startTime ?? null,
              endDate: startTime ?? null,
            }}
            placeholder="Desde"
            toggleClassName={(oldClassName) =>
              classNames(oldClassName, "text-orange-700")
            }
            onChange={(e) =>
              setStartTime(e?.startDate ? moment(e?.startDate).toDate() : undefined)
            }
            configs={{
              shortcuts: {
                today: "Hoy",
                yesterday: "Ayer",
                currentMonth: "Mes actual",
                pastMonth: "Mes anterior",
                past: (period: number) => `Hace ${period} días`,
              },
            }}
            containerClassName="flex-1 w-full md:w-32 md:flex-0"
          />

          <FormDatePicker
            label=""
            id="reservationDateOut"
            name="reservationDateOut"
            useRange={false}
            minDate={startTime}
            value={{
              startDate: endTime ?? null,
              endDate: endTime ?? null,
            }}
            placeholder="Hasta"
            toggleClassName={(oldClassName) =>
              classNames(oldClassName, "text-orange-700")
            }
            onChange={(e) =>
              setEndTime(e?.startDate ? moment(e?.startDate).toDate() : undefined)
            }
            configs={{
              shortcuts: {
                today: "Hoy",
                yesterday: "Ayer",
                currentMonth: "Mes actual",
                pastMonth: "Mes anterior",
                past: (period: number) => `Hace ${period} días`,
              },
            }}
            containerClassName="flex-1 w-full md:w-32 md:flex-0"
          />

          <Popover open={open} setOpen={setOpen} handler={popoverButton}>
            <FormMultiCheckBox
              items={statusOptions}
              onChange={(values) =>
                setStatus(values.filter((v) => v.checked).map((v) => v.value))
              }
            />

            <hr />

            <div className="flex justify-center">
              <LinkText
                text="Limpiar"
                onClick={() => setStatus([])}
                className="mt-3 text-base"
              />
            </div>
          </Popover>
        </div>

        <PrimaryButton onClick={onRefresh} className="w-full md:w-32">
          Buscar
        </PrimaryButton>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 w-full mt-4">
        {sales.length > 0 && (
          <>
            <SaleTable sales={sales} />

            <PaginationFooter
              currentPage={page}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </>
        )}

        {sales.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1">
            <img
              src={reservationNotFound}
              alt="Reservations not found"
              className="w-[17rem] h-[17rem] object-cover opacity-[0.5]"
            />
            <p className="text-xl text-center font-light text-gray-700">
              Parece que no hay reservas que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
