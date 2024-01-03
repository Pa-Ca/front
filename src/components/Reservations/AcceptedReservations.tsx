import { FC, useMemo, useState } from "react";
import { FormText } from "../FormInputs/FormText";
import { ReservationInfoInterface } from "@objects";
import { ReservationTable } from "./ReservationTable";
import { PaginationFooter } from "../Molecules/PaginationFooter";
import reservationNotFound from "../../assets/images/reservation-not-found.png";

const RESERVATIONS_PER_PAGE = 15;

interface AcceptedReservationsProps {
  reservations: ReservationInfoInterface[];
}
export const AcceptedReservations: FC<AcceptedReservationsProps> = ({ reservations }) => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

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

  return (
    <div className="flex flex-1 w-full flex-col">
      {/* Filters */}
      <div className="flex flex-col-reverse sm:flex-row w-full gap-2 sm:gap-4">
        <FormText
          label=""
          id="search"
          name="search"
          autoComplete="off"
          value={search}
          placeholder="Buscar reserva pendiente..."
          containerClassName="flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />
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
              Parece que no hay reservas que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
