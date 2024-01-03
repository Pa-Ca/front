import { GuestInterface } from "./GuestInterface";
import { ClientInterface } from "./ClientInterface";
import { InvoiceInterface } from "./InvoiceInterface";

export enum ReservationStatus {
  UNSET = 0,
  PENDING = 1,
  REJECTED = 2,
  ACCEPTED = 3,
  RETIRED = 4,
  STARTED = 5,
  CLOSED = 6,
  CANCELED = 90,
  RETURNED = 91,
}
export const HISTORIC_RESERVATION_STATUS = [
  ReservationStatus.CLOSED,
  ReservationStatus.REJECTED,
  ReservationStatus.CANCELED,
  ReservationStatus.RETIRED,
];

export interface ReservationInterface {
  id: number;
  branchId: number;
  guestId?: number;
  invoiceId?: number;
  requestDate: string;
  reservationDateIn: string;
  reservationDateOut: string;
  price: number;
  status: ReservationStatus;
  tableNumber: number;
  clientNumber: number;
  occasion: string;
  byClient: boolean;
}

export interface ReservationInfoInterface {
  reservation: ReservationInterface;
  invoice?: InvoiceInterface;
  client?: ClientInterface;
  guest?: GuestInterface;
}

export interface ReservationExtendedInterface extends ReservationInterface {
  payment?: string;
  payDate?: string;
  haveGuest: boolean;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  identityDocument: string;
}
