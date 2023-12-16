import {
  randomBestBranchProductStats,
  randomBranchReservesStats,
  randomBranchYearStats,
} from "@utils";
import {
  FetchResponse,
  BranchSaleStatsInterface,
  BranchReservesStatsInterface,
  BranchProductStatsInterface,
} from "@objects";

export const getBranchReservesStats = async (
  branchId: number,
  token: string
): Promise<FetchResponse<BranchReservesStatsInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Reserves Stats");
  const data = randomBranchReservesStats();
  return { data: data, isError: false };
  // -------------------------------------------

  console.log(branchId, token);
};

export const getBranchSalesStats = async (
  branchId: number,
  token: string
): Promise<FetchResponse<BranchSaleStatsInterface[]>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Sales Stats");
  const data = randomBranchYearStats();
  return { data: data, isError: false };
  // -------------------------------------------

  console.log(branchId, token);
};

export const getBranchBestProductsStats = async (
  branchId: number,
  period: number,
  token: string
): Promise<FetchResponse<BranchProductStatsInterface[]>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Best Products Stats");
  const data = randomBestBranchProductStats(period);
  return { data: data, isError: false };
  // -------------------------------------------

  console.log(branchId, token);
};