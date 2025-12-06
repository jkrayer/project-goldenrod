import { useMemo } from "react";
import { FieldContext } from "./FieldContext";
import { type FieldProps } from "./FieldTypes";
import styles from "./Field.module.css";

/**
 * A wrapper component that provides form field context to its children.
 *
 * This component creates a context provider that shares field-related state and IDs
 * with child components like labels, inputs, and error messages. It handles accessibility
 * concerns by managing relationships between these elements through shared IDs.
 *
 * @param props - The field component properties
 * @param props.children - Child components that will have access to the field context
 * @param props.disabled - Whether the field is disabled. Defaults to false
 * @param props.hasError - Whether the field has a validation error. Defaults to false
 * @param props.id - Unique identifier for the field, used to link labels, inputs, and error messages
 * @param props.required - Whether the field is required. Defaults to false
 *
 * @returns A div wrapper with FieldContext provider containing the children
 *
 * @since 0.1.0
 *
 * @example
 * ```tsx
 * <Field id="email" required hasError={!!errors.email}>
 *   <FieldLabel>Email</FieldLabel>
 *   <FieldInput type="email" />
 *   <FieldError>{errors.email}</FieldError>
 * </Field>
 * ```
 */
export function Field({
  children,
  disabled = false,
  hasError = false,
  id,
  required = false,
}: FieldProps) {
  const contextValue = useMemo(
    () => ({
      id,
      hasError,
      errorId: hasError ? `${id}-error` : undefined,
      labelId: `${id}-label`,
      required,
      disabled,
    }),
    [id, hasError, required, disabled],
  );

  return (
    <FieldContext.Provider value={contextValue}>
      <div className={styles.fieldWrapper}>{children}</div>
    </FieldContext.Provider>
  );
}

Field.displayName = "Field";
