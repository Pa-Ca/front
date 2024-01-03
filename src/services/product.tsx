import { randomBranchProductCategories, randomBranchProducts } from "@utils";
import {
  FetchResponse,
  ProductInterface,
  ExceptionResponse,
  ProductCategoryInterface,
} from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

export const createProduct = async (
  dto: ProductInterface,
  token: string
): Promise<FetchResponse<ProductInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Create Product");
  const data = {
    ...dto,
    id: Math.floor(Math.random() * 1000),
  };
  return { data: data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/product`;

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
      const data: ProductInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateProduct = async (
  dto: Partial<ProductInterface>,
  token: string
): Promise<FetchResponse<ProductInterface>> => {
  // FAKE PUT - DELETE THIS IN PRODUCTION
  console.log("[API] Create Product");
  return { data: dto as ProductInterface, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/product/${dto.id}`;

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
      const data: ProductInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const deleteProduct = async (
  productId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE DELETE - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Product");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/product/${productId}`;

  try {
    const response = await fetch(uri, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const createProductCategory = async (
  dto: ProductCategoryInterface,
  token: string
): Promise<FetchResponse<ProductCategoryInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Create Product Category");
  const data = {
    ...dto,
    id: Math.floor(Math.random() * 1000),
  };
  return { data: data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/product-sub-category`;

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
      const data: ProductCategoryInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateProductCategory = async (
  dto: ProductCategoryInterface,
  token: string
): Promise<FetchResponse<ProductCategoryInterface>> => {
  // FAKE PUT - DELETE THIS IN PRODUCTION
  console.log("[API] Update Product Category");
  return { data: dto, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/product-sub-category/${dto.id}`;

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
      const data: ProductCategoryInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const deleteProductCategory = async (
  categoryId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE DELETE - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Product Category");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/product-sub-category/${categoryId}`;

  try {
    const response = await fetch(uri, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const getProductImage = async (
  productId: number
): Promise<FetchResponse<File>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Product Image");
  return { isError: true };
  // -------------------------------------------

  console.log(productId);
};

type ProductCategoryList = { productCategories: ProductCategoryInterface[] };
export const getBranchProductCategories = async (
  branchId: number,
  token: string
): Promise<FetchResponse<ProductCategoryList>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Product Categories");
  const data = randomBranchProductCategories(branchId);
  return { data: { productCategories: data }, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/branch/${branchId}/product-sub-category`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: ProductCategoryList = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

type ProductList = { products: ProductInterface[] };
export const getBranchProducts = async (
  branchId: number,
  token: string,
  categories?: ProductCategoryInterface[]
): Promise<FetchResponse<ProductList>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Products");
  const data = randomBranchProducts(categories);
  return { data: { products: data }, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/branch/${branchId}/product`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: ProductList = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
