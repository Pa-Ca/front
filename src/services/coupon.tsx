import { randomCoupon } from "@utils";
import { CouponInterface, ExceptionResponse, FetchResponse } from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

export const createCoupon = async (
  dto: CouponInterface,
  token: string
): Promise<FetchResponse<CouponInterface>> => {
  // FAKE POST - DELETE THIS IN PRODUCTION
  console.log("[API] Create Coupon");
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
      const data: CouponInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updateCoupon = async (
  dto: Partial<CouponInterface>,
  token: string
): Promise<FetchResponse<CouponInterface>> => {
  // FAKE PUT - DELETE THIS IN PRODUCTION
  console.log("[API] Create Coupon");
  return { data: dto as CouponInterface, isError: false };
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
      const data: CouponInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const deleteCoupon = async (
  productId: number,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE DELETE - DELETE THIS IN PRODUCTION
  console.log("[API] Delete Coupon");
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

export const getCouponImage = async (couponId: number): Promise<FetchResponse<File>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Coupon Image");
  return { isError: true };
  // -------------------------------------------

  console.log(couponId);
};

type CouponList = { coupons: CouponInterface[] };
export const getBranchCoupons = async (
  branchId: number,
  token: string
): Promise<FetchResponse<CouponList>> => {
  // FAKE GET - DELETE THIS IN PRODUCTION
  console.log("[API] Get Branch Products");
  const data = new Array(Math.floor(Math.random() * 15 + 5))
    .fill(0)
    .map(() => randomCoupon());
  return { data: { coupons: data }, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/branch/${branchId}/coupon`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: CouponList = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
