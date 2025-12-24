import { object, string, number } from "yup";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useErrorState } from "./useErrorState";

describe("useErrorState", () => {
  const schema = object({
    email: string().email("Invalid email").required("Email is required"),
    password: string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    age: number().positive("Age must be positive").required("Age is required"),
  });

  type FormState = {
    email: string;
    password: string;
    age: number;
  };

  let initialState: FormState;

  beforeEach(() => {
    initialState = {
      email: "",
      password: "",
      age: 0,
    };
  });

  it("should initialize with empty errors", () => {
    const { result } = renderHook(() => useErrorState(initialState, schema));

    expect(result.current.errors).toEqual({});
  });

  it("should initialize with isFormValid as true when no errors", () => {
    const { result } = renderHook(() => useErrorState(initialState, schema));

    expect(result.current.isFormValid).toBe(true);
  });

  it("should validate field on blur and set error for invalid value", async () => {
    const { result } = renderHook(() =>
      useErrorState({ ...initialState, email: "invalid" }, schema),
    );

    await act(async () => {
      result.current.handleBlur("email")();
    });

    await waitFor(() => {
      expect(result.current.errors.email).toBe("Invalid email");
    });
  });

  it("should clear error on blur when field becomes valid", async () => {
    const { result, rerender } = renderHook(
      ({ state }) => useErrorState(state, schema),
      { initialProps: { state: { ...initialState, email: "invalid" } } },
    );

    await act(async () => {
      result.current.handleBlur("email")();
    });

    await waitFor(() => {
      expect(result.current.errors.email).toBe("Invalid email");
    });

    rerender({ state: { ...initialState, email: "valid@email.com" } });

    await act(async () => {
      result.current.handleBlur("email")();
    });

    await waitFor(() => {
      expect(result.current.errors.email).toBe("");
    });
  });

  it("should validate all fields on onBeforeSubmit and return validated state", async () => {
    const validState: FormState = {
      email: "test@example.com",
      password: "password123",
      age: 25,
    };

    const { result } = renderHook(() => useErrorState(validState, schema));

    let validatedState: FormState | undefined;

    await act(async () => {
      validatedState = await result.current.onBeforeSubmit();
    });

    expect(validatedState).toEqual(validState);
    expect(result.current.errors).toEqual({});
  });

  it("should set all errors on onBeforeSubmit when form is invalid", async () => {
    const { result } = renderHook(() => useErrorState(initialState, schema));

    await act(async () => {
      try {
        await result.current.onBeforeSubmit();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.errors.email).toBe("Email is required");
      expect(result.current.errors.password).toBe("Password is required");
      expect(result.current.errors.age).toBeDefined();
    });
  });

  it("should update isFormValid based on errors", async () => {
    const { result } = renderHook(() => useErrorState(initialState, schema));

    expect(result.current.isFormValid).toBe(true);

    await act(async () => {
      result.current.handleBlur("email")();
    });

    await waitFor(() => {
      expect(result.current.isFormValid).toBe(false);
    });
  });

  it("should handle multiple field validations independently", async () => {
    const { result } = renderHook(() =>
      useErrorState({ email: "invalid", password: "short", age: 25 }, schema),
    );

    await act(async () => {
      result.current.handleBlur("email")();
      result.current.handleBlur("password")();
    });

    await waitFor(() => {
      expect(result.current.errors.email).toBe("Invalid email");
      expect(result.current.errors.password).toBe(
        "Password must be at least 8 characters",
      );
      expect(result.current.errors.age).toBeUndefined();
    });
  });

  it("should throw validation error on onBeforeSubmit when invalid", async () => {
    const { result } = renderHook(() => useErrorState(initialState, schema));

    await expect(
      act(async () => {
        await result.current.onBeforeSubmit();
      }),
    ).rejects.toThrow();
  });
});
