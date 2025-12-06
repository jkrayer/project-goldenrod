import { useFieldContext } from "../../Field/FieldContext";
import { type LabelProps } from "./LabelTypes";
import styles from "../Labels.module.css";

/**
 * A label component that integrates with the Field context to provide accessible form labels.
 *
 * @remarks
 * This component automatically retrieves field information (id, labelId, required status) from the
 * FieldContext and applies it to the label element. It also displays a required indicator (*) when
 * the field is marked as required.
 *
 * @param props - The label props
 * @param props.children - The content to display inside the label
 *
 * @returns A label element with proper ARIA attributes and optional required indicator
 *
 * @since 0.1.0
 *
 * @example
 * ```tsx
 * <Field.Root>
 *   <Field.Label>Username</Field.Label>
 *   <Field.Input />
 * </Field.Root>
 * ```
 */
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
