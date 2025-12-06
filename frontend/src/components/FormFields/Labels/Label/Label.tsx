import { useFieldContext } from "../../Field/FieldContext";
import { type LabelProps } from "./LabelTypes";
import styles from "../Labels.module.css";

export function Label({ children, ...props }: LabelProps) {
  const fieldContext = useFieldContext();

  return (
    <label
      className={styles.label}
      htmlFor={fieldContext.id}
      id={fieldContext.labelId}
      {...props}
    >
      {children}
      {fieldContext.required && (
        <span className={styles.labelRequiredIndicator}> *</span>
      )}
    </label>
  );
}

Label.displayName = "Label";
