import { createContext, useContext } from "react";

export type FieldContextValue = {
  id: string;
  hasError: boolean;
  errorId?: string;
  labelId?: string;
  required?: boolean;
  disabled?: boolean;
};

export const FieldContext = createContext<FieldContextValue | null>(null);

// Strict hook - throws if context is missing
export function useFieldContext() {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error("Field components must be used within a Field provider");
  }
  return context;
}
