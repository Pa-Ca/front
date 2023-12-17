import { randomSale } from "@utils";
import { ExceptionResponse, FetchResponse, SaleInterface, TableInterace } from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

interface SaleResponse {
  ongoingSalesInfo: SaleInterface[];
  historicSalesInfo: SaleInterface[];
  currentHistoricPage: number;
  totalHistoricPages: number;
  totalHistoricElements: number;
}

/**
 * @brief Get the sales of a branch given its id
 *
 * @param id Branch id
 * @param token Authorization token
 * @param pageIndex Index of the page
 * @param pageSize Size of the page
 * @param startTime Start time of the sales
 * @param endTime End time of the sales
 * @param fullname Fullname of the customer
 * @param identityDocument Identity document of the customer
 *
 * @returns API response when refresh
 */
export const getBranchSales = async (
  branchId: number,
  token: string,
  tables?: TableInterace[], // DELETE THIS IN PRODUCTION
  pageIndex: number = 1,
  pageSize: number = 10,
  startTime?: Date,
  endTime?: Date,
  fullname?: string,
  identityDocument?: string
): Promise<FetchResponse<SaleResponse>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Sales");
  const ongoing = new Array(Math.floor(Math.random() * 10 + 1))
    .fill(null)
    .map(() => randomSale(branchId, tables));
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const length = start > 100 ? 0 : end > 100 ? 100 - start : pageSize;
  const historic = new Array(length).fill(null).map(() => randomSale(branchId, tables));
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

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: SaleResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
