import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./Label";
import {
  useFieldContext,
  type FieldContextValue,
} from "../../Field/FieldContext";

vi.mock("../../Field/FieldContext", () => ({
  useFieldContext: vi.fn(),
}));

describe("Label", () => {
  const mockUseFieldContext = vi.mocked(useFieldContext);

  it("renders label with children", () => {
    mockUseFieldContext.mockReturnValue({
      id: "test-field",
      labelId: "test-label",
      required: false,
    } as FieldContextValue);

    render(<Label>Username</Label>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("applies correct htmlFor and id attributes from context", () => {
    mockUseFieldContext.mockReturnValue({
      id: "test-field",
      labelId: "test-label",
      required: false,
    } as FieldContextValue);

    render(<Label>Email</Label>);
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", "test-field");
    expect(label).toHaveAttribute("id", "test-label");
  });

  it("displays required indicator when field is required", () => {
    mockUseFieldContext.mockReturnValue({
      id: "test-field",
      labelId: "test-label",
      required: true,
    } as FieldContextValue);

    render(<Label>Password</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not display required indicator when field is not required", () => {
    mockUseFieldContext.mockReturnValue({
      id: "test-field",
      labelId: "test-label",
      required: false,
    } as FieldContextValue);

    render(<Label>Optional Field</Label>);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("passes additional props to label element", () => {
    mockUseFieldContext.mockReturnValue({
      id: "test-field",
      labelId: "test-label",
      required: false,
    } as FieldContextValue);

    render(<Label data-testid="custom-label">Test</Label>);
    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });

  it("has correct displayName", () => {
    expect(Label.displayName).toBe("Label");
  });
});
