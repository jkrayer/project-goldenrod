import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { TextArea } from "./TextArea";
import { Field } from "../Field/Field";
import { Form } from "../../Form/Form";

describe("TextArea", () => {
  it("renders a textarea element", () => {
    render(<TextArea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("applies default rows attribute", () => {
    render(<TextArea />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "3");
  });

  it("applies custom rows attribute", () => {
    render(<TextArea rows={5} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
  });

  it("forwards ref to textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("applies additional props to textarea", () => {
    render(<TextArea placeholder="Enter text" data-testid="custom-textarea" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("placeholder", "Enter text");
    expect(textarea).toHaveAttribute("data-testid", "custom-textarea");
  });

  it("integrates with FieldContext", () => {
    const fieldContext = {
      id: "field-id",
      labelId: "label-id",
      errorId: "error-id",
      hasError: true,
      disabled: false,
    };

    render(
      <Field {...fieldContext}>
        <TextArea />
      </Field>,
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("id", "field-id");
    expect(textarea).toHaveAttribute("aria-labelledby", "label-id");
    expect(textarea).toHaveAttribute("aria-describedby", "error-id");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("merges aria-describedby with error ID from context", () => {
    const fieldContext = {
      id: "field-id",
      labelId: "label-id",
      errorId: "error-id",
      hasError: true,
      disabled: false,
    };

    render(
      <Field {...fieldContext}>
        <TextArea aria-describedby="custom-description" />
      </Field>,
    );

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "custom-description error-id",
    );
  });

  it("disables textarea when FormContext isDisabled is true", () => {
    const formContext = {
      isDisabled: true,
      isLoading: false,
      onSubmit: () => {},
    };

    render(
      <Form {...formContext}>
        <TextArea />
      </Form>,
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("disables textarea when FormContext isLoading is true", () => {
    const formContext = {
      isDisabled: false,
      isLoading: true,
      onSubmit: () => {},
    };

    render(
      <Form {...formContext}>
        <TextArea />
      </Form>,
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("disables textarea when FieldContext disabled is true", () => {
    const fieldContext = {
      id: "field-id",
      labelId: "label-id",
      errorId: "error-id",
      hasError: false,
      disabled: true,
    };

    render(
      <Field {...fieldContext}>
        <TextArea />
      </Field>,
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("works without any context providers", () => {
    render(<TextArea placeholder="Standalone textarea" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", "Standalone textarea");
  });

  it("sets aria-invalid to false when no error", () => {
    const fieldContext = {
      id: "field-id",
      labelId: "label-id",
      errorId: "error-id",
      hasError: false,
      disabled: false,
    };

    render(
      <Field {...fieldContext}>
        <TextArea />
      </Field>,
    );

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });
});
