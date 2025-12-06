import { forwardRef } from "react";
import type { ButtonProps } from "./ButtonTypes";
import styles from "./Button.module.css";
import coreStyles from "../Buttons.module.css";
import { useOptionalFormContext } from "../Form/FormContext";

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

    return (
      <button
        {...props}
        className={`${coreStyles.btn} ${styles.button}`}
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
