import type { Meta, StoryObj } from "@storybook/react-vite";
import fn from "@storybook/addon-vitest";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "The button type attribute",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the button shows a loading spinner",
    },
    children: {
      control: "text",
      description: "The content to be rendered inside the button",
    },
  },
  // @ts-expect-error test function
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    type: "button",
  },
};

export const Submit: Story = {
  args: {
    children: "Submit",
    type: "submit",
  },
};

export const Reset: Story = {
  args: {
    children: "Reset",
    type: "reset",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true,
  },
};

export const LoadingSubmit: Story = {
  args: {
    children: "Submitting...",
    type: "submit",
    isLoading: true,
  },
};

export const LongText: Story = {
  args: {
    children: "Button with Really Long Text Content",
  },
};
