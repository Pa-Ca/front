export interface ClientInterface {
  id: number;
  userId: number;
  clientGuestId: number;
  email: string;
  name: string;
  surname: string;
  identityDocument: string;
  stripeCustomerId: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}
