import { useFieldContext } from "../../Field/FieldContext";
import { type ErrorProps } from "./ErrorTypes";
import styles from "../Labels.module.css";
console.log(styles);
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
