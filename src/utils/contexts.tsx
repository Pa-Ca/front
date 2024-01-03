import { createContext } from "react";
import {
  SaleInterface,
  ProductInterface,
  ProductCategoryInterface,
  ReservationInfoInterface,
  TableInterace,
} from "@objects";

interface ReservationsContextInterface {
  sales: SaleInterface[];
  tables: TableInterace[];
  products: ProductInterface[];
  categories: ProductCategoryInterface[];
  onRefresh: () => void;
  setSales: React.Dispatch<React.SetStateAction<SaleInterface[]>>;
  onStart: (reservation: ReservationInfoInterface) => Promise<void>;
  onAccept: (reservation: ReservationInfoInterface) => Promise<void>;
  onCancel: (reservation: ReservationInfoInterface) => Promise<void>;
  onReject: (reservation: ReservationInfoInterface) => Promise<void>;
  onRetire: (reservation: ReservationInfoInterface) => Promise<void>;
}
export const ReservationsContext = createContext<ReservationsContextInterface>({
  sales: [],
  tables: [],
  products: [],
  categories: [],
  setSales: () => {},
  onRefresh: () => {},
  onStart: () => Promise.resolve(),
  onAccept: () => Promise.resolve(),
  onReject: () => Promise.resolve(),
  onCancel: () => Promise.resolve(),
  onRetire: () => Promise.resolve(),
});
