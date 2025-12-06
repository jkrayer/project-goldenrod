import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Form } from "./Form";
import { useFormContext } from "./FormContext";

// Mock component to test context values
const TestContextConsumer = () => {
  const { isDisabled, isLoading } = useFormContext();
  return (
    <div>
      <span data-testid="is-disabled">{String(isDisabled)}</span>
      <span data-testid="is-loading">{String(isLoading)}</span>
    </div>
  );
};

describe("Form", () => {
  it("renders children correctly", () => {
    render(
      <Form onSubmit={vi.fn()}>
        <div>Test Content</div>
      </Form>,
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.submit(screen.getByRole("button"));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("prevents default form submission", () => {
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>,
    );

    const event = fireEvent.submit(screen.getByRole("button"));
    expect(event).toBe(false); // preventDefault was called
  });

  it("provides isDisabled=false by default in context", () => {
    render(
      <Form onSubmit={vi.fn()}>
        <TestContextConsumer />
      </Form>,
    );
    expect(screen.getByTestId("is-disabled")).toHaveTextContent("false");
  });

  it("provides isLoading=false by default in context", () => {
    render(
      <Form onSubmit={vi.fn()}>
        <TestContextConsumer />
      </Form>,
    );
    expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
  });

  it("provides isDisabled=true when prop is set", () => {
    render(
      <Form onSubmit={vi.fn()} isDisabled={true}>
        <TestContextConsumer />
      </Form>,
    );
    expect(screen.getByTestId("is-disabled")).toHaveTextContent("true");
  });

  it("provides isLoading=true when prop is set", () => {
    render(
      <Form onSubmit={vi.fn()} isLoading={true}>
        <TestContextConsumer />
      </Form>,
    );
    expect(screen.getByTestId("is-loading")).toHaveTextContent("true");
  });

  it("forwards ref to form element", () => {
    const ref = vi.fn();
    render(
      <Form ref={ref} onSubmit={vi.fn()}>
        <div>Content</div>
      </Form>,
    );
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLFormElement);
  });

  it("passes additional props to form element", () => {
    render(
      <Form onSubmit={vi.fn()} data-testid="custom-form" className="test-class">
        <div>Content</div>
      </Form>,
    );
    const form = screen.getByTestId("custom-form");
    expect(form).toHaveClass("test-class");
  });
});
