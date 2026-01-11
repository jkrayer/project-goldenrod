const API_V1 = "/api/";

// AUTH ENDPOINTS

const REGISTER = `${API_V1}users/register`;

const LOGIN = `${API_V1}users/login`;

const VERIFY_TOKEN = `${API_V1}users/verify-token`;

// SESSION ENDPOINTS

const SESSIONS = `${API_V1}sessions`;

const SESSION = `${API_V1}sessions/:id`;

const SESSION_JOIN = `${API_V1}sessions/:id/join`;

type KEYS =
  | "REGISTER"
  | "LOGIN"
  | "VERIFY_TOKEN"
  | "SESSIONS"
  | "SESSION"
  | "SESSION_JOIN";

export const API_ENDPOINTS: Record<KEYS, string> = Object.freeze({
  REGISTER,
  LOGIN,
  VERIFY_TOKEN,
  SESSIONS,
  SESSION,
  SESSION_JOIN,
});
