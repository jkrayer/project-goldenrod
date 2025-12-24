import { object, string } from "yup";
import type { GamePayload } from "../index.js";

export const gameValidation = object<GamePayload>({
  name: string()
    .required("Name is a required field.")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name may not exceed 50 characters"),
  description: string().max(500, "Description may not exceed 500 characters."),
});
