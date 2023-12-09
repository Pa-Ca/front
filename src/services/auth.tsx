import { randomLoginResponse, randomToken } from "@utils";
import {
  UserRole,
  FetchResponse,
  ClientInterface,
  BusinessInterface,
  ExceptionResponse,
} from "@objects";

const API_ENDPOINT = process.env.REACT_APP_API_HOST;

interface LoginResponseDTO {
  id: number;
  token: string;
  refresh: string;
  role: UserRole;
  client?: ClientInterface;
  business?: BusinessInterface;
}

const loginBusiness = async (
  loginData: LoginResponseDTO
): Promise<FetchResponse<BusinessInterface>> => {
  // Get the Business
  const uri = `${API_ENDPOINT}/business/user/${loginData.id}`;
  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
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

const loginClient = async (
  loginData: LoginResponseDTO
): Promise<FetchResponse<ClientInterface>> => {
  // Get the Client
  const uri = `${API_ENDPOINT}/client/user/${loginData.id}`;
  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
    });

    if (response.status === 200) {
      const data: ClientInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<FetchResponse<LoginResponseDTO>> => {
  // FAKE LOGIN - DELETE THIS IN PRODUCTION
  console.log("[API] Login");
  console.log(email.split("@")[1]);
  const data = randomLoginResponse(email.split("@")[1] !== "business.com");
  return { data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/auth/login`;
  let loginData: LoginResponseDTO;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      loginData = await response.json();
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }

  // Login user client
  if (loginData.role === "client") {
    const response = await loginClient(loginData);

    if (response.isError) {
      return { error: response.error, isError: true };
    } else {
      loginData.client = response.data;
      return { data: loginData, isError: false };
    }
  }

  // Login user business
  else {
    const response = await loginBusiness(loginData);

    if (response.isError) {
      return { error: response.error, isError: true };
    } else {
      loginData.business = response.data;
      return { data: loginData, isError: false };
    }
  }
};

const signupBusiness = async (
  dto: BusinessInterface,
  loginData: LoginResponseDTO
): Promise<FetchResponse<BusinessInterface>> => {
  // Create the Business
  const uri = `${API_ENDPOINT}/business`;
  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
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

const signupClient = async (
  dto: ClientInterface,
  loginData: LoginResponseDTO
): Promise<FetchResponse<ClientInterface>> => {
  // Create the Business
  const uri = `${API_ENDPOINT}/business`;
  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 200) {
      const data: ClientInterface = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const signup = async (
  email: string,
  role: UserRole,
  password: string,
  dto: ClientInterface | BusinessInterface
): Promise<FetchResponse<LoginResponseDTO>> => {
  // FAKE SIGNUP - DELETE THIS IN PRODUCTION
  console.log("[API] Signup");
  const data = randomLoginResponse();
  return { data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/auth/signup`;
  let signupData: LoginResponseDTO;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    if (response.status === 200) {
      signupData = await response.json();
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }

  // Signup user client
  if (role === "client") {
    const response = await signupClient(dto as ClientInterface, signupData);

    if (response.isError) {
      return { error: response.error, isError: true };
    } else {
      signupData.client = response.data;
      return { data: signupData, isError: false };
    }
  }

  // Signup user business
  else {
    const response = await signupBusiness(dto as BusinessInterface, signupData);

    if (response.isError) {
      return { error: response.error, isError: true };
    } else {
      signupData.business = response.data;
      return { data: signupData, isError: false };
    }
  }
};

export const logout = async (
  token: string,
  refresh: string
): Promise<FetchResponse<null>> => {
  // FAKE LOGOUT - DELETE THIS IN PRODUCTION
  console.log("[API] Logout");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/auth/logout`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, refresh }),
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

export const refresh = async (refresh: string): Promise<FetchResponse<string>> => {
  // FAKE REFRESH - DELETE THIS IN PRODUCTION
  console.log("[API] Refresh");
  const data = randomToken();
  return { data, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/auth/refresh`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (response.status === 200) {
      const data: { token: string } = await response.json();
      return { data: data.token, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const updatePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<FetchResponse<null>> => {
  // FAKE LOGOUT - DELETE THIS IN PRODUCTION
  console.log("[API] Password Recovery Request");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/auth/reset-password`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });
    if (response.status === 200) {
      return { data: null, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const passwordRecovery = async (
  newPassword: string,
  token: string
): Promise<FetchResponse<null>> => {
  // FAKE LOGOUT - DELETE THIS IN PRODUCTION
  console.log("[API] Password Recovery Request");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/auth/reset-password/${token}`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    if (response.status === 200) {
      return { data: null, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};

export const passwordRecoveryRequest = async (
  email: string
): Promise<FetchResponse<null>> => {
  // FAKE LOGOUT - DELETE THIS IN PRODUCTION
  console.log("[API] Password Recovery Request");
  return { data: null, isError: false };
  // -------------------------------------------

  const uri = `${API_ENDPOINT}/auth/reset-password-request`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      return { data: null, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
