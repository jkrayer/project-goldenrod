import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../index";

const meta = {
  title: "FormFields/Input",
  component: Field.Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    "aria-describedby": {
      control: "text",
      description: "Additional ARIA describedby IDs",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field.Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "text",
  },
  render: () => (
    <Field.Root id="name">
      <Field.Label>Name</Field.Label>
      <Field.Input type="text" placeholder="Enter your name here..." />
    </Field.Root>
  ),
};

export const WithError: Story = {
  args: {
    type: "email",
  },
  render: () => (
    <Field.Root id="email" hasError>
      <Field.Label>Email</Field.Label>
      <Field.Input type="email" placeholder="Enter your email here..." />
      <Field.Error>Email must be a valid email address</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: {
    type: "text",
  },

  render: () => (
    <Field.Root id="name" disabled>
      <Field.Label>Name</Field.Label>
      <Field.Input
        type="text"
        placeholder="This field is disabled"
        defaultValue="This content cannot be edited"
      />
    </Field.Root>
  ),
};

export const Required: Story = {
  args: {
    type: "text",
  },

  render: () => (
    <Field.Root id="name" required>
      <Field.Label>Name</Field.Label>
      <Field.Input type="text" placeholder="Enter your name..." />
    </Field.Root>
  ),
};
