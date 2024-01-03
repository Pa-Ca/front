import { randomReservationInfo } from "@utils";
import {
  FetchResponse,
  ReservationStatus,
  ExceptionResponse,
  ReservationInfoInterface,
  ReservationExtendedInterface,
} from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

export const createReservation = async (
  dto: ReservationExtendedInterface,
  token: string
) => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Create Guest Reservation");
  const data = {
    ...dto,
    id: Math.floor(Math.random() * 1000),
  };
  return { data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/reservation`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 200) {
      const data: ReservationExtendedInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const acceptReservation = async (
  reservationId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Accept Reservation");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/reservation/${reservationId}/accept`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const cancelReservation = async (
  reservationId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Cancel Reservation");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/reservation/${reservationId}/cancel`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const closeReservation = async (
  reservationId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Close Reservation");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/reservation/${reservationId}/close`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const rejectReservation = async (
  reservationId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Reject Reservation");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/reservation/${reservationId}/reject`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const retireReservation = async (
  reservationId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Retire Reservation");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/reservation/${reservationId}/retire`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const startReservation = async (
  reservationId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Start Reservation");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/reservation/${reservationId}/start`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

type BranchReservations = {
  pendingReservations: ReservationInfoInterface[];
  acceptedReservations: ReservationInfoInterface[];
  startedReservations: ReservationInfoInterface[];
  historicReservations: ReservationInfoInterface[];
  currentHistoricPage: number;
  totalHistoricPages: number;
  totalHistoricElements: number;
};
export const getBranchReservations = async (
  branchId: number,
  token: string,
  pageIndex: number = 1,
  pageSize: number = 10,
  startTime?: Date,
  endTime?: Date,
  fullname?: string,
  identityDocument?: string,
  status?: ReservationStatus[]
): Promise<FetchResponse<BranchReservations>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Reservations");
  const pendingReservations = new Array(Math.floor(Math.random() * 30 + 30))
    .fill(null)
    .map(() => randomReservationInfo(branchId, undefined, [ReservationStatus.PENDING]));
  const acceptedReservations = new Array(Math.floor(Math.random() * 20 + 15))
    .fill(null)
    .map(() => randomReservationInfo(branchId, undefined, [ReservationStatus.ACCEPTED]));
  const startedReservations = new Array(Math.floor(Math.random() * 5 + 10))
    .fill(null)
    .map(() => randomReservationInfo(branchId, undefined, [ReservationStatus.STARTED]));
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const length = start > 100 ? 0 : end > 100 ? 100 - start : pageSize;
  const historicReservations = new Array(length)
    .fill(null)
    .map(() => randomReservationInfo(branchId, undefined, status, startTime, endTime));

  return {
    data: {
      pendingReservations,
      acceptedReservations,
      startedReservations,
      historicReservations,
      currentHistoricPage: pageIndex,
      totalHistoricPages: 10,
      totalHistoricElements: 100,
    },
    isError: false,
  };
  // -------------------------------------------

  let uri = `${API_ENDPOINT}/branch/${branchId}/reservation?page=${pageIndex}&size=${pageSize}`;

  if (startTime) {
    uri = uri.concat(`&startTime=${startTime.toISOString()}`);
  }
  if (endTime) {
    // Get endDateTime + 1 day
    const endTimePlusOne = new Date(endTime);
    endTimePlusOne.setDate(endTimePlusOne.getDate() + 1);
    uri = uri.concat(`&endTime=${endTimePlusOne.toISOString()}`);
  }
  if (fullname) {
    uri = uri.concat(`&fullname=${fullname}`);
  }
  if (identityDocument) {
    uri = uri.concat(`&identityDocument=${identityDocument}`);
  }
  if (status) {
    uri = uri.concat(`&status=${status[0]}`);
  }

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: BranchReservations = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
