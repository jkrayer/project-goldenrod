import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";
import { FormContext } from "../Form/FormContext";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("has button type by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("accepts custom type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows spinner when isLoading is true", () => {
    const { container } = render(<Button isLoading>Click me</Button>);
    expect(container.querySelector(".buttonSpinner")).toBeInTheDocument();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("inherits disabled state from form context", () => {
    render(
      <FormContext.Provider value={{ isLoading: false, isDisabled: true }}>
        <Button>Click me</Button>
      </FormContext.Provider>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows spinner for submit button when form is loading", () => {
    const { container } = render(
      <FormContext.Provider value={{ isLoading: true, isDisabled: false }}>
        <Button type="submit">Submit</Button>
      </FormContext.Provider>,
    );
    expect(container.querySelector(".buttonSpinner")).toBeInTheDocument();
  });

  it("does not show spinner for non-submit button when form is loading", () => {
    const { container } = render(
      <FormContext.Provider value={{ isLoading: true, isDisabled: false }}>
        <Button type="button">Click me</Button>
      </FormContext.Provider>,
    );
    expect(container.querySelector(".buttonSpinner")).not.toBeInTheDocument();
  });

  it("is disabled when form is loading", () => {
    render(
      <FormContext.Provider value={{ isLoading: true, isDisabled: false }}>
        <Button>Click me</Button>
      </FormContext.Provider>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Click me</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("passes through additional props", () => {
    render(<Button data-testid="custom-button">Click me</Button>);
    expect(screen.getByTestId("custom-button")).toBeInTheDocument();
  });
});
