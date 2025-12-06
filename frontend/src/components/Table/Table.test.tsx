import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { Table, type TableColumn } from "./index";

describe("Table", () => {
  type Data = { id: number; name: string; email: string };

  const columns: TableColumn<Data>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ];

  const data: Data[] = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ];

  it("renders table with headers", () => {
    render(<Table<Data, "id"> cols={columns} rows={data} rowId="id" />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders all data rows", () => {
    render(<Table<Data, "id"> cols={columns} rows={data} rowId="id" />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders empty string for null/undefined values", () => {
    const dataWithNull = [{ id: 3, name: "Bob", email: null }];
    // @ts-expect-error Testing null value handling
    render(<Table<Data, "id"> cols={columns} rows={dataWithNull} rowId="id" />);

    expect(screen.getByText("Bob")).toBeInTheDocument();
    const cells = screen.getAllByRole("cell");
    expect(cells[1]).toHaveTextContent("");
  });

  it("renders empty table with no rows", () => {
    render(<Table<Data, "id"> cols={columns} rows={[]} rowId="id" />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.queryByRole("row")).toBeInTheDocument(); // header row exists
  });

  it("uses rowId as key for rows", () => {
    const { container } = render(
      <Table<Data, "id"> cols={columns} rows={data} rowId="id" />,
    );
    const rows = container.querySelectorAll("tbody tr");

    expect(rows).toHaveLength(2);
  });
});
