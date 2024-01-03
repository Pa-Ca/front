import { ExceptionResponse, FetchResponse, SaleProductInterface } from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

export const createSaleProduct = async (
  dto: SaleProductInterface,
  token: string
): Promise<FetchResponse<SaleProductInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Create Sale Product");
  const data = {
    ...dto,
    id: Math.floor(Math.random() * 1000),
  };
  return { data: data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/sale-product`;

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
      const data: SaleProductInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateSaleProduct = async (
  dto: Partial<SaleProductInterface>,
  token: string
): Promise<FetchResponse<SaleProductInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Update Sale Product");
  return { isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/sale-product/${dto.id}`;

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
      const data: SaleProductInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const deleteSaleProduct = async (
  saleProductId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE DELETE - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Sale Product");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/sale-product/${saleProductId}`;

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
