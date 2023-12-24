import { ProductCategoryInterface, ProductInterface } from "./ProductInterface";

export enum CouponType {
  PRODUCT = 1,
  CATEGORY = 2,
}

export enum CouponDiscountType {
  PERCENTAGE = 1,
  AMOUNT = 2,
}

export interface CouponInterface {
  id: number;
  type: CouponType;
  discountType: CouponDiscountType;
  name: string;
  value: number;
  description: string;
  startDate: string;
  endDate: string;
  enabled: boolean;
  products: ProductInterface[];
  categories: ProductCategoryInterface[];
}