import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFieldContext } from "../Field/FieldContext";
import { useFormContext } from "../../Form/FormContext";
import { type TextAreaProps } from "./TextAreaTypes";
import inputStyles from "../Input.module.css";
import styles from "./TextArea.module.css";
import { mergeStrings } from "@lib";

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
