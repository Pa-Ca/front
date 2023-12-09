export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
  BUSINESS = "business",
}

export interface UserInterface {
  id: number;
  email: string;
  role: UserRole;
  verified: boolean;
}
