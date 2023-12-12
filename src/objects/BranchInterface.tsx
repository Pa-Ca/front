export type Duration = `PT${number}H${number}M${number}S`;
export type LocalTime = `${number}:${number}:${number}`;

export interface DefaultTaxInterface {
  id: number;
  businessId: number;
  name: string;
  value: number;
  isPercentage: boolean;
}

export interface TableInterace {
  id: number;
  name: string;
  branchId: number;
}

export interface BranchInterface {
  id: number;
  businessId: number;
  name: string;
  score: number;
  capacity: number;
  reservationPrice: number;
  mapsLink: string;
  location: string;
  overview: string;
  visibility: boolean;
  reserveOff: boolean;
  phoneNumber: string;
  type: string;
  hourIn: LocalTime;
  hourOut: LocalTime;
  averageReserveTime: Duration;
  dollarExchange: number;
  deleted: boolean;
  defaultTaxes: DefaultTaxInterface[];
}
