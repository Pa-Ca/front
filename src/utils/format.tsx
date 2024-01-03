import {
  Tier,
  Duration,
  LocalTime,
  CouponType,
  ReservationStatus,
  CouponDiscountType,
  SaleStatus,
} from "@objects";

export const formatTier = (tier?: Tier) => {
  switch (tier) {
    case Tier.BASIC:
      return "Básico";
    case Tier.PREMIUM:
      return "Premium";
    case Tier.UNLIMITED:
      return "Ilimitado";
    default:
      return "Desconocido";
  }
};

export const formatLocalTime = (time: LocalTime) => {
  const [hour, minute, second] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hour, minute, second);
  type digits = "2-digit" | "numeric";

  const options = {
    hour12: true,
    hour: "2-digit" as digits,
    minute: "2-digit" as digits,
  };
  const formatted = date.toLocaleTimeString("en-US", options);

  return formatted;
};

export const formatDuration = (duration: Duration) => {
  const [hour, minute] = duration
    .replace("PT", "")
    .replace("H", ":")
    .replace("M", ":")
    .replace("S", "")
    .split(":")
    .map(Number);

  if (minute) {
    return `${hour} hora${hour !== 1 ? "s" : ""} y ${minute} minuto${
      minute !== 1 ? "s" : ""
    }`;
  } else {
    return `${hour} hora${hour !== 1 ? "s" : ""}`;
  }
};

export const formatCouponType = (type: CouponType) => {
  switch (type) {
    case CouponType.PRODUCT:
      return "Producto";
    case CouponType.CATEGORY:
      return "Categoría";
    default:
      return "Desconocido";
  }
};

export const formatCouponDiscountType = (type: CouponDiscountType) => {
  switch (type) {
    case CouponDiscountType.PERCENTAGE:
      return "Porcentaje";
    case CouponDiscountType.AMOUNT:
      return "Monto";
    default:
      return "Desconocido";
  }
};

export const formatReservationStatus = (status: ReservationStatus) => {
  switch (status) {
    case ReservationStatus.UNSET:
      return "Sin definir";
    case ReservationStatus.PENDING:
      return "Pendiente";
    case ReservationStatus.REJECTED:
      return "Rechazada";
    case ReservationStatus.ACCEPTED:
      return "Aceptada";
    case ReservationStatus.RETIRED:
      return "Retirada";
    case ReservationStatus.STARTED:
      return "Activa";
    case ReservationStatus.CLOSED:
      return "Finalizada";
    case ReservationStatus.CANCELED:
      return "Cancelada";
    case ReservationStatus.RETURNED:
      return "Devuelta";
    default:
      return "Desconocido";
  }
};

export const reservationStatusColor = (status: ReservationStatus) => {
  switch (status) {
    case ReservationStatus.UNSET:
      return "gray-700";
    case ReservationStatus.PENDING:
      return "yellow-700";
    case ReservationStatus.REJECTED:
      return "red-700";
    case ReservationStatus.ACCEPTED:
      return "orange-700";
    case ReservationStatus.RETIRED:
      return "red-700";
    case ReservationStatus.STARTED:
      return "blue-600";
    case ReservationStatus.CLOSED:
      return "green-700";
    case ReservationStatus.CANCELED:
      return "red-700";
    case ReservationStatus.RETURNED:
      return "indigo-700";
    default:
      return "gray-700";
  }
};

export const formatSaleStatus = (status: SaleStatus) => {
  switch (status) {
    case SaleStatus.ONGOING:
      return "En curso";
    case SaleStatus.CLOSED:
      return "Finalizado";
    case SaleStatus.CANCELED:
      return "Cancelado";
    default:
      return "Desconocido";
  }
};

export const saleStatusColor = (status: SaleStatus) => {
  switch (status) {
    case SaleStatus.ONGOING:
      return "blue-600";
    case SaleStatus.CLOSED:
      return "green-700";
    case SaleStatus.CANCELED:
      return "red-700";
    default:
      return "gray-700";
  }
};
