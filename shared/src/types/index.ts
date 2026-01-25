/**
 * KEY
 * ?Payload = data sent to the server
 */

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
  // status: number;
  // statusText: string;
  // success: true;
  data: T;
};

type ROLE = "REFEREE" | "PLAYER";

// USERS --------------------

export type UserPayload = {
  email: string;
  password: string;
  userName?: string;
};

export type User = Omit<UserPayload, "password"> & {
  token: string;
};

// SESSIONS --------------------
type SessionMember = {
  userId: number; // not sure this data is necessary
  name: string;
  role: ROLE;
};

// POST /sessions/
// userId will be derived from the token

export type SessionPayload = {
  name: string;
};

export type SessionResponse = {
  id: number;
};

// GET /sessions/:id

export type Session = {
  session: { id: number; name: string };
  me: { role: ROLE; userId: number };
  members: SessionMember[];
};
