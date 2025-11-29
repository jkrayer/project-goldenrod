// Example validation utilities
export { gameValidation, userValidation } from "./validation/index.js";

// Example shared types
export type User = {
  id: number;
  username: string;
  email: string;
};

export type Game = {
  id: number;
  name: string;
  description: string;
};
