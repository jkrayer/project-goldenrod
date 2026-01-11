const API_V1 = "/api/";

// AUTH ENDPOINTS

const REGISTER = `${API_V1}users/register`;

const LOGIN = `${API_V1}users/login`;

const VERIFY_TOKEN = `${API_V1}users/verify-token`;

type KEYS = "REGISTER" | "LOGIN" | "VERIFY_TOKEN";

export const API_ENDPOINTS: Record<KEYS, string> = Object.freeze({
  REGISTER,
  LOGIN,
  VERIFY_TOKEN,
});
