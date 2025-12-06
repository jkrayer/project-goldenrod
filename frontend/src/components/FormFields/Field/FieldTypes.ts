import type { ReactNode } from "react";

export interface FieldProps {
  children: ReactNode;
  disabled?: boolean;
  hasError?: boolean;
  id: string;
  required?: boolean;
}
