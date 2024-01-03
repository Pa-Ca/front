import { ExceptionResponse, FetchResponse, TaxInterface } from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

interface SaleTaxInterface {
  saleId: number;
  tax: TaxInterface;
}

export const createSaleTax = async (
  dto: SaleTaxInterface,
  token: string
): Promise<FetchResponse<TaxInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Create Sale Tax");
  const data = {
    ...dto.tax,
    id: Math.floor(Math.random() * 1000),
  };
  return { data: data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/sale-tax`;

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
      const data: TaxInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateSaleTax = async (
  dto: Partial<TaxInterface>,
  token: string
): Promise<FetchResponse<TaxInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Update Sale Tax");
  return { isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/sale-tax/${dto.id}`;

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
      const data: TaxInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const deleteSaleTax = async (
  id: number,
  token: string
): Promise<FetchResponse<TaxInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Sale Tax");
  return { isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/sale-tax/${id}`;

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
