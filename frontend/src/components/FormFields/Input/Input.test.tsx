import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";
import { Field } from "../Field/Field";
import { Form } from "../../Form/Form";
import { createRef } from "react";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input type="text" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("forwards ref to input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} type="text" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies type attribute", () => {
    render(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("applies value attribute", () => {
    render(<Input type="text" value="test value" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("test value");
  });

  it("merges aria-describedby from props", () => {
    render(<Input type="text" aria-describedby="custom-id" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "custom-id",
    );
  });

  it("applies field context id", () => {
    const fieldContext = {
      id: "field-123",
      labelId: "label-123",
      errorId: "error-123",
      hasError: false,
      disabled: false,
    };
    render(
      <Field {...fieldContext}>
        <Input type="text" />
      </Field>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "field-123");
  });

  it("applies aria-labelledby from field context", () => {
    const fieldContext = {
      id: "field-123",
      labelId: "label-123",
      errorId: "error-123",
      hasError: false,
      disabled: false,
    };
    render(
      <Field {...fieldContext}>
        <Input type="text" />
      </Field>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-labelledby",
      "label-123",
    );
  });

  it("sets aria-invalid when field has error", () => {
    const fieldContext = {
      id: "field-123",
      labelId: "label-123",
      errorId: "error-123",
      hasError: true,
      disabled: false,
    };
    render(
      <Field {...fieldContext}>
        <Input type="text" />
      </Field>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("merges error id into aria-describedby when field has error", () => {
    const fieldContext = {
      id: "field-123",
      labelId: "label-123",
      errorId: "error-123",
      hasError: true,
      disabled: false,
    };
    render(
      <Field {...fieldContext}>
        <Input type="text" aria-describedby="custom-id" />
      </Field>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "custom-id error-123",
    );
  });

  it("disables input when form is disabled", () => {
    const formContext = {
      isDisabled: true,
      isLoading: false,
      onSubmit: () => {},
    };
    render(
      <Form {...formContext}>
        <Input type="text" />
      </Form>,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("disables input when form is loading", () => {
    const formContext = {
      isDisabled: false,
      isLoading: true,
      onSubmit: () => {},
    };
    render(
      <Form {...formContext}>
        <Input type="text" />
      </Form>,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("disables input when field is disabled", () => {
    const fieldContext = {
      id: "field-123",
      labelId: "label-123",
      errorId: "error-123",
      hasError: false,
      disabled: true,
    };
    render(
      <Field {...fieldContext}>
        <Input type="text" />
      </Field>,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("passes through additional props", () => {
    render(
      <Input type="text" placeholder="Enter text" data-testid="custom-input" />,
    );
    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("placeholder", "Enter text");
  });
});
