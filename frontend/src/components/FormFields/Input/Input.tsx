import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { type InputProps } from "./InputTypes";
import styles from "./Input.module.css";
import { useFieldContext } from "../Field/FieldContext";
import { useFormContext } from "../../Form/FormContext";
import { mergeStrings } from "@lib";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ "aria-describedby": ariaDescribedByProp, type, value, ...props }, ref) => {
    // Expose the input ref to the parent component
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
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

    // Need to memoize for suffix memo
    const disabled = useMemo<boolean>(
      () => !!formIsDisabled || !!formIsLoading || !!fieldContext?.disabled,
      [fieldContext?.disabled, formIsDisabled, formIsLoading],
    );

    return (
      <input
        aria-describedby={ariaDescribedBy}
        aria-invalid={fieldContext?.hasError}
        aria-labelledby={fieldContext?.labelId}
        className={styles.input}
        disabled={disabled}
        id={fieldContext.id}
        ref={inputRef}
        type={type as string}
        value={value}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
