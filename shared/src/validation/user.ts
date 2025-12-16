import { object, string } from "yup";
import type { UserPayload } from "../index.js";

export const userValidation = object<UserPayload>({
  userName: string()
    .optional()
    .min(3, "User name must be at least 3 characters")
    .max(50, "User name must be at most 50 characters"),
  email: string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: string()
    .required("Password is required")
    .min(16, "Password must be at least 16 characters")
    .max(64, "Password must be at most 64 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    )
    .test(
      "no-brackets",
      "Password cannot contain brackets",
      (val) => !/[\(\)\{\}\[\]]/.test(val || ""),
    ),
});
