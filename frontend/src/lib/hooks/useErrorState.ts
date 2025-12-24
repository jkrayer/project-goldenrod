import { useCallback, useMemo, useState } from "react";
import { object, type AnyObject, type ValidationError } from "yup";

type ErrorObject<T> = Partial<Record<keyof T, string>>;

type UseErrorStateReturn<T> = {
  errors: ErrorObject<T>;
  handleBlur: (k: string) => () => void;
  onBeforeSubmit: () => Promise<T>;
  isFormValid: boolean;
};

const getError = (error: Required<ValidationError>): ErrorObject<unknown> => ({
  [error.path]: error.message,
});

const getAllErrors = <T>(
  error: Required<ValidationError>,
): ErrorObject<unknown> => {
  const es: ValidationError[] = error.inner;

  return es.reduce<ErrorObject<T>>((acc, err) => {
    if (err.path !== undefined) {
      acc[err.path as keyof T] = err.message;
    }

    return acc;
  }, {});
};

/**
 * A React hook for managing form validation errors using Yup schemas.
 *
 * @template T - The type of the form state object, must extend AnyObject
 * @param {T} state - The current form state to validate
 * @param {ReturnType<typeof object<T>>} validation - A Yup validation schema for the form state
 *
 * @returns {UseErrorStateReturn<T>} An object containing:
 *   - `errors`: An object mapping field keys to their error messages
 *   - `handleBlur`: A function that returns a blur handler for a specific field, triggers field-level validation
 *   - `onBeforeSubmit`: A function that validates the entire form and populates all errors
 *   - `isFormValid`: A boolean indicating whether the form has any validation errors
 *
 * @example
 * ```typescript
 * const schema = object({
 *   email: string().email().required(),
 *   password: string().min(8).required()
 * });
 *
 * const [formState, setFormState] = useState({ email: '', password: '' });
 * const { errors, handleBlur, onBeforeSubmit, isFormValid } = useErrorState(formState, schema);
 *
 * <input
 *   type="email"
 *   onBlur={handleBlur('email')}
 *   value={formState.email}
 * />
 * {errors.email && <span>{errors.email}</span>}
 * ```
 */
export function useErrorState<T extends AnyObject>(
  state: T,
  validation: ReturnType<typeof object<T>>,
): UseErrorStateReturn<T> {
  const [errors, setErrors] = useState<ErrorObject<T>>({});

  //   HELPERS
  const setE = useCallback(
    (err: ErrorObject<T>) => setErrors((old) => ({ ...old, ...err })),
    [setErrors],
  );

  const clearError = useCallback(
    (key: keyof T) => setErrors((old) => ({ ...old, [key]: "" })),
    [setErrors],
  );

  //  CALCULATED
  const isFormValid = useMemo<boolean>(() => {
    return Object.values(errors).every((e) => e === "");
  }, [errors]);

  // HANDLERS
  const handleBlur = useCallback(
    (key: string) => () => {
      validation
        .validateAt(key, state)
        .then(() => clearError(key))
        .catch((e: Required<ValidationError>) => setE(getError(e)));
    },
    [clearError, state, setE, validation],
  );

  const onBeforeSubmit = useCallback<() => Promise<T>>(
    () =>
      validation
        .validate(state, {
          strict: false,
          abortEarly: false,
          stripUnknown: false,
          recursive: true,
        })
        .then((validState) => {
          setErrors({});
          return validState as T;
        })
        .catch((e: Required<ValidationError>) => {
          setE(getAllErrors<T>(e));
          throw e;
        }),
    [state, setE, validation],
  );

  return { errors, handleBlur, onBeforeSubmit, isFormValid };
}
