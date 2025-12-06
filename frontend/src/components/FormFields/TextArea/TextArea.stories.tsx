import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../index";

const meta = {
  title: "FormFields/TextArea",
  component: Field.TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    rows: {
      control: "number",
      description: "Number of visible text rows",
    },
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
} satisfies Meta<typeof Field.TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field.Root id="description">
      <Field.Label>Description</Field.Label>
      <Field.TextArea placeholder="Enter your description here..." />
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root id="bio" hasError>
      <Field.Label>Bio</Field.Label>
      <Field.TextArea placeholder="Tell us about yourself..." />
      <Field.Error>Bio must be at least 50 characters</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root id="notes" disabled>
      <Field.Label>Notes</Field.Label>
      <Field.TextArea
        placeholder="This field is disabled"
        defaultValue="This content cannot be edited"
      />
    </Field.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <Field.Root id="feedback" required>
      <Field.Label>Feedback</Field.Label>
      <Field.TextArea placeholder="Your feedback is required..." />
    </Field.Root>
  ),
};

export const CustomRows: Story = {
  render: () => (
    <Field.Root id="comments">
      <Field.Label>Comments</Field.Label>
      <Field.TextArea rows={8} placeholder="Enter longer content here..." />
    </Field.Root>
  ),
};
