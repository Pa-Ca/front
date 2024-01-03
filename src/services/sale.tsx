import { randomSale } from "@utils";
import {
  ExceptionResponse,
  FetchResponse,
  SaleDataInterface,
  SaleInterface,
  SaleStatus,
  TableInterace,
} from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

export const createSale = async (
  dto: SaleInterface,
  token: string
): Promise<FetchResponse<SaleInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Create Sale");
  const data = {
    ...dto,
    sale: {
      ...dto.sale,
      id: Math.floor(Math.random() * 1000),
    },
    guest: dto.guest
      ? {
          ...dto.guest,
          id: Math.floor(Math.random() * 1000),
        }
      : undefined,
  };
  return { data, isError: false };
  // -------------------------------------------
  const uri = `${API_ENDPOINT}/sale`;

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
      const data: SaleInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateSale = async (
  dto: Partial<SaleDataInterface>,
  token: string
): Promise<FetchResponse<SaleInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Update Sale");
  return { isError: false };

  const uri = `${API_ENDPOINT}/sale/${dto.id}`;

  try {
    const response = await fetch(uri, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 200) {
      const data: SaleInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

interface BranchSales {
  ongoingSalesInfo: SaleInterface[];
  historicSalesInfo: SaleInterface[];
  currentHistoricPage: number;
  totalHistoricPages: number;
  totalHistoricElements: number;
}
export const getBranchSales = async (
  branchId: number,
  token: string,
  tables?: TableInterace[], // DELETE THIS IN PRODUCTION
  pageIndex: number = 1,
  pageSize: number = 10,
  startTime?: Date,
  endTime?: Date,
  fullname?: string,
  identityDocument?: string,
  status?: SaleStatus[]
): Promise<FetchResponse<BranchSales>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Sales");
  const ongoing = new Array(Math.floor(Math.random() * 10 + 1))
    .fill(null)
    .map(() => randomSale(branchId, tables));
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const length = start > 100 ? 0 : end > 100 ? 100 - start : pageSize;
  const historic = new Array(length)
    .fill(null)
    .map(() => randomSale(branchId, tables, status, startTime, endTime));
  return {
    data: {
      ongoingSalesInfo: ongoing,
      historicSalesInfo: historic,
      currentHistoricPage: pageIndex,
      totalHistoricPages: 10,
      totalHistoricElements: 100,
    },
    isError: false,
  };
  // -------------------------------------------

  let uri = `${API_ENDPOINT}/branch/${branchId}/sale?page=${pageIndex}&size=${pageSize}`;

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
      const data: BranchSales = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
