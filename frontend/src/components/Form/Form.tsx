import { forwardRef, useImperativeHandle, useRef } from "react";
import { FormContext } from "./FormContext";
import { type FormProps } from "./FormTypes";

/**
 * A form component that wraps native HTML form elements with additional context and functionality.
 *
 * @component
 * @example
 * ```tsx
 * <Form onSubmit={handleSubmit} isLoading={isSubmitting}>
 *   <FormField />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 *
 * @param {FormProps} props - The component props
 * @param {React.ReactNode} props.children - Child elements to render within the form
 * @param {boolean} [props.isDisabled=false] - Whether form controls should be disabled
 * @param {boolean} [props.isLoading=false] - Whether the form is in a loading state
 * @param {(event: React.FormEvent<HTMLFormElement>) => void} props.onSubmit - Callback function invoked when form is submitted
 * @param {React.Ref<HTMLFormElement>} ref - Forwarded ref to the underlying form element
 *
 * @returns {JSX.Element} A form element wrapped with FormContext provider
 *
 * @since 0.1.0
 */
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
