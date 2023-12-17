export interface ProductCategoryInterface {
  id: number;
  branchId: number;
  name: string;
}

export interface ProductInterface {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  description: string;
  disabled: boolean;
  highlight: boolean;
  deliveryDisabled: boolean;
}
