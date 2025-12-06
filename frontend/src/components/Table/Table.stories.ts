import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./Table";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

const meta = {
  title: "Components/Table",
  component: Table<User, "id">,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: "object",
      description: "Array of column definitions with key and label properties",
    },
    rows: {
      control: "object",
      description: "Array of data objects to display in the table",
    },
    rowId: {
      control: "text",
      description: "The property name to use as the unique row key",
    },
  },
} satisfies Meta<typeof Table<User, "id">>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "role" as const, label: "Role" },
  { key: "status" as const, label: "Status" },
];

const userData: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "User",
    status: "Inactive",
  },
];

export const Default: Story = {
  args: {
    cols: columns,
    rows: userData,
    rowId: "id",
  },
};

export const SingleRow: Story = {
  args: {
    cols: columns,
    rows: [userData[0]],
    rowId: "id",
  },
};

export const EmptyTable: Story = {
  args: {
    cols: columns,
    rows: [],
    rowId: "id",
  },
};

export const MinimalColumns: Story = {
  args: {
    cols: [
      { key: "name" as const, label: "Name" },
      { key: "email" as const, label: "Email" },
    ],
    rows: userData,
    rowId: "id",
  },
};

export const LargeDataset: Story = {
  args: {
    cols: columns,
    rows: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? "Admin" : "User",
      status: i % 2 === 0 ? "Active" : "Inactive",
    })),
    rowId: "id",
  },
};
