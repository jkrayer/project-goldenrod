import type { Meta, StoryObj } from "@storybook/react-vite";
import fn from "@storybook/addon-vitest";
import { Form } from "./Form";
import { Field } from "../FormFields";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isDisabled: {
      control: "boolean",
      description: "Whether form controls should be disabled",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the form is in a loading state",
    },
    onSubmit: {
      description: "Callback function invoked when form is submitted",
    },
  },
  // @ts-expect-error test function
  args: { onSubmit: fn() },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Field.Root id="username">
          <Field.Label>Username</Field.Label>
          <Field.Input type="text" />
        </Field.Root>
        <Field.Root id="password">
          <Field.Label>Password</Field.Label>
          <Field.Input type="password" />
        </Field.Root>
        <Button type="submit">Submit</Button>
      </>
    ),
  },
};

export const WithErrors: Story = {
  args: {
    children: (
      <>
        <Field.Root id="email" hasError>
          <Field.Label>Email</Field.Label>
          <Field.Input type="email" />
          <Field.Error>Please enter a valid email address</Field.Error>
        </Field.Root>
        <Field.Root id="password" hasError>
          <Field.Label>Password</Field.Label>
          <Field.Input type="password" />
          <Field.Error>Password must be at least 8 characters</Field.Error>
        </Field.Root>
        <Button type="submit">Submit</Button>
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: (
      <>
        <Field.Root id="username">
          <Field.Label>Username</Field.Label>
          <Field.Input type="text" />
        </Field.Root>
        <Field.Root id="password">
          <Field.Label>Password</Field.Label>
          <Field.Input type="password" />
        </Field.Root>
        <Button type="submit">Submitting...</Button>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: (
      <>
        <Field.Root id="username">
          <Field.Label>Username</Field.Label>
          <Field.Input type="text" />
        </Field.Root>
        <Field.Root id="password">
          <Field.Label>Password</Field.Label>
          <Field.Input type="password" />
        </Field.Root>
        <Button type="submit">Submit</Button>
      </>
    ),
  },
};

export const RequiredFields: Story = {
  args: {
    children: (
      <>
        <Field.Root id="firstName" required>
          <Field.Label>First Name</Field.Label>
          <Field.Input type="text" />
        </Field.Root>
        <Field.Root id="lastName" required>
          <Field.Label>Last Name</Field.Label>
          <Field.Input type="text" />
        </Field.Root>
        <Field.Root id="email" required>
          <Field.Label>Email</Field.Label>
          <Field.Input type="email" />
        </Field.Root>
        <Button type="submit">Submit</Button>
      </>
    ),
  },
};
