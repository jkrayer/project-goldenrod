import { createContext, useContext } from "react";

export type FormContextValue = {
  isDisabled: boolean;
  isLoading: boolean;
};

export const FormContext = createContext<FormContextValue>({
  isDisabled: false,
  isLoading: false,
});

// Strict hook - throws if context is missing
export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("Form components must be used within a Form provider");
  }
  return context;
}

// Optional hook - returns null if context is missing
export function useOptionalFormContext() {
  return useContext(FormContext);
}
