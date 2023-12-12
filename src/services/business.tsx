import { randomBranch, randomBusiness } from "@utils";
import {
  FetchResponse,
  BranchInterface,
  BusinessInterface,
  ExceptionResponse,
} from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

export const getBusinessBranches = async (
  businessId: number,
  token: string
): Promise<FetchResponse<{ branches: BranchInterface[] }>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Business Branches");
  const data = new Array(Math.floor(Math.random() * 10 + 1))
    .fill(null)
    .map(() => randomBranch());
  return { data: { branches: data }, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/business/${businessId}/branches`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: { branches: BranchInterface[] } = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateBusiness = async (
  dto: Partial<BusinessInterface>,
  token: string
): Promise<FetchResponse<BusinessInterface>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Update Business");
  const data = randomBusiness();
  return { data, isError: false };
  // -------------------------------------------
  const uri = `${API_ENDPOINT}/business/${dto.id}`;

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
      const data: BusinessInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const getBusinessProfileImage = async (
  businessId: number
): Promise<FetchResponse<{ image: File }>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Business Profile Image");
  return { isError: true };
  // -------------------------------------------

  console.log(businessId);
};

export const updateBusinessProfileImage = async (
  businessId: number,
  file?: File
): Promise<FetchResponse<null>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Update Business Profile Image");
  return { data: null, isError: false };
  // -------------------------------------------

  console.log(businessId, file);
};
