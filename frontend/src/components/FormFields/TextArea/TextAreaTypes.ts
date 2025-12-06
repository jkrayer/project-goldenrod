import type { TextareaHTMLAttributes } from "react";

// id, aria-invalid, aria-labelledby and disabled are provided by FieldContext

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "disabled" | "id" | "aria-invalid" | "aria-labelledby"
> & {
  // Optional props that override context values
  "aria-describedby"?: string;
};
