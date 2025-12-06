import { forwardRef, useImperativeHandle, useRef } from "react";
import { FormContext } from "./FormContext";
import { type FormProps } from "./FormTypes";

export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    { children, isDisabled = false, isLoading = false, onSubmit, ...props },
    ref,
  ) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle<HTMLFormElement | null, HTMLFormElement | null>(
      ref,
      () => formRef.current,
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(event);
    };

    return (
      <FormContext.Provider value={{ isDisabled, isLoading }}>
        <form ref={formRef} onSubmit={handleSubmit} {...props}>
          {children}
        </form>
      </FormContext.Provider>
    );
  },
);

Form.displayName = "Form";
