import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../../index";

const meta = {
  title: "FormFields/Label",
  component: Field.Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The content to display inside the label",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field.Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field.Root id="username">
      <Field.Label>Username</Field.Label>
      <Field.Input type="text" placeholder="Enter username" />
    </Field.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <Field.Root id="email" required>
      <Field.Label>Email Address</Field.Label>
      <Field.Input type="email" placeholder="Enter email" />
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root id="password" hasError>
      <Field.Label>Password</Field.Label>
      <Field.Input type="password" placeholder="Enter password" />
      <Field.Error>Password must be at least 8 characters</Field.Error>
    </Field.Root>
  ),
};

export const RequiredWithError: Story = {
  render: () => (
    <Field.Root id="confirmPassword" required hasError>
      <Field.Label>Confirm Password</Field.Label>
      <Field.Input type="password" placeholder="Confirm password" />
      <Field.Error>Passwords do not match</Field.Error>
    </Field.Root>
  ),
};

export const MultipleFields: Story = {
  render: () => (
    <>
      <Field.Root id="firstName" required>
        <Field.Label>First Name</Field.Label>
        <Field.Input type="text" placeholder="John" />
      </Field.Root>
      <Field.Root id="lastName" required>
        <Field.Label>Last Name</Field.Label>
        <Field.Input type="text" placeholder="Doe" />
      </Field.Root>
      <Field.Root id="phone">
        <Field.Label>Phone Number</Field.Label>
        <Field.Input type="tel" placeholder="(555) 123-4567" />
      </Field.Root>
    </>
  ),
};

export const WithTextArea: Story = {
  render: () => (
    <Field.Root id="bio" required>
      <Field.Label>Biography</Field.Label>
      <Field.TextArea rows={5} placeholder="Tell us about yourself..." />
    </Field.Root>
  ),
};

export const DisabledField: Story = {
  render: () => (
    <Field.Root id="disabled" disabled>
      <Field.Label>Disabled Field</Field.Label>
      <Field.Input type="text" placeholder="This field is disabled" />
    </Field.Root>
  ),
};

export const LongLabelText: Story = {
  render: () => (
    <Field.Root id="long" required>
      <Field.Label>
        This is a very long label that explains in detail what this field is for
        and why it's important
      </Field.Label>
      <Field.Input type="text" placeholder="Enter value" />
    </Field.Root>
  ),
};
