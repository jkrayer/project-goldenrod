import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../../index";

const meta = {
  title: "FormFields/Error",
  component: Field.Error,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The error message content to display",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field.Error>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field.Root id="username" hasError>
      <Field.Label>Username</Field.Label>
      <Field.Input type="text" placeholder="Enter username" />
      <Field.Error>Username is required</Field.Error>
    </Field.Root>
  ),
};

export const ValidationError: Story = {
  render: () => (
    <Field.Root id="email" hasError>
      <Field.Label>Email</Field.Label>
      <Field.Input type="email" placeholder="Enter email" />
      <Field.Error>Please enter a valid email address</Field.Error>
    </Field.Root>
  ),
};

export const PasswordError: Story = {
  render: () => (
    <Field.Root id="password" hasError required>
      <Field.Label>Password</Field.Label>
      <Field.Input type="password" placeholder="Enter password" />
      <Field.Error>Password must be at least 8 characters long</Field.Error>
    </Field.Root>
  ),
};

export const LongErrorMessage: Story = {
  render: () => (
    <Field.Root id="terms" hasError>
      <Field.Label>Terms and Conditions</Field.Label>
      <Field.TextArea rows={3} placeholder="Enter terms" />
      <Field.Error>
        You must accept the terms and conditions to continue. Please read them
        carefully and check the box below to indicate your agreement.
      </Field.Error>
    </Field.Root>
  ),
};

export const MultipleFieldsWithErrors: Story = {
  render: () => (
    <>
      <Field.Root id="firstName" hasError required>
        <Field.Label>First Name</Field.Label>
        <Field.Input type="text" placeholder="John" />
        <Field.Error>First name is required</Field.Error>
      </Field.Root>
      <Field.Root id="lastName" hasError required>
        <Field.Label>Last Name</Field.Label>
        <Field.Input type="text" placeholder="Doe" />
        <Field.Error>Last name is required</Field.Error>
      </Field.Root>
      <Field.Root id="email" hasError required>
        <Field.Label>Email</Field.Label>
        <Field.Input type="email" placeholder="john@example.com" />
        <Field.Error>Email format is invalid</Field.Error>
      </Field.Root>
    </>
  ),
};

export const NoError: Story = {
  render: () => (
    <Field.Root id="username">
      <Field.Label>Username</Field.Label>
      <Field.Input type="text" placeholder="Enter username" />
      <Field.Error>This error will not be displayed</Field.Error>
    </Field.Root>
  ),
};

export const WithTextArea: Story = {
  render: () => (
    <Field.Root id="bio" hasError required>
      <Field.Label>Biography</Field.Label>
      <Field.TextArea rows={5} placeholder="Tell us about yourself..." />
      <Field.Error>Biography must be at least 50 characters</Field.Error>
    </Field.Root>
  ),
};

export const CustomErrorMessages: Story = {
  render: () => (
    <>
      <Field.Root id="age" hasError>
        <Field.Label>Age</Field.Label>
        <Field.Input type="number" placeholder="Enter your age" />
        <Field.Error>Age must be between 18 and 120</Field.Error>
      </Field.Root>
      <Field.Root id="phone" hasError>
        <Field.Label>Phone Number</Field.Label>
        <Field.Input type="tel" placeholder="(555) 123-4567" />
        <Field.Error>Phone number format: (XXX) XXX-XXXX</Field.Error>
      </Field.Root>
    </>
  ),
};
