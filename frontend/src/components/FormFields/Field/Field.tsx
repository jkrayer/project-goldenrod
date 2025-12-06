import { useMemo } from "react";
import { FieldContext } from "./FieldContext";
import { type FieldProps } from "./FieldTypes";
import styles from "./Field.module.css";

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
