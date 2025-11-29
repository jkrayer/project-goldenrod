import { object, string } from "yup";
import type { User } from "../index.js";

export const userValidation = object<Partial<User>>({
  name: string()
    .required("User name is required")
    .min(3, "User name must be at least 3 characters")
    .max(50, "User name must be at most 50 characters"),
  email: string()
    .required("Email is required")
    .email("Email must be a valid email address"),
});
