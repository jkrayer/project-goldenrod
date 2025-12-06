import type { LabelHTMLAttributes } from "react";

export type LabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "className" | "htmlFor" | "id"
>;
