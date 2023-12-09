export enum Tier {
  BASIC = "basic",
  PREMIUM = "premium",
  UNLIMITED = "unlimited",
}

export interface TierInterface {
  id: number;
  name: Tier;
  cost: number;
  reservationLimit: number;
}

export interface BusinessInterface {
  id: number;
  userId: number;
  name: string;
  tier: Tier;
  verified: boolean;
  phoneNumber: string;
}
