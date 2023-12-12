export interface ExceptionResponse {
  code: number;
  status: string;
  message: string;
  timestamp: string;
}

export interface FetchResponse<T> {
  data?: T;
  error?: Error;
  isError: boolean;
  exception?: ExceptionResponse;
}
