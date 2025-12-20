import { forwardRef } from "react";
import type { ButtonProps } from "./ButtonTypes";
import styles from "./Button.module.css";
import { useOptionalFormContext } from "../Form/FormContext";

/**
 * A flexible button component that integrates with form context and supports loading states.
 *
 * @component
 * @example
 * ```tsx
 * <Button type="submit" isLoading={true}>
 *   Submit
 * </Button>
 * ```
 *
 * @param {ButtonProps} props - The button props
 * @param {React.ReactNode} props.children - The content to be rendered inside the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.isLoading=false] - Whether the button is in a loading state
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The button type attribute
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref to the button element
 *
 * @remarks
 * - Automatically integrates with form context to inherit loading and disabled states
 * - Shows a spinner when loading (either from prop or form context for submit buttons)
 * - The button is disabled when loading, explicitly disabled, or when the parent form is disabled/loading
 *
 * @returns {JSX.Element} A button element with optional loading spinner
 *
 * @since 0.1.0
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled = false,
      isLoading = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    // Form Context?
    const { isLoading: formIsLoading, isDisabled: formIsDisabled } =
      useOptionalFormContext();

    // Handle disabled state for anchors
    const isDisabled = formIsLoading || formIsDisabled || disabled || isLoading;
    const showLoading = (formIsLoading && type === "submit") || isLoading;

    // ${coreStyles.btn}
    return (
      <button
        {...props}
        className={`${styles.button}`}
        disabled={isDisabled}
        ref={ref}
        type={type}
      >
        {showLoading && <span className={styles.buttonSpinner} />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
