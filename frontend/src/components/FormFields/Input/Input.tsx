import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { type InputProps } from "./InputTypes";
import styles from "./Input.module.css";
import { useFieldContext } from "../Field/FieldContext";
import { useFormContext } from "../../Form/FormContext";
import { mergeStrings } from "@lib";

/**
 * A form input component that integrates with Field and Form contexts.
 *
 * @remarks
 * This component automatically connects to parent Field and Form contexts to:
 * - Manage disabled states based on form loading/disabled states
 * - Handle error states and ARIA attributes
 * - Associate with labels and error messages
 *
 * The component forwards refs to the underlying input element and merges
 * ARIA attributes from both props and context.
 *
 * @param props - Input props including standard HTML input attributes
 * @param props.aria-describedby - Optional ARIA describedby attribute (merged with error IDs from context)
 * @param props.type - Input type (text, password, email, etc.)
 * @param props.value - Controlled input value
 * @param ref - Forwarded ref to the underlying input element
 *
 * @since 0.1.0
 *
 * @example
 * ```tsx
 * <Field.Root id="username">
 *   <Field.Label>Username</Field.Label>
 *   <Field.Input type="text" value={username} onChange={handleChange} />
 *   <Field.Error>Error Message</Field.Error>
 * </Field.Root>
 * ```
 */
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
