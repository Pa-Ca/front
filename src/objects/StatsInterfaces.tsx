export interface BranchReservesStatsInterface {
  pending: number;
  approved: number;
  active: number;
  percentageFull: number;
}

export interface BranchSaleStatsInterface {
  date: string;
  total: number;
  sales: number;
}

export interface BranchProductStatsInterface {
  name: string;
  total: number;
  sales: number;
}
