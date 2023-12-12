import { TableInterace } from "./BranchInterface";
import { GuestInterface } from "./GuestInterface";
import { ClientInterface } from "./ClientInterface";

export interface TaxInterface {
  id: number;
  name: string;
  value: number;
  isPercentage: boolean;
}

export interface SaleProductInterface {
  id: number;
  saleId: number;
  productId: number;
  name: string;
  amount: number;
  price: number;
}

export interface SaleDataInterface {
  id: number;
  branchId: number;
  clientGuestId: number;
  invoiceId: number;
  clientQuantity: number;
  status: number;
  startTime: string;
  endTime: string;
  dollarExchange: number;
  note: string;
}

export interface SaleInterface {
  sale: SaleDataInterface;
  insite: boolean;
  guest?: GuestInterface;
  client?: ClientInterface;
  reservationId?: number;
  taxes: TaxInterface[];
  tables: TableInterace[];
  products: SaleProductInterface[];
}
