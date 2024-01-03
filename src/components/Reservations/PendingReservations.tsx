import { FC, useContext, useMemo, useState } from "react";
import moment from "moment";
import { useFetch } from "@hooks";
import { Modal } from "../Atoms/Modal";
import { FormikHelpers } from "formik";
import { ReservationsContext } from "@utils";
import { createReservation } from "@services";
import { useAppSelector } from "src/store/hooks";
import { FormText } from "../FormInputs/FormText";
import { PrimaryButton } from "../FormInputs/Buttons";
import { ReservationTable } from "./ReservationTable";
import { PaginationFooter } from "../Molecules/PaginationFooter";
import { ReservationForm, ReservationFormValues } from "./ReservationForm";
import reservationNotFound from "../../assets/images/reservation-not-found.png";
import {
  ReservationStatus,
  ReservationInfoInterface,
  ReservationExtendedInterface,
} from "@objects";

const RESERVATIONS_PER_PAGE = 15;

interface PendingReservationsProps {
  reservations: ReservationInfoInterface[];
}
export const PendingReservations: FC<PendingReservationsProps> = ({ reservations }) => {
  const fetch = useFetch();
  const { onRefresh } = useContext(ReservationsContext);
  const branch = useAppSelector((state) => state.branches.selected);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const filteredReservations = useMemo(() => {
    setPage(0);
    const tokens = search.toLowerCase().split(" ");

    return reservations
      .filter((r) => {
        const dateIn = new Date(r.reservation.reservationDateIn).toLocaleDateString(
          "es-ES",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        const dateOut = new Date(r.reservation.reservationDateOut).toLocaleDateString(
          "es-ES",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        return tokens.every(
          (token) =>
            r.reservation.occasion.toLowerCase().includes(token) ||
            dateIn.toLowerCase().includes(token) ||
            dateOut.toLowerCase().includes(token) ||
            r.client?.name.toLowerCase().includes(token) ||
            r.client?.surname.toLowerCase().includes(token) ||
            r.client?.phoneNumber.toLowerCase().includes(token) ||
            r.guest?.name.toLowerCase().includes(token) ||
            r.guest?.surname.toLowerCase().includes(token) ||
            r.guest?.phoneNumber.toLowerCase().includes(token)
        );
      })
      .sort((a, b) => {
        let result = a.reservation.reservationDateIn.localeCompare(
          b.reservation.reservationDateIn
        );
        if (result === 0) {
          result = a.reservation.reservationDateOut.localeCompare(
            b.reservation.reservationDateOut
          );
        }
        if (result === 0) {
          result = a.reservation.requestDate.localeCompare(b.reservation.requestDate);
        }

        return result;
      });
  }, [reservations, search]);

  const paginatedReservations = useMemo(() => {
    const start = page * RESERVATIONS_PER_PAGE;
    const end = start + RESERVATIONS_PER_PAGE;

    return filteredReservations.slice(start, end);
  }, [page, filteredReservations]);

  const handleCreation = async (
    values: ReservationFormValues,
    formik: FormikHelpers<ReservationFormValues>
  ) => {
    if (!branch) {
      return;
    }

    // Convert local time and duration to moment objects
    const hourInMoment = moment(values.reservationHourIn, "HH:mm:ss");
    const durationMoment = moment.duration(values.reservationDuration.slice(2));

    // Create the check-in timestamp by combining the reservation date and check-in time
    const reservationDateIn = moment(values.reservationDateIn);
    reservationDateIn.set({
      hour: hourInMoment.get("hour"),
      minute: hourInMoment.get("minute"),
      second: hourInMoment.get("second"),
    });

    // Create the output timestamp by adding the duration to the input date
    const reservationDateOut = moment(reservationDateIn).add(durationMoment);

    const reservation: ReservationExtendedInterface = {
      id: 0,
      guestId: -1,
      invoiceId: -1,
      branchId: branch.id,
      requestDate: new Date().toISOString(),
      reservationDateIn: reservationDateIn.toISOString(),
      reservationDateOut: reservationDateOut.toISOString(),
      price: branch.reservationPrice,
      status: ReservationStatus.PENDING,
      tableNumber: +values.tableNumber,
      clientNumber: +values.clientNumber,
      occasion: values.occasion,
      byClient: false,
      haveGuest: true,
      name: values.guestName,
      surname: values.guestSurname,
      email: values.guestEmail,
      phoneNumber: values.guestPhoneNumber,
      identityDocument: values.guestIdentityDocument,
    };

    fetch((token: string) => createReservation(reservation, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      onRefresh();
      setOpenCreateModal(false);
    });
  };

  return (
    <div className="flex flex-1 w-full flex-col">
      {/* Filters */}
      <div className="flex flex-col-reverse sm:flex-row w-full gap-2 sm:gap-4">
        <FormText
          label=""
          id="pending-search"
          name="pending-search"
          autoComplete="off"
          value={search}
          placeholder="Buscar reserva pendiente..."
          containerClassName="flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />

        <PrimaryButton
          className="w-full sm:w-40"
          onClick={() => setOpenCreateModal(true)}
        >
          Crear Reserva
        </PrimaryButton>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 w-full mt-4">
        {paginatedReservations.length > 0 && (
          <>
            <ReservationTable hideStatus reservations={paginatedReservations} />

            <PaginationFooter
              currentPage={page}
              totalItems={filteredReservations.length}
              itemsPerPage={RESERVATIONS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}

        {paginatedReservations.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1">
            <img
              src={reservationNotFound}
              alt="Reservations not found"
              className="w-[17rem] h-[17rem] object-cover opacity-[0.5]"
            />
            <p className="text-xl text-center font-light text-gray-700">
              Parece que no hay reservas que coincidan con tu búsqueda. Intenta creando
              una nueva.
            </p>
          </div>
        )}
      </div>

      <Modal
        className="w-full max-w-[55rem] m-8"
        open={openCreateModal}
        setOpen={setOpenCreateModal}
      >
        <p className="text-2xl font-light mb-4">Crear Reserva</p>

        <ReservationForm
          onSubmit={handleCreation}
          onCancel={() => setOpenCreateModal(false)}
        />
      </Modal>
    </div>
  );
};
