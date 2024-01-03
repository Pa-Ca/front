import { FC, useContext, useMemo, useState } from "react";
import { Modal } from "../Atoms/Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormTextArea } from "../FormInputs/FormTextArea";
import { ReservationInfoInterface, ReservationStatus } from "@objects";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import {
  ReservationsContext,
  reservationStatusColor,
  formatReservationStatus,
} from "@utils";

interface ReservationModalProps {
  reservation: ReservationInfoInterface;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ReservationModal: FC<ReservationModalProps> = ({
  reservation,
  open,
  setOpen,
}) => {
  const { onAccept, onCancel, onReject, onRetire, onStart } =
    useContext(ReservationsContext);

  const [reason, setReason] = useState("");
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openRetireModal, setOpenRetireModal] = useState(false);

  const owner = useMemo(() => {
    return reservation.reservation.byClient ? reservation.client : reservation.guest;
  }, [reservation]);

  const reservationDate = useMemo(() => {
    let weekDay = new Date(reservation.reservation.reservationDateIn).toLocaleDateString(
      "es-ES",
      {
        weekday: "long",
      }
    );
    weekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    const date = new Date(reservation.reservation.reservationDateIn).toLocaleDateString(
      "es-ES",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    const hour = new Date(reservation.reservation.reservationDateIn).toLocaleTimeString(
      "es-ES",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );

    const endHour = new Date(
      reservation.reservation.reservationDateOut
    ).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const duration = `${hour} - ${endHour}`
      .replace(new RegExp("a. m.", "g"), "AM")
      .replace(new RegExp("p. m.", "g"), "PM");

    return { weekDay, date, duration };
  }, [reservation]);

  const color = useMemo(() => {
    return reservationStatusColor(reservation.reservation.status);
  }, [reservation]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-full !m-2 md:!m-8 max-w-[50rem]">
      {/* Header */}
      <div className="flex w-full justify-between gap-4 items-start">
        <p className="text-2xl font-light">
          Reserva{" "}
          <span className="font-medium text-gray-800 italic ml-1">
            {reservation.reservation.id}
          </span>
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
            {formatReservationStatus(reservation.reservation.status)}
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col sm:flex-row w-full sm:gap-6 leading-tight mb-4">
          <p className="flex-1 font-light sm:text-right">Fecha</p>
          <div className="flex-[2] font-normal text-base">
            <p className="leading-tight text-gray-800 font-medium">
              {reservationDate.weekDay}
            </p>
            <p className="leading-tight">{reservationDate.date}</p>
            <p className="leading-tight">{reservationDate.duration}</p>
          </div>
        </div>

        {/* Owner */}
        <div className="flex flex-col sm:flex-row w-full sm:gap-6 leading-tight mb-4">
          <p className="flex-1 font-light sm:text-right">Cliente</p>
          <div className="flex-[2] font-normal text-base">
            <p className="leading-tight text-gray-800 font-medium">
              {owner?.name} {owner?.surname}{" "}
              <span className="italic font-light ml-2">
                {reservation.guest ? "(No Registrado)" : "(Registrado)"}
              </span>
            </p>
            <p className="leading-tight">{owner?.email}</p>
            <p className="leading-tight">{owner?.phoneNumber}</p>
            <p className="leading-tight">{owner?.identityDocument}</p>
            {reservation.client?.address && (
              <p className="leading-tight text-sm">{reservation.client.address}</p>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="flex w-full gap-2 sm:gap-6 leading-tight">
          <p className="sm:flex-1 w-32 sm:w-auto font-light sm:text-right">Monto</p>
          <p className="sm:flex-[2] font-normal">
            ${reservation.reservation.price.toFixed(2)}
          </p>
        </div>

        {/* Number of clients */}
        <div className="flex w-full gap-2 sm:gap-6 leading-tight">
          <p className="sm:flex-1 w-32 sm:w-auto font-light sm:text-right">
            Nº de Clientes
          </p>
          <p className="sm:flex-[2] font-normal">
            {reservation.reservation.clientNumber}
          </p>
        </div>

        {/* Number of tables */}
        <div className="flex w-full gap-2 sm:gap-6 leading-tight">
          <p className="sm:flex-1 w-32 sm:w-auto font-light sm:text-right">Nº de Mesas</p>
          <p className="sm:flex-[2] font-normal">{reservation.reservation.tableNumber}</p>
        </div>

        {/* Occasion */}
        <div className="flex flex-col sm:flex-row w-full sm:gap-6 leading-tight mt-2">
          <p className="flex-1 font-light sm:text-right">Ocasión</p>
          <p className="flex-[2] font-normal text-sm">
            {reservation.reservation.occasion}
          </p>
        </div>
      </div>

      <hr className="w-full my-5" />

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row w-full gap-2 sm:gap-4 sm:justify-between sm:items-center">
        <div>
          {reservation.reservation.status === ReservationStatus.PENDING && (
            <SecondaryButton
              className="w-full sm:w-40"
              onClick={() => setOpenRejectModal(true)}
            >
              Rechazar
            </SecondaryButton>
          )}

          {reservation.reservation.status === ReservationStatus.ACCEPTED && (
            <SecondaryButton
              className="w-full sm:w-40"
              onClick={() => setOpenCancelModal(true)}
            >
              Cancelar
            </SecondaryButton>
          )}
        </div>

        <div>
          {reservation.reservation.status === ReservationStatus.PENDING && (
            <PrimaryButton
              className="w-full sm:w-40"
              onClick={async () => {
                await onAccept(reservation);
                setOpen(false);
              }}
            >
              Aceptar
            </PrimaryButton>
          )}

          {reservation.reservation.status === ReservationStatus.ACCEPTED && (
            <PrimaryButton
              className="w-full sm:w-40"
              onClick={async () => {
                await onStart(reservation);
                setOpen(false);
              }}
            >
              Iniciar
            </PrimaryButton>
          )}
        </div>
      </div>

      <Modal open={openRejectModal} setOpen={setOpenRejectModal}>
        <p className="text-xl font-light mb-4">Rechazar Reserva</p>

        <p className="mb-4">¿Estás seguro que deseas rechazar esta reserva?</p>

        <FormTextArea
          id="reason"
          name="reason"
          label="Motivo del Rechazo"
          value={reason}
          containerClassName="flex-1"
          className="h-32 resize-none"
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenRejectModal(false)}
          >
            Regresar
          </SecondaryButton>

          <PrimaryButton
            onClick={async () => {
              await onReject(reservation);
              setOpenRejectModal(false);
              setOpen(false);
            }}
            type="submit"
            className="w-full sm:w-40"
          >
            Rechazar
          </PrimaryButton>
        </div>
      </Modal>

      <Modal open={openCancelModal} setOpen={setOpenCancelModal}>
        <p className="text-xl font-light mb-4">Cancelar Reserva</p>

        <p className="mb-4">¿Estás seguro que deseas cancelar esta reserva?</p>

        <FormTextArea
          id="reason"
          name="reason"
          label="Motivo de la Cancelación"
          value={reason}
          containerClassName="flex-1"
          className="h-32 resize-none"
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenCancelModal(false)}
          >
            Regresar
          </SecondaryButton>

          <PrimaryButton
            onClick={async () => {
              await onCancel(reservation);
              setOpenCancelModal(false);
              setOpen(false);
            }}
            type="submit"
            className="w-full sm:w-40"
          >
            Cancelar
          </PrimaryButton>
        </div>
      </Modal>

      <Modal open={openRetireModal} setOpen={setOpenRetireModal}>
        <p className="text-xl font-light mb-4">Retirar Reserva</p>

        <p className="mb-4">¿Estás seguro que deseas retirar esta reserva?</p>

        <FormTextArea
          id="reason"
          name="reason"
          label="Motivo del Retiro"
          value={reason}
          containerClassName="flex-1"
          className="h-32 resize-none"
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenRetireModal(false)}
          >
            Regresar
          </SecondaryButton>

          <PrimaryButton
            onClick={async () => {
              await onRetire(reservation);
              setOpenRetireModal(false);
              setOpen(false);
            }}
            type="submit"
            className="w-full sm:w-40"
          >
            Retirar
          </PrimaryButton>
        </div>
      </Modal>
    </Modal>
  );
};
