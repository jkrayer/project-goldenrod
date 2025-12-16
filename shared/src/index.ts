export { API_ENDPOINTS } from "./endpoints/index.js";
// Example validation utilities
export { gameValidation, userValidation } from "./validation/index.js";

type ROLE = "ADMIN" | "DM" | "PLAYER";

// Example shared types
export type UserPayload = {
  email: string;
  password: string;
  userName?: string;
};

export type User = Omit<UserPayload, "password"> & {
  role: ROLE;
  token: string;
};

//
export type Game = {
  id: number;
  name: string;
  description: string;
};
