import { type TableProps } from "./TableTypes";
import styles from "./Table.module.css";
import type React from "react";

/**
 * A generic table component for displaying tabular data
 *
 * @param {TableColumn[]} props.cols - Array of column definitions with key and label
 * @param {T[]} props.rows - Array of data objects to display
 * @param {keyof T} props.rowId - The property name to use as the unique row key
 * @returns A table element with header and data rows
 *
 * @since 0.1.0
 *
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'email', label: 'Email' }
 * ];
 * const data = [
 *   { id: 1, name: 'John', email: 'john@example.com' },
 *   { id: 2, name: 'Jane', email: 'jane@example.com' }
 * ];
 * <Table cols={columns} rows={data} rowId="id" />
 * ```
 */
export const Table = <
  T extends Record<string, unknown>,
  K extends keyof T & React.Key,
>({
  cols,
  rows,
  rowId,
}: TableProps<T, K>) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {cols.map((col) => (
            <th key={String(col.key)}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[rowId])}>
            {cols.map((col) => (
              <td key={String(col.key)}>
                {col.render ? col.render(row) : String(row[col.key] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.displayName = "Table";
