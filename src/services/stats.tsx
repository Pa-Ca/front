import {
  randomBranchYearStats,
  randomBestBranchCouponStats,
  randomBestBranchProductStats,
  randomBranchReservationsStats,
} from "@utils";
import {
  FetchResponse,
  BranchSaleStatsInterface,
  BranchCouponStatsInterface,
  BranchProductStatsInterface,
  BranchReservationsStatsInterface,
} from "@objects";

export const getBranchReservationsStats = async (
  branchId: number,
  token: string
): Promise<FetchResponse<BranchReservationsStatsInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Reservations Stats");
  const data = randomBranchReservationsStats();
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

export const getBranchBestCouponsStats = async (
  branchId: number,
  period: number,
  token: string
): Promise<FetchResponse<BranchCouponStatsInterface[]>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Best Coupons Stats");
  const data = randomBestBranchCouponStats(period);
  return { data: data, isError: false };
  // -------------------------------------------

  console.log(branchId, token);
};
