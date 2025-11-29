import { object, string } from "yup";
import type { Game } from "../index.js";

export const gameValidation = object<Partial<Game>>({
  name: string()
    .required("Game name is required")
    .min(3, "Game name must be at least 3 characters")
    .max(50, "Game name must be at most 50 characters"),
  description: string().max(500, "Description must be at most 500 characters"),
});
