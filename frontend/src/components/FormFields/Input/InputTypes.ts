import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

// id, aria-invalid, aria-labelledby and disabled are provided by FieldContext

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "disabled" | "id" | "type" | "aria-invalid" | "aria-labelledby"
> & {
  type: Omit<
    HTMLInputTypeAttribute,
    "button" | "checkbox" | "image" | "radio" | "reset" | "submit"
  >;
};
