import { object, string } from "yup";
import type { SessionPayload } from "../index.js";

export const sessionValidation = object<SessionPayload>({
  name: string()
    .optional()
    .min(3, "Session name must be at least 3 characters")
    .max(100, "Session name must be at most 100 characters"),
});
