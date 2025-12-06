import type { FormHTMLAttributes, FormEventHandler } from "react";

export type FormProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> & {
  isDisabled?: boolean;
  isLoading?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};
