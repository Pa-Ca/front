import { randomImages, randomTable } from "@utils";
import {
  FetchResponse,
  TableInterace,
  BranchInterface,
  ExceptionResponse,
  DefaultTaxInterface,
} from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

export const createBranch = async (
  dto: BranchInterface,
  token: string
): Promise<FetchResponse<BranchInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Create Branch");
  const data = {
    ...dto,
    id: Math.floor(Math.random() * 1000),
    score: 5,
  };
  return { data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/branch`;

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
      const data: BranchInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateBranch = async (
  dto: BranchInterface,
  token: string
): Promise<FetchResponse<BranchInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Update Branch");
  return { data: dto, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/branch/${dto.id}`;

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
      const data: BranchInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const getBranchTables = async (
  branchId: number,
  token: string
): Promise<FetchResponse<{ tables: TableInterace[] }>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Tables");
  const data = new Array(Math.floor(Math.random() * 50 + 5))
    .fill(null)
    .map(() => randomTable(branchId));
  return { data: { tables: data }, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/branch/${branchId}/table`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: { tables: TableInterace[] } = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const getBranchImages = async (
  branchId: number,
  token: string
): Promise<FetchResponse<{ images: string[] }>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Images");
  const data = randomImages(Math.floor(Math.random() * 6 + 3));
  return { data: { images: data }, isError: false };
  // -------------------------------------------

  console.log(branchId, token);
};

export const createDefaultTax = async (
  dto: DefaultTaxInterface,
  token: string
): Promise<FetchResponse<DefaultTaxInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Create Default Tax");
  const data = {
    ...dto,
    id: Math.floor(Math.random() * 1000),
  };
  return { data: data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/defaulttax`;

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
      const data: DefaultTaxInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const deleteDefaultTax = async (
  defaultTaxId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Default Tax");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/defaulttax/${defaultTaxId}`;

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

export const addBranchImage = async (
  branchId: number,
  image: string,
  token: string
): Promise<FetchResponse<string[]>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Add Branch Image");
  const data = randomImages(Math.floor(Math.random() * 6 + 3));
  return { data: data, isError: false };
  // -------------------------------------------

  console.log(branchId, image, token);
};

export const deleteBranchImage = async (
  branchId: number,
  imageIndex: number,
  token: string
): Promise<FetchResponse<string[]>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Branch Image");
  const data = randomImages(Math.floor(Math.random() * 6 + 3));
  return { data: data, isError: false };
  // -------------------------------------------

  console.log(branchId, imageIndex, token);
};

export const addBranchTable = async (
  dto: TableInterace,
  token: string
): Promise<FetchResponse<TableInterace>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Add Branch Table");
  const data = {
    ...dto,
    id: Math.floor(Math.random() * 1000),
  };
  return { data: data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/table`;

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
      const data: TableInterace = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const deleteBranchTable = async (
  tableId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Branch Table");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/table/${tableId}`;

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
