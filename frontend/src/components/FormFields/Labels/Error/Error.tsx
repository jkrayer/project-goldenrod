import { useFieldContext } from "../../Field/FieldContext";
import { type ErrorProps } from "./ErrorTypes";
import styles from "../Labels.module.css";

/**
 * Error component that displays error messages for form fields.
 *
 * @remarks
 * This component conditionally renders an error message based on the field context's error state.
 * It uses the `useFieldContext` hook to access the field's error information and only displays
 * when `hasError` is true. The rendered element includes accessibility attributes for screen readers.
 *
 * @param props - The error component props
 * @param props.children - The error message content to display
 *
 * @returns A div element containing the error message if there's an error, otherwise null
 *
 * @since 0.1.0
 *
 * @example
 * ```tsx
 * <Field.Root>
 *   <Field.Input />
 *   <Field.Error>This field is required</Error>
 * </Field.Root>
 * ```
 */
export function Error({ children, ...props }: ErrorProps) {
  const fieldContext = useFieldContext();

  return fieldContext.hasError ? (
    <div
      id={fieldContext.errorId}
      role="alert"
      aria-live="polite"
      className={`${styles.label} ${styles.labelError}`}
      {...props}
    >
      {children}
    </div>
  ) : null;
}

Error.displayName = "Error";
