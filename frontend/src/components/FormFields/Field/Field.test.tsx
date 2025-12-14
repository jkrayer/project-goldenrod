import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Field } from "./Field";
import { useFieldContext } from "./FieldContext";

// Mock child component to test context values
function TestChild() {
  const context = useFieldContext();
  return (
    <div data-testid="test-child">
      <span data-testid="context-id">{context.id}</span>
      <span data-testid="context-error-id">{context.errorId}</span>
      <span data-testid="context-label-id">{context.labelId}</span>
      <span data-testid="context-required">{String(context.required)}</span>
      <span data-testid="context-disabled">{String(context.disabled)}</span>
      <span data-testid="context-has-error">{String(context.hasError)}</span>
    </div>
  );
}

describe("Field", () => {
  it("renders children", () => {
    render(
      <Field id="test-field">
        <div data-testid="child">Child content</div>
      </Field>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("provides correct context values with default props", () => {
    render(
      <Field id="test-field">
        <TestChild />
      </Field>,
    );

    expect(screen.getByTestId("context-id")).toHaveTextContent("test-field");
    expect(screen.getByTestId("context-label-id")).toHaveTextContent(
      "test-field-label",
    );
    expect(screen.getByTestId("context-error-id")).toHaveTextContent("");
    expect(screen.getByTestId("context-required")).toHaveTextContent("false");
    expect(screen.getByTestId("context-disabled")).toHaveTextContent("false");
    expect(screen.getByTestId("context-has-error")).toHaveTextContent("false");
  });

  it("provides error ID when hasError is true", () => {
    render(
      <Field id="test-field" hasError>
        <TestChild />
      </Field>,
    );

    expect(screen.getByTestId("context-error-id")).toHaveTextContent(
      "test-field-error",
    );
    expect(screen.getByTestId("context-has-error")).toHaveTextContent("true");
  });

  it("provides required state when required is true", () => {
    render(
      <Field id="test-field" required>
        <TestChild />
      </Field>,
    );

    expect(screen.getByTestId("context-required")).toHaveTextContent("true");
  });

  it("provides disabled state when disabled is true", () => {
    render(
      <Field id="test-field" disabled>
        <TestChild />
      </Field>,
    );

    expect(screen.getByTestId("context-disabled")).toHaveTextContent("true");
  });

  it("has correct displayName", () => {
    expect(Field.displayName).toBe("Field");
  });
});
