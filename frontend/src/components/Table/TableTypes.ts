export type TableColumn<T> = {
  key: keyof T | "action";
  label: string;
  render?: (row: T) => React.ReactNode;
};

export type TableProps<T, K extends keyof T> = {
  cols: TableColumn<T>[];
  rows: T[];
  rowId: K;
};
