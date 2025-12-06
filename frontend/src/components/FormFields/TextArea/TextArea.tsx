import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFieldContext } from "../Field/FieldContext";
import { useFormContext } from "../../Form/FormContext";
import { type TextAreaProps } from "./TextAreaTypes";
import inputStyles from "../Input/Input.module.css";
import styles from "./TextArea.module.css";
import { mergeStrings } from "@lib";

/**
 * A textarea component that integrates with Field and Form contexts.
 *
 * @remarks
 * This component automatically handles accessibility attributes, disabled states,
 * and error states through the Field and Form context providers. It can also be
 * used as a standalone component without context.
 *
 * @param props - The textarea props
 * @param props.aria-describedby - Additional aria-describedby IDs to merge with error messages
 * @param props.rows - Number of visible text rows (default: 3)
 * @param ref - Forwarded ref to the underlying textarea element
 *
 * @since 0.1.0
 *
 * @example
 * ```tsx
 * <Field.Root name="description">
 *   <Field.Label>Description</Field.Label>
 *   <Field.TextArea rows={5} placeholder="Enter description" />
 * </Field.Root>
 * ```
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ "aria-describedby": ariaDescribedByProp, rows = 3, ...props }, ref) => {
    // Expose the textarea ref to the parent component
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    );

    // Use context if available, but don't throw if missing
    const fieldContext = useFieldContext();
    const { isDisabled: formIsDisabled, isLoading: formIsLoading } =
      useFormContext();

    // Props override context values
    const ariaDescribedBy = mergeStrings([
      ariaDescribedByProp,
      fieldContext?.hasError ? fieldContext.errorId : undefined,
    ]);

    const disabled = useMemo<boolean>(
      () => !!formIsDisabled || !!formIsLoading || !!fieldContext?.disabled,
      [fieldContext?.disabled, formIsDisabled, formIsLoading],
    );

    return (
      <textarea
        aria-describedby={ariaDescribedBy}
        aria-invalid={fieldContext.hasError}
        aria-labelledby={fieldContext?.labelId}
        className={`${inputStyles.input} ${styles.textarea}`}
        disabled={disabled}
        id={fieldContext.id}
        ref={textareaRef}
        rows={rows}
        {...props}
      />
    );
  },
);

TextArea.displayName = "TextArea";
