import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Error } from "./Error";
import {
  useFieldContext,
  type FieldContextValue,
} from "../../Field/FieldContext";

vi.mock("../../Field/FieldContext", () => ({
  useFieldContext: vi.fn(),
}));

describe("Error", () => {
  it("renders error message when hasError is true", () => {
    vi.mocked(useFieldContext).mockReturnValue({
      hasError: true,
      errorId: "test-error-id",
    } as FieldContextValue);

    render(<Error>This field is required</Error>);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("This field is required");
    expect(errorElement).toHaveAttribute("id", "test-error-id");
    expect(errorElement).toHaveAttribute("aria-live", "polite");
  });

  it("does not render when hasError is false", () => {
    vi.mocked(useFieldContext).mockReturnValue({
      hasError: false,
      errorId: "test-error-id",
    } as FieldContextValue);
    const { container } = render(<Error>This field is required</Error>);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    vi.mocked(useFieldContext).mockReturnValue({
      hasError: true,
      errorId: "test-error-id",
    } as FieldContextValue);

    render(<Error>Error message</Error>);

    const errorElement = screen.getByRole("alert");
    expect(errorElement.className).toContain("label");
    expect(errorElement.className).toContain("labelError");
  });

  it("forwards additional props to the div element", () => {
    vi.mocked(useFieldContext).mockReturnValue({
      hasError: true,
      errorId: "test-error-id",
    } as FieldContextValue);
    render(<Error data-testid="custom-error">Error message</Error>);

    const errorElement = screen.getByTestId("custom-error");
    expect(errorElement).toBeInTheDocument();
  });

  it("has correct displayName", () => {
    expect(Error.displayName).toBe("Error");
  });
});
