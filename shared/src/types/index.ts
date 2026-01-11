export type Err = {
  type: string;
  message: string;
  field?: string;
};

export type ErrorResponse = {
  status: string;
  code: number;
  timestamp: string;
  errors: Err[];
};

export type SuccessResponse<T> = {
  data: T;
};

// // type ROLE = "ADMIN" | "DM" | "PLAYER";

export type UserPayload = {
  email: string;
  password: string;
  userName?: string;
};

export type User = Omit<UserPayload, "password"> & {
  token: string;
};
